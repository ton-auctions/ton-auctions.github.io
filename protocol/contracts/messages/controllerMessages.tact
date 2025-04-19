message CreateAccount {
    secret_id: Cell;
    referree: Address?;
}

message AccountCreated {}

message ConfigureService {
    service_comission: Int as uint16;
    referral_comission: Int as uint16;
}

message ConfigureAccount {
    address: Address;
    service_comission: Int as uint16;
    referral_comission: Int as uint16;
    max_allowance: Int as uint16;
}

message CleanInitialiser { address: Address }

message RequestInitialisation {}

message ServiceComission {}
