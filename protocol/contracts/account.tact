import "@stdlib/ownable";
import "./auctions";
import "./controller";
import "./messages/accountMessages";

// TODO: change amount types to coins.
// TODO: rework id generation.


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

struct AccountData {
    collector: Address;
    version: Int;
    balance: Int?;
    owner: Address;
    referree: Address?;
    service_comission: Int as uint16;
    referral_comission: Int as uint16;
    auctions: map<Int, AuctionConfig>;
    max_allowance: Int;
    allowance: Int;
    initialised: Bool;
    secret_id: Cell;
}

//
// Account might have referral and might not. If not referral_comission field is ignored
// In case referral is notspecified controller will assign sum of comissions into comission field.
//
contract Account(
    data: AccountData
) {
    const ERRORS_UNAUTHORISED: Int = 201;
    const ERRORS_BAD_AUCTION_TOO_SHORT: Int = 202;
    const ERRORS_BAD_AUCTION_TOO_LONG: Int = 203;
    
    const ERRORS_ACCOUNT_NOT_EXIST: Int = 204;
    const ERRORS_ACCOUNT_NOT_INITIALISED: Int = 206;
    const ERRORS_ACCOUNT_INITIALISED: Int = 207;
    
    const ERRORS_AUCTION_ADDRESS_MISMATCH: Int = 205;
    const ERRORS_AUCTION_ALREADY_EXISTS: Int = 209;
    const ERRORS_AUCTION_NOT_FOUND: Int = 210;
    
    const ERRORS_NOT_ENOUGH_ALLOWANCE: Int = 208;
    
    
    const MINIMAL_AUCTION_TIMESPAN: Int = 3600 * 5;
    const MAXIMAL_AUCTION_TIMESPAN: Int = 3600 * 30 * 24;

    receive(msg: Initialise) {
        throwUnless(self.ERRORS_UNAUTHORISED, sender() == self.data.collector);
        throwUnless(self.ERRORS_ACCOUNT_NOT_INITIALISED, !self.data.initialised);

        self.data.secret_id = msg.secret_id;
        self.data.referree = msg.referree;
        self.data.service_comission = msg.service_comission;
        self.data.referral_comission = msg.referral_comission;
        self.data.max_allowance = msg.max_allowance;
        self.data.allowance = msg.max_allowance;

        self.data.initialised = true;

        // Validiti checks owner != null, and so on.

        message(MessageParameters {
            mode: SendDefaultMode, // We put charge on account and keep funds sent in it.
            to: self.data.collector,
            value: ton("0.01"),
            body: AccountCreated {}.toCell(),
        });

        emit(
            AccountInitialisedEvent {
                address: myAddress(),
                secret_id: self.data.secret_id,
            }.toCell(),
        );
    }

    receive(msg: ConfigureAccount) {
        throwUnless(self.ERRORS_UNAUTHORISED, sender() == self.data.collector);
        throwUnless(self.ERRORS_ACCOUNT_NOT_EXIST, myAddress() == msg.address);

        self.data.service_comission = msg.service_comission;
        self.data.referral_comission = msg.referral_comission;
        
        let allowance_change = msg.max_allowance - self.data.max_allowance;
        
        self.data.allowance += allowance_change;
        self.data.max_allowance = msg.max_allowance;
    }

    receive(msg: AuctionDeleted) {
        throwUnless(self.ERRORS_ACCOUNT_NOT_INITIALISED, self.data.initialised);
        throwUnless(self.ERRORS_AUCTION_NOT_FOUND, self.data.auctions.exists(msg.id));

        let meta = self.data.auctions.get(msg.id)!!;
        throwUnless(self.ERRORS_AUCTION_ADDRESS_MISMATCH, meta.address == sender());

        meta.ended = true;
        meta.refund = msg.refund;

        self.data.auctions.set(msg.id, meta);
        self.data.allowance += 1;
    }

    receive(msg: CleanUp) {
        throwUnless(self.ERRORS_ACCOUNT_NOT_INITIALISED, self.data.initialised);
        
        let sender = sender();
        throwUnless(self.ERRORS_UNAUTHORISED, sender == self.data.owner || sender == self.data.collector);

        let allowance = 10;
        let auctions: map<Int, AuctionConfig> = emptyMap();

        foreach (key, auction in self.data.auctions) {
            if !auction.ended {
                auctions.set(auction.id, auction);
                allowance -= 1;
            }
        }

        self.data.auctions = auctions;
        self.data.allowance = allowance;
    }

    receive(msg: CreateBasicAuction) {
        throwUnless(self.ERRORS_ACCOUNT_NOT_INITIALISED, self.data.initialised);
        throwUnless(self.ERRORS_UNAUTHORISED, sender() == self.data.owner);
        throwUnless(self.ERRORS_BAD_AUCTION_TOO_SHORT, msg.ends_at > now() + self.MINIMAL_AUCTION_TIMESPAN);
        throwUnless(self.ERRORS_BAD_AUCTION_TOO_LONG, msg.ends_at < now() + self.MAXIMAL_AUCTION_TIMESPAN);
        throwUnless(self.ERRORS_NOT_ENOUGH_ALLOWANCE, self.data.allowance > 0);
        throwUnless(self.ERRORS_AUCTION_ALREADY_EXISTS, !self.data.auctions.exists(msg.id));

        let init = initOf BasicAuction(
            BasicAuctionData {
                id: msg.id,
                type: "basic",
                balance: null,
                name: msg.name,
                description: msg.description,
                owner: self.data.owner,
                owner_account: myAddress(),
                collector: self.data.collector,
                minimal_amount: msg.minimal_amount,
                minimal_raise: 0,
                ends_at: msg.ends_at,
                winner: null,
                ended: false,
                refund: false,
                owner_secret_id: msg.secret_id,
            }
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

        self.data.auctions.set(msg.id, meta);

        deploy(DeployParameters {
            mode: SendDefaultMode | SendRemainingValue,
            value: ton("0"),
            bounce: true,
            init: init,
        });
        self.data.allowance -= 1;
    }

    bounced(msg: bounced<CreateBasicAuction>) {
        if !self.data.auctions.exists(msg.id) { return }

        let auction = self.data.auctions.get(msg.id)!!;
        if (auction.address != sender()) { return }

        let _ = self.data.auctions.del(msg.id);
        self.data.allowance += 1;
    }

    receive(msg: Profit) {
        throwUnless(self.ERRORS_ACCOUNT_NOT_INITIALISED, self.data.initialised);
        throwUnless(self.ERRORS_AUCTION_NOT_FOUND, self.data.auctions.exists(msg.id));

        let ctx = context();
        let sender = ctx.sender;
        let amount = min(msg.amount, ctx.value);

        let meta = self.data.auctions.get(msg.id)!!;
        throwUnless(self.ERRORS_AUCTION_ADDRESS_MISMATCH, sender == meta.address);

        let service_comission = (amount * self.data.service_comission) / 10000;
        message(MessageParameters {
            mode: SendDefaultMode, // We put charge on ourselves
            to: self.data.collector,
            value: service_comission,
            body: ServiceComission {}.toCell(),
        });

        let referral_amount = (amount * self.data.referral_comission) / 10000;
        if self.data.referree != null {
            message(MessageParameters {
                mode: SendDefaultMode, // Referree will pay the fee
                to: self.data.referree!!,
                value: referral_amount,
                body: ReferralCommission {}.toCell(),
            });
        }

        meta.ended = true;
        self.data.auctions.set(msg.id, meta);
        self.data.allowance += 1;

        emit(
            ProfitReceivedEvent {
                amount: amount,
                address: myAddress(),
                secret_id: self.data.secret_id,
            }.toCell()
        );
    }

    receive(_: ReferralCommission) {
        throwUnless(self.ERRORS_ACCOUNT_NOT_INITIALISED, self.data.initialised);

        let ctx = context();
        let forwardFee = ctx.readForwardFee();
        let referral_amount = ctx.value >> 1; // Halve it

        if referral_amount < forwardFee {
            // Not worth it
            return;
        }

        if self.data.referree == null {
            message(MessageParameters {
                mode: SendDefaultMode, // Collector will pay the fee
                to: self.data.collector,
                value: referral_amount,
                body: ServiceComission {}.toCell(),
            });
        } else {
            message(MessageParameters {
                mode: SendDefaultMode, // Referree will pay the fee
                to: self.data.referree!!,
                value: referral_amount,
                body: ReferralCommission {}.toCell(),
            });
        }
    }

    receive(_: Collect) {
        throwUnless(self.ERRORS_ACCOUNT_NOT_INITIALISED, self.data.initialised);
        throwUnless(self.ERRORS_UNAUTHORISED, sender() == self.data.owner);

        message(MessageParameters {
            mode: SendDefaultMode | SendRemainingBalance,
            to: self.data.owner,
            value: 0,
            body: null,
        });
    }

    receive(msg: AccountDelete) {
        throwUnless(self.ERRORS_UNAUTHORISED, sender() == self.data.owner);

        self.data.initialised = false;

        message(MessageParameters {
            to: self.data.owner,
            value: 0,
            mode: SendRemainingBalance | SendDestroyIfZero,
            body: null,
        });
    }

    receive() {
        let sender = sender();
        throwUnless(self.ERRORS_UNAUTHORISED, sender == self.data.collector || sender == self.data.owner);

        if (self.data.initialised) {
            return
        }

        self.reply(RequestInitialisation {}.toCell());
    }

    get fun data(): AccountData {
        let tmp = self.data;
        tmp.balance = myBalance();
        return tmp;
    }
}
