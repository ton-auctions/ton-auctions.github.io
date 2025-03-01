import "@stdlib/deploy";
import "@stdlib/ownable";
import "./auction";


message CreateAuctionMsg {
    name: String;
    description: String;
    minimal_amount: Int;
    ends_at: Int;
    comission: Int;
}

contract Account with Ownable, Deployable {
    collector: Address;
    owner: Address;
    referree: Address?;
    comission: Int;
    referral_comission: Int;
    chat_id: Int; // TODO: encrypt!

    init(
        collector: Address,
        owner: Address,
        referree: Address?,
        comission: Int,
        referral_comission: Int,
        chat_id: Int, // TODO: encrypt!
    ) { 
        self.collector = sender();

        self.owner = owner; 
        self.referree = referree;
        self.comission = comission;
        self.referral_comission = referral_comission;
        self.chat_id = chat_id;
    }

    receive(msg: CreateAuctionMsg) {
        // TODO: check if the sender is the controller
        let ctx: Context = context();
        
        let init = initOf SimplestAuction(
            self.owner,
            msg.minimal_amount,
            msg.ends_at,
            self.comission,
            self.chat_id,
            self.referral_comission,
            self.collector,
            self.referree, 
        );
        
        // https://docs.tact-lang.org/ref/core-common/
        deploy( DeployParameters{
            mode: SendDefaultMode,
            value: ton("0.1"),
            bounce: true,
            init: init,
        });
    }

    // receive(msg: AuctionDeployed) {

    // }
    
}

