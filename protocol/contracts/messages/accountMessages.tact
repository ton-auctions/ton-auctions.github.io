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
    amount: Int as uint128;
}

message AuctionDeleted {
    refund: Bool;
}

message AccountInitialise {
    referree: Address?;
    service_comission: Int as uint16;
    referral_comission: Int as uint16;
    max_allowance: Int as uint16;
    secret_id: Cell;
}

message CreateBasicAuction {
    name: String;
    description: String;
    minimal_amount: Int;
    ends_at: Int as uint64;
    secret_id: Cell;
    type: String;
}

message CleanUp {}

message ServiceComission {}
