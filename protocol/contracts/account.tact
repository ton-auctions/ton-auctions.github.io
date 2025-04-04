import "@stdlib/ownable";
import "./auctions";
import "./controller";


struct AuctionMeta {
    id: Int;
    name: String;
    description: String;
    address: Address;
    type: String;
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
    minimalAmount: Int;
    endsAt: Int as uint64;
}

message CleanUp {

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
    auctions: map<Int, AuctionMeta>,
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
    const MINIMAL_AUCTION_TIMESPAN: Int = 3600*5;
    const MAXIMAL_AUCTION_TIMESPAN: Int = 3600*30*24;

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

        self.reply(AccountCreated{}.toCell());
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
        let auctions: map<Int, AuctionMeta> = emptyMap();
        
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
        throwUnless(self.ERRORS_BAD_AUCTION_TOO_SHORT, msg.endsAt > now() + self.MINIMAL_AUCTION_TIMESPAN);
        throwUnless(self.ERRORS_BAD_AUCTION_TOO_LONG, msg.endsAt < now() + self.MAXIMAL_AUCTION_TIMESPAN);
        throwUnless(self.ERRORS_NOT_ENOUGH_ALLOWANCE, self.allowance > 0);
        throwUnless(self.ERRORS_AUCTION_ALREADY_EXISTS, !self.auctions.exists(msg.id));

        let init = initOf BasicAuction(
            msg.id,
            self.owner,
            myAddress(),
            self.collector,
            msg.minimalAmount,
            msg.endsAt,
            self.chat_id,
            null,
            false,
        );

        let meta = AuctionMeta {
            id: msg.id,
            name: msg.name,
            description: msg.description,
            address: contractAddress(init),
            type: "basic",
            ended: false,
            refund: false,
        };

        self.auctions.set(msg.id, meta);

        deploy(DeployParameters {
            mode: SendDefaultMode,
            value: ton("0.1"),
            bounce: true,
            init: init,
        });
        self.allowance -= 1;
    }

    bounced(msg: bounced<CreateBasicAuction>) { 
        if !self.auctions.exists(msg.id) {
            return
        }
        
        let auction = self.auctions.get(msg.id)!!;
        if (auction.address != sender()) {
            return
        }
        
        self.auctions.del(msg.id); 
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
        if service_comission > self.MINIMAL_COMMISSION_TO_BE_PAID {
            message(MessageParameters {
                mode: SendDefaultMode, // We put charge on ourselves
                to: self.collector,
                value: service_comission,
                body: ServiceComission{}.toCell(),
            });
        }

        let referral_amount = (amount * self.referral_comission) / 10000;
        if self.referree != null && referral_amount > self.MINIMAL_COMMISSION_TO_BE_PAID {
            message(MessageParameters {
                mode: SendDefaultMode, // Referree will pay the fee
                to: self.referree!!,
                value: referral_amount,
                body: ReferralCommission{}.toCell(),
            });
        }
        
        meta.ended = true;
        self.auctions.set(msg.id, meta);
        self.allowance += 1;
    }

    receive(_: ReferralCommission) {
        throwUnless(self.ERRORS_AUCTION_NOT_INITIALISED, self.initialised);

        // if self.referree == null {
        //     return
        // }

        let ctx = context();

        let referral_amount = ctx.value >> 1; // Halve it
        
        if referral_amount < self.MINIMAL_COMMISSION_TO_BE_PAID {
            // Not worth it
            return
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
        // message(MessageParameters {
        //     mode: SendDefaultMode, // Referree will pay the fee
        //     to: self.referree!!,
        //     value: referral_amount,
        //     body: ReferralCommission {}.toCell(),
        // });
    }

    receive(msg: Collect) {
        throwUnless(self.ERRORS_AUCTION_NOT_INITIALISED, self.initialised);
        throwUnless(self.ERRORS_UNAUTHORISED, sender() == self.owner);

        message(MessageParameters{
            mode: SendDefaultMode | SendRemainingBalance, 
            to: self.owner,
            value: msg.amount,
            body: ReferralCommission {}.toCell(),
        });
    }

    get fun version(): Int { return self.VERSION; }    

    get fun initialised(): Bool { return self.initialised; }
    get fun owner(): Address { return self.owner; }
    get fun referree(): Address? { return self.referree; }
    get fun serviceComission(): Int { return self.service_comission; }
    get fun referralComission(): Int { 
        if self.referree != null {
            return self.referral_comission; 
        }
        return 0;
    }
    get fun chatId(): Int { return self.chat_id; }
    get fun auction(id: Int): AuctionMeta? { return self.auctions.get(id); }
    get fun balance(): Int { return myBalance(); }
    get fun allowance(): Int { return self.allowance; }

    receive() {
        if self.initialised {
            return
        }

        self.reply(
            RequestInitialisation{
                user_account: myAddress(),
            }.toCell()
        )
    }
}

