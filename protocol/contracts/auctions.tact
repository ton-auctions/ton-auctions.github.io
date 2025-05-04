import "@stdlib/ownable";
import "./account";
import "./messages/auctionMessages";

struct Winner {
    address: Address;
    amount: Int as uint128;
    secret_id: Cell;
}

struct BasicAuctionInit {
    owner_account: Address;
    collector: Address;
    ends_at: Int;
    name: String;
}

struct BasicAuctionData {
    owner: Address?;
    collector: Address;
    type: String;
    name: String;
    description: String;
    owner_account: Address;
    owner_secret_id: Cell;
    minimal_amount: Int;
    ends_at: Int;
    ended: Bool;
    refund: Bool;
    balance: Int?;
    minimal_raise: Int;
    winner: Winner?;
}

contract BasicAuction {
    owner: Address? = null;
    collector: Address;
    owner_account: Address;
    name: String;
    ends_at: Int;

    description: String = "";

    owner_secret_id: Cell;
    minimal_amount: Int = ton("1");
    ended: Bool = false;
    refund: Bool = false;
    type: String = "";

    minimal_raise: Int = 0;
    winner: Winner? = null;
    initialised: Bool = false;

    init(data: BasicAuctionInit) {
        self.collector = data.collector;
        self.owner_account = data.owner_account;
        self.name = data.name;
        self.ends_at = data.ends_at;
        self.owner_secret_id = emptyCell();
    }

    receive(msg: BasicAuctionInitialise) {
        throwUnless(self.ERRORS_UNAUTHORISED, sender() == self.owner_account);

        if (self.initialised) {
            cashback(self.owner!!);
            return;
        }

        self.description = msg.description;
        self.owner = msg.owner;
        self.owner_secret_id = msg.owner_secret_id;
        self.minimal_amount = msg.minimal_amount;
        self.type = msg.type;
    }

    const ERRORS_UNAUTHORISED: Int = 200;
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

        throwUnless(self.ERRORS_NOT_ALLOWED, sender == self.owner!! || sender == self.collector);
        throwUnless(self.ERRORS_HAS_WINNER, !self.ended && self.winner == null);

        self.ended = true;

        message(MessageParameters {
            mode: SendDefaultMode | SendRemainingBalance,
            to: self.owner_account,
            value: 0,
            body: AuctionDeleted { refund: false }.toCell(),
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

            emit(
                AuctionOutbiddedEvent {
                    old_winner_secret_id: winner.secret_id,
                    new_winner_secret_id: msg.secret_id,
                    owner_secret_id: self.owner_secret_id,
                    address: myAddress(),
                    amount: amount,
                }.toCell(),
            );
        }

        // Assign new winner
        self.winner = Winner {
            amount: amount,
            address: bidder,
            secret_id: msg.secret_id,
        };

        let five_percent = self.winner!!.amount * 5 / 100;
        self.minimal_raise = max(self.MINIMAL_RAISE, five_percent);
    }

    fun resolve() {
        self.ended = true;
        if self.winner == null {
            emit(
                AuctionResolvedEvent {
                    address: myAddress(),
                    owner_secret_id: self.owner_secret_id,
                    winner_secret_id: null,
                }.toCell(),
            );
            self.refund = true;
            message(MessageParameters {
                mode: SendDefaultMode | SendRemainingBalance | SendDestroyIfZero,
                to: self.owner_account,
                value: 0,
                body: AuctionDeleted { refund: true }.toCell(),
            });
        } else {
            let winner = self.winner!!;

            emit(
                AuctionResolvedEvent {
                    address: myAddress(),
                    owner_secret_id: self.owner_secret_id,
                    winner_secret_id: winner.secret_id,
                }.toCell(),
            );

            message(MessageParameters {
                mode: SendDefaultMode | SendRemainingBalance | SendDestroyIfZero,
                to: self.owner_account,
                value: 0,
                body: Profit {
                    amount: winner.amount,
                }.toCell(),
            });
        }
    }

    receive(_: Resolve) {
        throwUnless(self.ERRORS_ENDED, !self.ended);
        throwUnless(self.ERRORS_UNFINISHED, self.ends_at < now());

        self.resolve();
    }

    // TODO: needs tests
    external(_: Resolve) {
        throwUnless(self.ERRORS_ENDED, !self.ended);
        throwUnless(self.ERRORS_UNFINISHED, self.ends_at < now());

        acceptMessage();

        self.resolve();
    }

    receive() {
        let sender = sender();

        throwUnless(self.ERRORS_NOT_ALLOWED, sender == self.owner || sender == self.owner_account);

        emit(
            AuctionCreatedEvent {
                name: self.name,
                address: myAddress(),
                owner_secret_id: self.owner_secret_id,
                ends_at: self.ends_at,
            }.toCell(),
        );
    }

    get fun data(): BasicAuctionData {
        return BasicAuctionData {
            balance: myBalance(),
            collector: self.collector,
            description: self.description,
            ended: self.ended,
            ends_at: self.ends_at,
            minimal_amount: self.minimal_amount,
            minimal_raise: self.minimal_raise,
            name: self.name,
            owner: self.owner,
            owner_account: self.owner_account,
            owner_secret_id: self.owner_secret_id,
            refund: self.refund,
            type: "basic",
            winner: self.winner,
        };
    }
}
