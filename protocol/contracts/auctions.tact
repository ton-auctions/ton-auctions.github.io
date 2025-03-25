import "@stdlib/ownable";
import "./account";

message Bid {
    chat_id: Int
}

struct Winner {
    address: Address?;
    amount: Int as uint128;
    chat_id: Int as int64;
}

message Resolve {}

contract BasicAuction(
    id: Int as uint64,
    owner: Address,
    collector: Address,
    minimal_amount: Int as uint128,
    ends_at: Int as uint64,
    chat_id: Int,
    winner: Winner,
) with Ownable {
    
    const ERRORS_AMOUNT_IS_TOO_SMALL: Int = 101;
    const ERRORS_BID_IS_TOO_SMALL: Int = 102;
    const ERRORS_FINISHED: Int = 103;
    const ERRORS_NOONE_WINS: Int = 104;
    const ERRORS_NOT_ALLOWED: Int = 106;
    const EVENT_OUTBIDDED: Int = 1;
    const EVENT_RESOLVED: Int = 2;

    receive(msg: Bid) {
        throwUnless(self.ERRORS_FINISHED, self.ends_at > now());
        
        let context = context();
        let amount = context.value;
        let bidder = context.sender;

        throwUnless(self.ERRORS_AMOUNT_IS_TOO_SMALL, amount > self.minimal_amount);
        throwUnless(self.ERRORS_BID_IS_TOO_SMALL, amount > self.winner.amount);
    
        // Return the money to the previous winner
        message(MessageParameters {
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
        self.winner = Winner {
            amount: amount,
            address: bidder,
            chat_id: msg.chat_id,
        };
    }

    receive(_: Resolve) {
        let sender = sender();
        
        throwUnless(self.ERRORS_NOONE_WINS, self.winner.address != null);
        throwUnless(self.ERRORS_NOT_ALLOWED, sender != self.owner && sender != self.collector);

        message(MessageParameters {
            mode: SendDefaultMode | SendRemainingBalance, 
            to: self.owner,
            value: 0,
            body: Profit{
                id: self.id,
                amount: self.winner.amount,
            }.toCell(),
        });

        let auction_resolved = beginCell()
            .storeUint(self.EVENT_RESOLVED, 4)
            .storeUint(self.winner.chat_id, 64)
            .storeUint(self.chat_id, 64)
            .asCell();

        emit(auction_resolved);
    }

    receive(_: EmergencyResolve) {
        let sender = sender();

        throwUnless(self.ERRORS_NOT_ALLOWED, sender != self.owner);

        message(MessageParameters {
            mode: SendDefaultMode | SendRemainingBalance, 
            to: self.collector,
            value: 0,
            body: Emergency{
                id: self.id,
            }.toCell(),
        });
    }
}
