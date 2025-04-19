import "@stdlib/ownable";
import "./account";
import "./messages/auctionMessages";

struct Winner {
    address: Address;
    amount: Int as uint128;
    secret_id: Cell;
}

struct BasicAuctionData {
    id: Int;
    name: String;
    description: String;
    owner: Address;
    owner_account: Address;
    owner_secret_id: Cell;
    collector: Address;
    type: String;
    minimal_amount: Int;
    ended: Bool;
    refund: Bool;
    ends_at: Int;
    balance: Int?;
    minimal_raise: Int;
    winner: Winner?;
}

contract BasicAuction(
    data: BasicAuctionData,
) {
    const ERRORS_BID_IS_TOO_SMALL: Int = 201;
    const ERRORS_BID_RAISE_IS_TOO_SMALL: Int = 202;
    const ERRORS_FINISHED: Int = 203;
    const ERRORS_NOT_ALLOWED: Int = 206;
    const ERRORS_OWNER_BID_NOT_ALLOWED: Int = 207;
    const ERRORS_ENDED: Int = 208;
    const ERRORS_HAS_WINNER: Int = 209;
    const ERRORS_UNFINISHED: Int = 210;

    const MINIMAL_RAISE: Int = ton("0.5");

    receive(msg: Delete) {
        let sender = sender();

        throwUnless(self.ERRORS_NOT_ALLOWED, sender == self.data.owner || sender == self.data.collector);
        throwUnless(self.ERRORS_HAS_WINNER, !self.data.ended && self.data.winner == null);

        self.data.ended = true;

        message(MessageParameters {
            mode: SendDefaultMode | SendRemainingBalance,
            to: self.data.owner_account,
            value: 0,
            body: AuctionDeleted { id: self.data.id, refund: false }.toCell(),
            bounce: false,
        });
    }

    receive(msg: Bid) {
        throwUnless(self.ERRORS_ENDED, !self.data.ended);
        throwUnless(self.ERRORS_FINISHED, self.data.ends_at > now());

        let context = context();
        let amount = context.value;
        let bidder = context.sender;

        // throwUnless(self.ERRORS_OWNER_BID_NOT_ALLOWED, bidder != self.owner);
        throwUnless(self.ERRORS_BID_IS_TOO_SMALL, amount >= self.data.minimal_amount);

        if self.data.winner != null {
            let winner = self.data.winner!!;

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

            emit(
                AuctionOutbiddedEvent {
                    old_winner_secret_id: winner.secret_id,
                    new_winner_secret_id: msg.secret_id,
                    owner_secret_id: self.data.owner_secret_id,
                    address: myAddress(),
                    amount: amount,
                }.toCell(),
            );
        }

        // Assign new winner
        self.data.winner = Winner {
            amount: amount,
            address: bidder,
            secret_id: msg.secret_id,
        };

        let five_percent = self.data.winner!!.amount * 5 / 100;
        self.data.minimal_raise = max(self.MINIMAL_RAISE, five_percent);
    }

    fun resolve() {
        self.data.ended = true;
        if self.data.winner == null {
            emit(
                AuctionResolvedEvent {
                    address: myAddress(),
                    owner_secret_id: self.data.owner_secret_id,
                    winner_secret_id: null,
                }.toCell(),
            );
            self.data.refund = true;
            message(MessageParameters {
                mode: SendDefaultMode | SendRemainingBalance | SendDestroyIfZero,
                to: self.data.owner_account,
                value: 0,
                body: AuctionDeleted { id: self.data.id, refund: true }.toCell(),
            });
        } else {
            let winner = self.data.winner!!;

            emit(
                AuctionResolvedEvent {
                    address: myAddress(),
                    owner_secret_id: self.data.owner_secret_id,
                    winner_secret_id: winner.secret_id,
                }.toCell(),
            );

            message(MessageParameters {
                mode: SendDefaultMode | SendRemainingBalance | SendDestroyIfZero,
                to: self.data.owner_account,
                value: 0,
                body: Profit {
                    id: self.data.id,
                    amount: winner.amount,
                }.toCell(),
            });
        }
    }

    // TODO: Should be external
    receive(_: Resolve) {
        throwUnless(self.ERRORS_ENDED, !self.data.ended);
        throwUnless(self.ERRORS_UNFINISHED, self.data.ends_at < now());

        self.resolve();
    }

    external(_: Resolve) {
        throwUnless(self.ERRORS_ENDED, !self.data.ended);
        throwUnless(self.ERRORS_UNFINISHED, self.data.ends_at < now());

        acceptMessage();

        self.resolve();
    }

    receive() {
        let sender = sender();

        throwUnless(self.ERRORS_NOT_ALLOWED, sender == self.data.owner || sender == self.data.owner_account);

        emit(
            AuctionCreatedEvent {
                address: myAddress(),
                owner_secret_id: self.data.owner_secret_id,
            }.toCell(),
        );
    }

    get fun data(): BasicAuctionData {
        let tmp = self.data;
        tmp.balance = myBalance();
        return tmp;
    }
}
