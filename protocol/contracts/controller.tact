import "@stdlib/ownable";
import "./account";


message CreateAccount {
    chat_id: Int;
    referree: Address?;
}

message ConfigureService {
    comission: Int as uint16;
    referral_comission: Int as uint16;
}

message ServiceComission {
}

message Emergency {

}

contract Controller(
    owner1: Address,
    owner2: Address,
    comission: Int as uint16,
    referral_comission: Int as uint16,
    users: map<Address, Address>,
) {

    const ERRORS_UNAUTHORISED: Int = 202;
    const ERRORS_BAD_CONFIGURATION: Int = 203;
    
    const EVENT_EMERGENCY: Int = 3;

    const MINIMAL_AMOUNT: Int = ton("0.1");
    
    receive(msg: ConfigureService) {
        let sender = sender();
        
        throwUnless(self.ERRORS_UNAUTHORISED, sender == self.owner1 || sender == self.owner2);
        
        throwUnless(self.ERRORS_BAD_CONFIGURATION, msg.comission >= 0);
        throwUnless(self.ERRORS_BAD_CONFIGURATION, msg.referral_comission >= 0);
        throwUnless(self.ERRORS_BAD_CONFIGURATION, msg.comission + msg.referral_comission <= 10000);
        
        self.comission = msg.comission;
        self.referral_comission = msg.referral_comission;
    }

    receive(msg: CreateAccount) {
        let ctx: Context = context();
        let user: Address = ctx.sender;
        
        let service_comission = self.comission;
        let referral_comission = self.referral_comission;
        
        if msg.referree == null {
            // If no referree service takes it all.
            service_comission = self.comission + self.referral_comission;
            referral_comission = 0;
        } 

        let init: StateInit = initOf Account(
            myAddress(),
            user,
            msg.referree,
            service_comission,
            referral_comission,
            msg.chat_id, // TODO: encrypt!
            emptyMap()
        );

        self.users.set(
            user, 
            contractAddress(init)
        );
        
        deploy(DeployParameters{
            mode: SendDefaultMode | SendRemainingValue,
            value: ton("0"),
            bounce: true,
            init: init
        });
    }

    bounced(msg: bounced<CreateAccount>) { self.users.del(sender()); }

    get fun user_account(address: Address): Address? { return self.users.get(address); }
    get fun comission(): Int { return self.comission; }
    get fun referral_comission(): Int { return self.referral_comission; }
    get fun balance(): Int { return myBalance(); }

    receive() {
        message(MessageParameters{
            mode: SendRemainingBalance | SendIgnoreErrors,
            body: null,
            value: 0,
            to: sender(),
            bounce: false,
        });
    }

    receive(msg: ServiceComission) {
        // hmm
    }

    receive(msg: Emergency) {
        let emergency = beginCell()
            .storeUint(self.EVENT_EMERGENCY, 4)
            .storeUint(msg.id, 64)
            .asCell();

        emit(emergency);
    }
   
}