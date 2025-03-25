import "@stdlib/ownable";
import "./auctions";
import "./controller";

const MaxArraySize: Int = 100;

struct AuctionMeta {
    id: Int;
    name: String;
    description: String;
    address: Address;
    type: String;
}

message Profit {
    id: Int;
    amount: Int as uint128;
}
message Collect {
    amount: Int as uint128
}
message AuctionCleanUp {}

message ReferralCommission {}
message CreateBasicAuction {
    id: Int as uint64;
    name: String;
    description: String;
    minimal_amount: Int;
    ends_at: Int as uint64;
    comission: Int as uint16;
}

// 
// Account might have referral and might not. If not referral_comission field is ignored
// In case referral is notspecified controller will assign sum of comissions into comission field.
// 
contract Account(
    collector: Address,
    owner: Address,
    referree: Address?,
    comission: Int as uint16,
    referral_comission: Int as uint16,
    chat_id: Int,
    auctions: map<Int, AuctionMeta>,
) {
    const VERSION: Int = 1;
    const ERRORS_UNAUTHORISED: Int = 201;

    const MINIMAL_COMMISSION_TO_BE_PAID: Int = ton("0.1");
    const NO_WINNER: Winner = Winner {
        address: null,
        amount: 0,
        chat_id: 0,
    };


    receive(msg: CreateBasicAuction) {
        throwUnless(self.ERRORS_UNAUTHORISED, sender() == self.owner);
        
        let init = initOf BasicAuction(
            msg.id,
            self.owner,
            self.collector,
            msg.minimal_amount,
            msg.ends_at,
            self.chat_id,
            self.NO_WINNER,
        );

        let meta = AuctionMeta {
            id: msg.id,
            name: msg.name,
            description: msg.description,
            address: contractAddress(init),
            type: "basic",
        };

        self.auctions.set(msg.id, meta);

        // https://docs.tact-lang.org/ref/core-common/
        deploy(DeployParameters {
            mode: SendDefaultMode,
            value: ton("0.1"),
            bounce: true,
            init: init,
        });
    }

    receive(msg: Profit) {
        let ctx = context();

        let service_comission = (msg.value * self.comission) / 10000;
        if service_comission > self.MINIMAL_COMMISSION_TO_BE_PAID {
            message(MessageParameters {
                mode: SendDefaultMode, // We put charge on ourselves
                to: self.collector,
                value: service_comission,
                body: ServiceComission{}.toCell(),
            });
        }

        let referral_amount = (ctx.value * self.referral_comission) / 10000;
        if self.referree != null && referral_amount > self.MINIMAL_COMMISSION_TO_BE_PAID {
            message(MessageParameters {
                mode: SendDefaultMode, // Referree will pay the fee
                to: self.referree!!,
                value: referral_amount,
                body: ReferralCommission{}.toCell(),
            });
        }

        self.auctions.del(msg.id);
    }

    receive(_: ReferralCommission) {
        if self.referree == null {
            // No referree
            return
        }

        let ctx = context();

        let referral_amount = ctx.value >> 1; // Halve it
        
        if referral_amount < self.MINIMAL_COMMISSION_TO_BE_PAID {
            // Not worth it
            return
        }

        message(MessageParameters {
            mode: SendDefaultMode, // Referree will pay the fee
            to: self.referree!!,
            value: referral_amount,
            body: ReferralCommission {}.toCell(),
        });
    }

    receive(msg: Collect) {
        throwUnless(self.ERRORS_UNAUTHORISED, sender() == self.owner);

        message(MessageParameters{
            mode: SendDefaultMode | SendRemainingBalance, 
            to: self.owner,
            value: msg.amount,
            body: ReferralCommission {}.toCell(),
        });
    }

    get fun version(): Int { return self.VERSION; }    

    get fun owner(): Address { return self.owner; }
    get fun referree(): Address? { return self.referree; }
    get fun comission(): Int { return self.comission; }
    get fun referral_comission(): Int { 
        if self.referree != null {
            return self.referral_comission; 
        }
        return 0;
    }
    get fun chat_id(): Int { return self.chat_id; }
    get fun auction(id: Int): AuctionMeta? { return self.auctions.get(id); }
    get fun balance(): Int { return myBalance(); }

    receive() {
    }
}

