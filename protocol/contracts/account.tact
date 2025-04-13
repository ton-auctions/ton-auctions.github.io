import "@stdlib/ownable";
import "./auctions";
import "./controller";

struct AuctionConfig {
    id: Int;
    name: String;
    description: String;
    address: Address;
    type: String;
    ends_at: Int as uint64;
    minimal_amount: Int as uint128;
    ended: Bool;
    refund: Bool;
}

message Profit {
    id: Int;
    amount: Int as uint128;
}

message Collect {
    amount: Int as uint128;
}

message AuctionDeleted {
    id: Int as uint64;
    refund: Bool;
}

message AccountDelete {}

struct AccountInitialisation {
    chat_id: Int as uint64;
    referree: Address?;
    service_comission: Int as uint16;
    referral_comission: Int as uint16;
    max_allowance: Int as uint16;
}

message Initialize {
    chat_id: Int as uint64;
    referree: Address?;
    service_comission: Int as uint16;
    referral_comission: Int as uint16;
    max_allowance: Int as uint16;
}

message ReferralCommission {}

message CreateBasicAuction {
    id: Int as uint64;
    name: String;
    description: String;
    minimal_amount: Int;
    ends_at: Int as uint64;
}

struct CreateBasicAuctionData {
    id: Int as uint64;
    name: String;
    description: String;
    minimal_amount: Int;
    ends_at: Int as uint64;
}

message CleanUp {}

struct AccountData {
    initialised: Bool;
    version: Int;
    owner: Address;
    service_comission: Int as uint16;
    referral_comission: Int as uint16;
    max_allowance: Int;
    allowance: Int;
    balance: Int;
    auctions: map<Int, AuctionConfig>;
    chat_id: Int;
    referree: Address?;
}

