message AccountDelete {}
message ReferralCommission {}
message Collect {}

message(0x00acca00) AccountInitialisedEvent {
    address: Address;
    secret_id: Cell;
}

message(0x00acca01) ProfitReceivedEvent {
    address: Address;
    amount: Int;
    secret_id: Cell;
}

message Profit {
    id: Int;
    amount: Int as uint128;
}

message AuctionDeleted {
    id: Int as uint64;
    refund: Bool;
}

message Initialise {
    referree: Address?;
    service_comission: Int as uint16;
    referral_comission: Int as uint16;
    max_allowance: Int as uint16;
    secret_id: Cell;
}

message CreateBasicAuction {
    id: Int as uint64;
    name: String;
    description: String;
    minimal_amount: Int;
    ends_at: Int as uint64;
    secret_id: Cell;
}

message CleanUp {}
