import "@stdlib/ownable";
import "./messages/controllerMessages";
import "./account";

// TODO: create utils package
// TODO: split messages between internal and external and analytics and manually assign opcodes
// TODO: check gas optimisations
// TODO: go through production checklist

struct AccountConfig {
    referree: Address?;
    service_comission: Int as uint16;
    referral_comission: Int as uint16;
    max_allowance: Int as uint16;
    secret_id: Cell;
}


contract Controller(
    owner1: Address,
    owner2: Address,
    service_comission: Int as uint16,
    referral_comission: Int as uint16,
    initialisers: map<Address, AccountConfig>,
) {
    const VERSION: Int = 1;
    const ERRORS_UNAUTHORISED: Int = 201;
    const ERRORS_BAD_CONFIGURATION: Int = 202;
    const NOT_ENOUGH_FUNDS_TO_CREATE_ACCOUNT: Int = 203;

    const REGISTRATION_FEE: Int = ton("0.1");
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

    receive(msg: CleanInitialiser) {
        let sender = sender();
        throwUnless(self.ERRORS_UNAUTHORISED, sender == self.owner1 || sender == self.owner2);

        let _ = self.initialisers.del(msg.address);
        cashback(sender);
    }

    receive(msg: CreateAccount) {
        let ctx = context();

        throwUnless(self.NOT_ENOUGH_FUNDS_TO_CREATE_ACCOUNT, ctx.value >= self.REGISTRATION_FEE);

        let user = ctx.sender;

        let init = initOf Account(
            AccountData {
                version: 1,
                collector: myAddress(),
                balance: null,
                owner: user,
                referree: null,
                service_comission: 0, 
                referral_comission: 0, 
                auctions: emptyMap(),
                max_allowance: 0, 
                allowance: 0, 
                initialised: false,
                secret_id: emptyCell(), 
            }
        );

        let user_account = contractAddress(init);

        let initialiserExists = self.initialisers.exists(user_account);
        if initialiserExists {
            self.reply(null);
            return;
        }

        let account_serice_comission = self.service_comission;
        let account_referral_comission = self.referral_comission;

        if msg.referree == null {
            // If no referree service takes it all.
            account_serice_comission = self.service_comission + self.referral_comission;
            account_referral_comission = 0;
        }

        self.initialisers.set(user_account, AccountConfig {
            referree: msg.referree,
            service_comission: account_serice_comission,
            referral_comission: account_referral_comission,
            max_allowance: self.DEFAULT_ALLOWANCE,
            secret_id: msg.secret_id,
        });

        deploy(DeployParameters {
            mode: SendDefaultMode | SendRemainingValue,
            value: ton("0"),
            bounce: true,
            init: init,
        });
    }

    receive(_: RequestInitialisation) {
        let source = sender();

        if !self.initialisers.exists(source) {
            self.reply(null);
            return;
        }

        let data = self.initialisers.get(source)!!;

        self.reply(Initialise {
            secret_id: data.secret_id,

            referree: data.referree,
            service_comission: data.service_comission,
            referral_comission: data.referral_comission,
            max_allowance: data.max_allowance,
        }.toCell());
    }

    receive(msg: AccountCreated) {
        let source = sender();
        let _ = self.initialisers.del(source);
    }

    receive() {
    }

    receive(msg: ServiceComission) {
        // hmm
    }

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
