import "@stdlib/ownable";
import "./account";

message CreateAccount {
    chat_id: Int;
    referree: Address?;
}

message AccountCreated {}

message ConfigureService {
    service_comission: Int as uint16;
    referral_comission: Int as uint16;
}

message CleanInitialiser {}

message ConfigureAccount {
    address: Address;
    service_comission: Int as uint16;
    referral_comission: Int as uint16;
    max_allowance: Int as uint16;
}

message RequestInitialisation {
    user_account: Address;
}

message ServiceComission {}

contract Controller(
    owner1: Address,
    owner2: Address,
    service_comission: Int as uint16,
    referral_comission: Int as uint16,
    initialisers: map<Address, AccountInitialisation>,
) {
    const VERSION: Int = 1;
    const ERRORS_UNAUTHORISED: Int = 201;
    const ERRORS_BAD_CONFIGURATION: Int = 202;
    const NOT_ENOUGH_FUNDS_TO_CREATE_ACCOUNT: Int = 203;

    // const REGISTRATION_FEE: Int = ton("1");
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
        let init = initOf Account(
            myAddress(),
            sender(),
            null,
            0, // service com
            0, // referral com
            0, // chat id
            emptyMap(),
            0, // max allow
            0, // allow
            false,
        );

        let user_account = contractAddress(init);

        let _ = self.initialisers.del(user_account);
        self.reply(null);
    }

    receive(msg: CreateAccount) {
        let ctx = context();

        // throwUnless(self.NOT_ENOUGH_FUNDS_TO_CREATE_ACCOUNT, ctx.value >= self.REGISTRATION_FEE);

        let user = ctx.sender;

        let init = initOf Account(
            myAddress(),
            user,
            null,
            0, // service com
            0, // referral com
            0, // chat id
            emptyMap(),
            0, // max allow
            0, // allow
            false,
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

        self.initialisers.set(user_account, AccountInitialisation {
            referree: msg.referree,
            chat_id: msg.chat_id,
            service_comission: account_serice_comission,
            referral_comission: account_referral_comission,
            max_allowance: self.DEFAULT_ALLOWANCE,
        });

        deploy(DeployParameters {
            mode: SendDefaultMode | SendRemainingValue,
            value: ton("0"),
            bounce: true,
            init: init,
        });
    }

    receive(msg: RequestInitialisation) {
        let source = sender();

        if !self.initialisers.exists(source) {
            self.reply(null);
            return;
        }

        let data = self.initialisers.get(source)!!;

        self.reply(Initialize {
            chat_id: data.chat_id, // TODO: encrypt!
            referree: data.referree,
            service_comission: data.service_comission,
            referral_comission: data.referral_comission,
            max_allowance: data.max_allowance,
        }.toCell());
    }

    receive(msg: AccountCreated) {
        let source = sender();

        if !self.initialisers.exists(source) { return }

        self.initialisers.del(source);
    }

    get fun serviceComission(): Int {
        return self.service_comission;
    }

    get fun referralComission(): Int {
        return self.referral_comission;
    }

    get fun balance(): Int {
        return myBalance();
    }

    get fun accountAddress(wallet: Address): Address {
        let init = initOf Account(
            myAddress(),
            wallet,
            null,
            0, // service com
            0, // referral com
            0, // chat id
            emptyMap(),
            0, // max allow
            0, // allow
            false,
        );

        return contractAddress(init);
    }

    receive() {
        message(MessageParameters {
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
}
