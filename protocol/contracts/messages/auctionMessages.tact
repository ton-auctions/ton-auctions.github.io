message(0x00aaaa01) AuctionOutbiddedEvent {
    address: Address;
    owner_secret_id: Cell;
    old_winner_secret_id: Cell;
    new_winner_secret_id: Cell;
    amount: Int;
}

message(0x00aaaa02) AuctionResolvedEvent {
    address: Address;
    owner_secret_id: Cell;
    winner_secret_id: Cell?;
}

message(0x00aaaa03) AuctionCreatedEvent {
    name: String;
    address: Address;
    owner_secret_id: Cell;
    ends_at: Int;
}

message Bid {
    secret_id: Cell;
}

message Resolve {}

message Delete {}

message BasicAuctionInitialise {
    description: String;
    owner: Address;
    owner_secret_id: Cell;
    minimal_amount: Int;
    type: String;
}
