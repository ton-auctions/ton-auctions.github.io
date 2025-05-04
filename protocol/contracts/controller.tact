import "@stdlib/ownable";
import "./messages/controllerMessages";
import "./account";
import "./messages/accountMessages";

// TODO: create utils package
// TODO: check gas optimisations
// TODO: go through production checklist

contract Controller(
    owner1: Address,
    owner2: Address,
    service_comission: Int as uint16,
    referral_comission: Int as uint16,
) {
    const VERSION: Int = 1;
    const ERRORS_UNAUTHORISED: Int = 201;
    const ERRORS_BAD_CONFIGURATION: Int = 202;
    const NOT_ENOUGH_FUNDS_TO_CREATE_ACCOUNT: Int = 203;
    const NOTHING_TO_COLLECT: Int = 204;

    // TODO: remove
    const REGISTRATION_FEE: Int = ton("0.1");
    const COLLECT_THRESHOLD: Int = ton("0.1");
    const DEFAULT_ALLOWANCE: Int = 10;
    
    receive(msg: ConfigureService) {
        let sender = sender();

        throwUnless(self.ERRORS_UNAUTHORISED, sender == self.owner1 || sender == self.owner2);

        throwUnless(self.ERRORS_BAD_CONFIGURATION, msg.service_comission >= 0);
        throwUnless(self.ERRORS_BAD_CONFIGURATION, msg.referral_comission >= 0);
        throwUnless(self.ERRORS_BAD_CONFIGURATION, msg.service_comission + msg.referral_comission <= 10000);

        self.service_comission = msg.service_comission;
        self.referral_comission = msg.referral_comission;
    }

    receive(msg: ConfigureAccount) {
        let sender = sender();

        throwUnless(self.ERRORS_UNAUTHORISED, sender == self.owner1 || sender == self.owner2);

        throwUnless(self.ERRORS_BAD_CONFIGURATION, msg.service_comission >= 0);
        throwUnless(self.ERRORS_BAD_CONFIGURATION, msg.referral_comission >= 0);
        throwUnless(self.ERRORS_BAD_CONFIGURATION, msg.service_comission + msg.referral_comission <= 10000);

        self.forward(msg.address, ConfigureAccount {
            address: msg.address,
            max_allowance: msg.max_allowance,
            referral_comission: msg.referral_comission,
            service_comission: msg.service_comission,
        }.toCell(), false, null);
    }

    receive(msg: CreateAccount) {
        let ctx = context();

        // TODO: THROW IF NOT ENOUGH GAS.
        throwUnless(self.NOT_ENOUGH_FUNDS_TO_CREATE_ACCOUNT, ctx.value >= self.REGISTRATION_FEE);

        let user = ctx.sender;

        let init = initOf Account(
            AccountInit {
                collector: myAddress(),
                owner: user
            }
        );

        let account_service_comission = self.service_comission;
        let account_referral_comission = self.referral_comission;

        if msg.referree == null {
            // If no referree service takes it all.
            account_service_comission = self.service_comission + self.referral_comission;
            account_referral_comission = 0;
        }

        deploy(DeployParameters {
            mode: SendDefaultMode | SendRemainingValue,
            value: 0,
            init: init,
            body: AccountInitialise {
                secret_id: msg.secret_id,
                referree: msg.referree,
                service_comission: account_service_comission,
                referral_comission: account_referral_comission,
                max_allowance: self.DEFAULT_ALLOWANCE,
            }.toCell()
        });
    }

    receive() {
    }

    receive(msg: CollectMoneys) {
        let sender = sender();
        throwUnless(self.ERRORS_UNAUTHORISED, sender == self.owner1 || sender == self.owner2);

        let balance = myBalance();
        throwUnless(self.NOTHING_TO_COLLECT, balance > self.COLLECT_THRESHOLD);
        
        let share = (balance - self.COLLECT_THRESHOLD / 2) >> 1;

        message(MessageParameters{
            mode: SendDefaultMode,
            to: self.owner1,
            value: share,
        });
        
        message(MessageParameters{
            mode: SendDefaultMode,
            to: self.owner2,
            value: share,
        });
    }

    // Receive ServiceComission funds
    receive(msg: ServiceComission) {}

    get fun serviceComission(): Int {
        return self.service_comission;
    }

    get fun referralComission(): Int {
        return self.referral_comission;
    }

    get fun version(): Int {
        return self.VERSION;
    }
}
