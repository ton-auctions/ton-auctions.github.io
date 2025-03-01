import "@stdlib/deploy";
import "@stdlib/ownable";
import "./account";

message CreateAccountMsg {
    chat_id: Int;
    referree: Address?;
}

message ConfigureService {
    comission: Int;
    referral_comission: Int;
}

contract Controller with Deployable {
    owner1: Address;
    owner2: Address;
    comission: Int;
    referral_comission: Int;

    const ERRORS_INSUFFICIENT_FUNDS: Int = 201;
    const ERRORS_UNAUTHORISED: Int = 202;
    const ERRORS_BAD_CONFIGURATION: Int = 203;
    
    const MINIMAL_AMOUNT: Int = ton("0.1");
    
    init(owner1: Address, owner2: Address) {
        self.owner1 = owner1;
        self.owner2 = owner2;
        self.comission = 5;
        self.referral_comission = 3;
    }

    receive(msg: ConfigureService) {
        let sender = sender();
        
        throwUnless(self.ERRORS_BAD_CONFIGURATION, msg.comission > msg.referral_comission);
        throwUnless(self.ERRORS_UNAUTHORISED, sender == self.owner1 || sender == self.owner2);
        
        self.comission = msg.comission;
        self.referral_comission = msg.referral_comission;
    }

    receive(msg: CreateAccountMsg) {
        let ctx: Context = context();
        let user = ctx.sender;
        let moneys = ctx.value;
        
        throwUnless(self.ERRORS_INSUFFICIENT_FUNDS, moneys > self.MINIMAL_AMOUNT);
        
        let init = initOf Account(
            myAddress(),
            user,
            msg.referree,
            self.comission,
            self.referral_comission,
            msg.chat_id, // TODO: encrypt!
        );
        
        deploy(DeployParameters{
            mode: SendDefaultMode | SendRemainingValue,
            value: moneys,
            bounce: true,
            init: init
        })
    }
}