//
// Account might have referral and might not. If not referral_comission field is ignored
// In case referral is notspecified controller will assign sum of comissions into comission field.
//
contract Account(
    collector: Address,
    owner: Address,
    referree: Address?,
    service_comission: Int as uint16,
    referral_comission: Int as uint16,
    chat_id: Int,
    auctions: map<Int, AuctionConfig>,
    max_allowance: Int,
    allowance: Int,
    initialised: Bool,
) {
    const VERSION: Int = 1;
    const ERRORS_UNAUTHORISED: Int = 201;
    const ERRORS_BAD_AUCTION_TOO_SHORT: Int = 202;
    const ERRORS_BAD_AUCTION_TOO_LONG: Int = 203;
    const ERRORS_AUCTION_NOT_EXIST: Int = 204;
    const ERRORS_WRONG_AUCTION_ADDRESS: Int = 205;
    const ERRORS_AUCTION_NOT_INITIALISED: Int = 206;
    const ERRORS_AUCTION_INITIALISED: Int = 207;
    const ERRORS_NOT_ENOUGH_ALLOWANCE: Int = 208;
    const ERRORS_AUCTION_ALREADY_EXISTS: Int = 209;

    const MINIMAL_COMMISSION_TO_BE_PAID: Int = ton("0.1");
    const MINIMAL_AUCTION_TIMESPAN: Int = 3600 * 5;
    const MAXIMAL_AUCTION_TIMESPAN: Int = 3600 * 30 * 24;

    const EVENT_ACCOUNT_CREATED: Int = 1000;

    receive(msg: Initialize) {
        throwUnless(self.ERRORS_AUCTION_NOT_EXIST, sender() == self.collector);
        throwUnless(self.ERRORS_AUCTION_INITIALISED, !self.initialised);

        self.chat_id = msg.chat_id;
        self.referree = msg.referree;
        self.service_comission = msg.service_comission;
        self.referral_comission = msg.referral_comission;
        self.max_allowance = msg.max_allowance;
        self.allowance = msg.max_allowance;

        self.initialised = true;

        self.reply(AccountCreated {}.toCell());
    }

    receive(msg: ConfigureAccount) {
        throwUnless(self.ERRORS_AUCTION_NOT_EXIST, sender() == self.collector);
        throwUnless(self.ERRORS_AUCTION_NOT_EXIST, myAddress() == msg.address);

        self.service_comission = msg.service_comission;
        self.referral_comission = msg.referral_comission;
        let allowance_change = msg.max_allowance - self.max_allowance;
        self.allowance += allowance_change;
        self.max_allowance = msg.max_allowance;
    }

    receive(msg: AuctionDeleted) {
        throwUnless(self.ERRORS_AUCTION_NOT_INITIALISED, self.initialised);
        throwUnless(self.ERRORS_AUCTION_NOT_EXIST, self.auctions.exists(msg.id));

        let meta = self.auctions.get(msg.id)!!;
        throwUnless(self.ERRORS_WRONG_AUCTION_ADDRESS, meta.address == sender());

        meta.ended = true;
        meta.refund = msg.refund;
        self.auctions.set(msg.id, meta);
        self.allowance += 1;
    }

    receive(msg: CleanUp) {
        throwUnless(self.ERRORS_AUCTION_NOT_INITIALISED, self.initialised);
        let sender = sender();
        throwUnless(self.ERRORS_UNAUTHORISED, sender == self.owner || sender == self.collector);

        let allowance = 10;
        let auctions: map<Int, AuctionConfig> = emptyMap();

        foreach (key, auction in self.auctions) {
            if !auction.ended {
                auctions.set(auction.id, auction);
                allowance -= 1;
            }
        }

        self.auctions = auctions;
        self.allowance = allowance;
    }

    receive(msg: CreateBasicAuction) {
        throwUnless(self.ERRORS_AUCTION_NOT_INITIALISED, self.initialised);
        throwUnless(self.ERRORS_UNAUTHORISED, sender() == self.owner);
        throwUnless(self.ERRORS_BAD_AUCTION_TOO_SHORT, msg.ends_at > now() + self.MINIMAL_AUCTION_TIMESPAN);
        throwUnless(self.ERRORS_BAD_AUCTION_TOO_LONG, msg.ends_at < now() + self.MAXIMAL_AUCTION_TIMESPAN);
        throwUnless(self.ERRORS_NOT_ENOUGH_ALLOWANCE, self.allowance > 0);
        throwUnless(self.ERRORS_AUCTION_ALREADY_EXISTS, !self.auctions.exists(msg.id));

        let init = initOf BasicAuction(
            msg.id,
            msg.name,
            msg.description,
            self.owner,
            myAddress(),
            self.collector,
            msg.minimal_amount,
            msg.ends_at,
            self.chat_id,
            null,
            false,
            false,
        );

        let meta = AuctionConfig {
            id: msg.id,
            name: msg.name,
            description: msg.description,
            address: contractAddress(init),
            ends_at: msg.ends_at,
            minimal_amount: msg.minimal_amount,
            type: "basic",
            ended: false,
            refund: false,
        };

        self.auctions.set(msg.id, meta);

        deploy(DeployParameters {
            mode: SendDefaultMode | SendRemainingValue,
            value: ton("0"),
            bounce: true,
            init: init,
        });
        self.allowance -= 1;
    }

    bounced(msg: bounced<CreateBasicAuction>) {
        if !self.auctions.exists(msg.id) { return }

        let auction = self.auctions.get(msg.id)!!;
        if (auction.address != sender()) { return }

        let _ = self.auctions.del(msg.id);
        self.allowance += 1;
    }

    receive(msg: Profit) {
        throwUnless(self.ERRORS_AUCTION_NOT_INITIALISED, self.initialised);
        throwUnless(self.ERRORS_AUCTION_NOT_EXIST, self.auctions.exists(msg.id));

        let ctx = context();
        let sender = ctx.sender;
        let amount = min(msg.amount, ctx.value);

        let meta = self.auctions.get(msg.id)!!;
        throwUnless(self.ERRORS_WRONG_AUCTION_ADDRESS, sender == meta.address);

        let service_comission = (amount * self.service_comission) / 10000;
        message(MessageParameters {
            mode: SendDefaultMode, // We put charge on ourselves
            to: self.collector,
            value: service_comission,
            body: ServiceComission {}.toCell(),
        });

        let referral_amount = (amount * self.referral_comission) / 10000;
        if self.referree != null {
            message(MessageParameters {
                mode: SendDefaultMode, // Referree will pay the fee
                to: self.referree!!,
                value: referral_amount,
                body: ReferralCommission {}.toCell(),
            });
        }

        meta.ended = true;
        self.auctions.set(msg.id, meta);
        self.allowance += 1;
    }

    receive(_: ReferralCommission) {
        throwUnless(self.ERRORS_AUCTION_NOT_INITIALISED, self.initialised);

        let ctx = context();
        let forwardFee = ctx.readForwardFee();
        let referral_amount = ctx.value >> 1; // Halve it

        if referral_amount < forwardFee {
            // Not worth it
            return;
        }

        if self.referree == null {
            message(MessageParameters {
                mode: SendDefaultMode, // Collector will pay the fee
                to: self.collector,
                value: referral_amount,
                body: ServiceComission {}.toCell(),
            });
        } else {
            message(MessageParameters {
                mode: SendDefaultMode, // Referree will pay the fee
                to: self.referree!!,
                value: referral_amount,
                body: ReferralCommission {}.toCell(),
            });
        }
    }

    receive(msg: Collect) {
        throwUnless(self.ERRORS_AUCTION_NOT_INITIALISED, self.initialised);
        throwUnless(self.ERRORS_UNAUTHORISED, sender() == self.owner);

        message(MessageParameters {
            mode: SendDefaultMode | SendRemainingBalance,
            to: self.owner,
            value: msg.amount,
            body: ReferralCommission {}.toCell(),
        });
    }

    get fun balance(): Int {
        return myBalance();
    }

    get fun allowance(): Int {
        return self.allowance;
    }

    get fun auction(id: Int): AuctionConfig? {
        return self.auctions.get(id);
    }

    get fun auctionAddress(
        data: CreateBasicAuctionData,
    ): Address {
        let init = initOf BasicAuction(
            data.id,
            data.name,
            data.description,
            self.owner,
            myAddress(),
            self.collector,
            data.minimal_amount,
            data.ends_at,
            self.chat_id,
            null,
            false,
            false,
        );
        return contractAddress(init);
    }

    get fun data(): AccountData {
        return AccountData {
            initialised: self.initialised,
            version: self.VERSION,
            owner: self.owner,
            service_comission: self.service_comission,
            referral_comission: self.referral_comission,
            max_allowance: self.max_allowance,
            allowance: self.allowance,
            balance: myBalance(),
            auctions: self.auctions,
            chat_id: self.chat_id,
            referree: self.referree,
        };
    }

    receive(msg: AccountDelete) {
        throwUnless(self.ERRORS_UNAUTHORISED, sender() == self.owner);

        send(SendParameters {
            to: self.owner,
            value: 0,
            mode: SendRemainingBalance | SendDestroyIfZero,
            body: null,
        });
    }

    receive() {
        if self.initialised { return }

        self.reply(
            RequestInitialisation {
                user_account: myAddress(),
            }.toCell(),
        );
    }
}
