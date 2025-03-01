import "@stdlib/deploy";
import "@stdlib/ownable";

message Bid {
    chat_id: Int
}

struct Winner {
    address: Address?;
    amount: Int as uint128;
    chat_id: Int as uint64;
}

contract SimplestAuction with Deployable, Ownable {
    
    const ERRORS_AMOUNT_IS_TOO_SMALL: Int = 101;
    const ERRORS_BID_IS_TOO_SMALL: Int = 102;
    const ERRORS_FINISHED: Int = 103;
    const ERRORS_NOONE_WINS: Int = 104;
    const ERRORS_NOT_ALLOWED: Int = 106;
    const COMMISSION_INVALID: Int = 107;

    const EVENT_OUTBIDDED: Int = 1;
    const EVENT_RESOLVED: Int = 2;

    owner: Address;
    collector: Address;
    referree: Address?;
    minimal_amount: Int as uint128;
    ends_at: Int as uint128;
    commission: Int as uint8;
    referral_comission: Int as uint8;
    chat_id: Int;

    winner: Winner = Winner {
        address: null, 
        amount: 0, 
        chat_id: 0,
    };

    init(
        owner: Address,
        minimal_amount: Int,
        ends_at: Int,
        comission: Int,
        chat_id: Int,
        referral_comission: Int,
        collector: Address,
        referree: Address?,
    ) {
        throwUnless(self.COMMISSION_INVALID, referral_comission >= comission);

        self.owner = owner;
        self.collector = collector;
        self.referree = referree;
        self.minimal_amount = minimal_amount;
        self.ends_at = ends_at;
        self.commission = comission;
        self.referral_comission = referral_comission;
        self.chat_id = chat_id;
    }

    receive(msg: Bid) {
        throwUnless(self.ERRORS_FINISHED, self.ends_at > now());
        
        let context = context();
        let amount = context.value;
        let bidder = context.sender;

        throwUnless(self.ERRORS_AMOUNT_IS_TOO_SMALL, amount > self.minimal_amount);
        throwUnless(self.ERRORS_BID_IS_TOO_SMALL, amount > self.winner.amount);
    
        // Return the money to the previous winner
        send(SendParameters{
            mode: SendDefaultMode,
            to: self.winner.address!!,
            value: self.winner.amount,
        });


        let event_outbidded = beginCell()
            .storeUint(self.EVENT_OUTBIDDED, 4)
            .storeUint(self.winner.chat_id, 64)
            .storeUint(self.winner.amount, 128)
            .storeAddress(bidder)
            .asCell();
    
        emit(event_outbidded);

        // Assign new winner
        self.winner = Winner{
            amount: amount,
            address: bidder,
            chat_id: msg.chat_id,
        }      
    }

    receive("resolve") {
        let sender = sender();
        
        throwUnless(self.ERRORS_NOONE_WINS, self.winner.address != null);
        throwUnless(self.ERRORS_NOT_ALLOWED, sender != self.owner && sender != self.collector);
        
        let service_comission = self.winner.amount * self.commission / 100;
        
        let referral_comission = 0;
        if self.referree != null {
            referral_comission += self.winner.amount * self.referral_comission / 100;
        }
        
        let winning_amount = self.winner.amount - service_comission;


        send(SendParameters{
            to: self.winner.address!!,
            value: winning_amount,
        });

        send(SendParameters{
            to: self.collector,
            value: service_comission - referral_comission,
        });

        if referral_comission > 0 {
            send(SendParameters{
                to: self.referree!!,
                value: referral_comission,
            });
        }

        let auction_resolved = beginCell()
            .storeUint(self.EVENT_RESOLVED, 4)
            .storeUint(self.winner.chat_id, 64)
            .storeUint(self.chat_id, 64)
            .asCell();

        emit(auction_resolved);
    }
}