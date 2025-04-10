import "@stdlib/ownable";
import "./account";

message Bid { chat_id: Int }

struct Winner {
    address: Address;
    amount: Int as uint128;
    chat_id: Int as int64;
}

message Resolve {}

message Delete {}

contract BasicAuction(
    id: Int as uint64,
    name: String,
    description: String,
    owner: Address,
    owner_account: Address,
    collector: Address,
    minimal_amount: Int as uint128,
    ends_at: Int as uint64,
    owner_chat_id: Int,
    winner: Winner?,
    ended: Bool,
    refund: Bool,
) with Ownable {
    const ERRORS_BID_IS_TOO_SMALL: Int = 201;
    const ERRORS_BID_RAISE_IS_TOO_SMALL: Int = 202;
    const ERRORS_FINISHED: Int = 203;
    const ERRORS_NOT_ALLOWED: Int = 206;
    const ERRORS_OWNER_BID_NOT_ALLOWED: Int = 207;
    const ERRORS_ENDED: Int = 208;
    const ERRORS_HAS_WINNER: Int = 209;
    const ERRORS_UNFINISHED: Int = 210;

    const EVENT_OUTBIDDED: Int = 1;
    const EVENT_RESOLVED: Int = 2;
    const MINIMAL_RAISE: Int = ton("0.5");

    receive(msg: Delete) {
        let sender = sender();

        throwUnless(self.ERRORS_NOT_ALLOWED, sender == self.owner || sender == self.collector);
        throwUnless(self.ERRORS_HAS_WINNER, !self.ended && self.winner == null);

        self.ended = true;

        message(MessageParameters {
            mode: SendDefaultMode | SendRemainingBalance,
            to: self.owner_account,
            value: 0,
            body: AuctionDeleted { id: self.id, refund: false }.toCell(),
            bounce: false,
        });
    }

    receive(msg: Bid) {
        throwUnless(self.ERRORS_ENDED, !self.ended);
        throwUnless(self.ERRORS_FINISHED, self.ends_at > now());

        let context = context();
        let amount = context.value;
        let bidder = context.sender;

        // throwUnless(self.ERRORS_OWNER_BID_NOT_ALLOWED, bidder != self.owner);
        throwUnless(self.ERRORS_BID_IS_TOO_SMALL, amount >= self.minimal_amount);

        if self.winner != null {
            let winner = self.winner!!;

            throwUnless(self.ERRORS_BID_IS_TOO_SMALL, amount > winner.amount);

            let five_percent = winner.amount * 5 / 100;
            let minimal_raise = max(self.MINIMAL_RAISE, five_percent);

            throwUnless(self.ERRORS_BID_RAISE_IS_TOO_SMALL, amount > winner.amount + minimal_raise);

            // Return the money to the previous winner
            message(MessageParameters {
                mode: SendDefaultMode,
                to: winner.address,
                value: winner.amount,
            });

            let event_outbidded = beginCell()
                .storeUint(self.EVENT_OUTBIDDED, 4)
                .storeUint(winner.chat_id, 64)
                .storeUint(winner.amount, 128)
                .storeAddress(bidder)
                .asCell();

            emit(event_outbidded);
        }

        // Assign new winner
        self.winner = Winner {
            amount: amount,
            address: bidder,
            chat_id: msg.chat_id,
        };
    }

    receive(_: Resolve) {
        throwUnless(self.ERRORS_ENDED, !self.ended);
        throwUnless(self.ERRORS_UNFINISHED, self.ends_at < now());

        let sender = sender();

        throwUnless(self.ERRORS_NOT_ALLOWED, sender == self.owner || sender == self.collector);

        let auction_resolved = beginCell()
            .storeUint(self.EVENT_RESOLVED, 4)
            .storeUint(self.owner_chat_id, 255);

        self.ended = true;

        if self.winner == null {
            emit(auction_resolved.asCell());
            self.refund = true;
            message(MessageParameters {
                mode: SendDefaultMode | SendRemainingBalance,
                to: self.owner_account,
                value: 0,
                body: AuctionDeleted { id: self.id, refund: true }.toCell(),
            });
        } else {
            let winner = self.winner!!;

            auction_resolved = auction_resolved.storeUint(winner.chat_id, 64);
            emit(auction_resolved.asCell());

            message(MessageParameters {
                mode: SendDefaultMode | SendRemainingBalance,
                to: self.owner_account,
                value: 0,
                body: Profit {
                    id: self.id,
                    amount: winner.amount,
                }.toCell(),
            });
        }
    }

    receive() {}

    get fun id(): Int {
        return self.id;
    }

    get fun has_ended(): Bool {
        return self.ended;
    }

    get fun can_be_resolved(): Bool {
        return self.ends_at > now();
    }

    get fun can_be_deleted(): Bool {
        return self.winner == null;
    }

    get fun winner(): Winner? {
        return self.winner;
    }

    get fun ends_at(): Int {
        return self.ends_at;
    }

    get fun minimal_amount(): Int {
        return self.minimal_amount;
    }

    get fun minimal_raise(): Int {
        if self.winner != null {
            let five_percent = self.winner!!.amount * 5 / 100;
            return max(self.MINIMAL_RAISE, five_percent);
        } else {
            return self.minimal_amount;
        }
    }

    get fun owner_chat_id(): Int {
        return self.owner_chat_id;
    }

    get fun balance(): Int {
        return myBalance();
    }

    get fun data(): AuctionConfig {
        return AuctionConfig {
            id: self.id,
            name: self.name,
            description: self.description,
            address: myAddress(),
            type: "basic",
            ends_at: self.ends_at,
            minimal_amount: self.minimal_amount,
            ended: self.ended,
            refund: self.refund,
        };
    }
}
