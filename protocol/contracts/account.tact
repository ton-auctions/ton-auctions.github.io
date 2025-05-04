import "@stdlib/ownable";
import "./auctions";
import "./messages/accountMessages";
import "./messages/controllerMessages";

// TODO: change amount types to coins.
// TODO: rework id generation.

struct AuctionConfig {
    name: String;
    description: String;
    address: Address;
    type: String;
    ends_at: Int as uint64;
    minimal_amount: Int as uint128;
    ended: Bool;
    refund: Bool;
}

struct AccountInit {
    collector: Address;
    owner: Address;
}

struct AccountData {
    owner: Address;
    version: Int;
    referree: Address?;
    service_comission: Int as uint16;
    referral_comission: Int as uint16;
    max_allowance: Int;
    allowance: Int;
    initialised: Bool;
    secret_id: Cell;
    balance: Int;
    auctions: map<Address, AuctionConfig>;
}

//
// Account might have referral and might not. If not referral_comission field is ignored
// In case referral is notspecified controller will assign sum of comissions into comission field.
//
contract Account{
    const ERRORS_UNAUTHORISED: Int = 201;
    const ERRORS_BAD_AUCTION_TOO_SHORT: Int = 202;
    const ERRORS_BAD_AUCTION_TOO_LONG: Int = 203;
    
    const ERRORS_ACCOUNT_NOT_EXIST: Int = 204;
    const ERRORS_ACCOUNT_NOT_INITIALISED: Int = 206;
    const ERRORS_ACCOUNT_INITIALISED: Int = 207;
    
    const ERRORS_AUCTION_ADDRESS_MISMATCH: Int = 205;
    const ERRORS_AUCTION_ALREADY_EXISTS: Int = 209;
    const ERRORS_AUCTION_NOT_FOUND: Int = 210;
    
    const ERRORS_NOT_ENOUGH_ALLOWANCE: Int = 208;
        
    const MINIMAL_AUCTION_TIMESPAN: Int = 3600 * 5;
    const MAXIMAL_AUCTION_TIMESPAN: Int = 3600 * 30 * 24;

    // Public
    collector: Address;
    owner: Address;

    // Private
    referree: Address? = null;
    service_comission: Int as uint16 = 0;
    referral_comission: Int as uint16 = 0;
    auctions: map<Address, AuctionConfig> = emptyMap();
    max_allowance: Int= 1;
    allowance: Int = 1;
    initialised: Bool = false;
    secret_id: Cell;

    init(data: AccountInit) {
        self.collector = data.collector;
        self.owner = data.owner;
        self.secret_id = emptyCell();
    }

    receive() {}

    receive(msg: AccountInitialise) {
        throwUnless(self.ERRORS_UNAUTHORISED, sender() == self.collector);
        
        if (self.initialised) {
            cashback(self.owner);
            return
        }

        // TODO: more validation logic.
        
        self.secret_id = msg.secret_id;
        self.referree = msg.referree;
        self.service_comission = msg.service_comission;
        self.referral_comission = msg.referral_comission;

        self.max_allowance = msg.max_allowance;
        self.allowance = msg.max_allowance;

        self.initialised = true;

        emit(
            AccountInitialisedEvent {
                address: myAddress(),
                secret_id: self.secret_id,
            }.toCell(),
        );

        // TODO: maybe read forward fees?

        cashback(self.owner); // ???
    }

    receive(msg: ConfigureAccount) {
        throwUnless(self.ERRORS_UNAUTHORISED, sender() == self.collector);
        throwUnless(self.ERRORS_ACCOUNT_NOT_EXIST, myAddress() == msg.address);

        self.service_comission = msg.service_comission;
        self.referral_comission = msg.referral_comission;
        
        let allowance_change = msg.max_allowance - self.max_allowance;
        
        self.allowance += allowance_change;
        self.max_allowance = msg.max_allowance;
    }

    receive(msg: AuctionDeleted) {
        let auctionAddress = sender();
        
        throwUnless(self.ERRORS_ACCOUNT_NOT_INITIALISED, self.initialised);
        throwUnless(self.ERRORS_AUCTION_NOT_FOUND, self.auctions.exists(auctionAddress));

        let meta = self.auctions.get(auctionAddress)!!;

        meta.ended = true;
        meta.refund = msg.refund;

        self.auctions.set(auctionAddress, meta);
        self.allowance += 1;
    }

    receive(msg: CleanUp) {
        throwUnless(self.ERRORS_ACCOUNT_NOT_INITIALISED, self.initialised);
        
        let sender = sender();
        throwUnless(self.ERRORS_UNAUTHORISED, sender == self.owner || sender == self.collector);

        let allowance = 10;
        let auctions: map<Address, AuctionConfig> = emptyMap();

        foreach (key, auction in self.auctions) {
            if !auction.ended {
                auctions.set(auction.address, auction);
                allowance -= 1;
            }
        }

        self.auctions = auctions;
        self.allowance = allowance;
    }

    receive(msg: CreateBasicAuction) {
        throwUnless(self.ERRORS_ACCOUNT_NOT_INITIALISED, self.initialised);
        throwUnless(self.ERRORS_UNAUTHORISED, sender() == self.owner);
        throwUnless(self.ERRORS_BAD_AUCTION_TOO_SHORT, msg.ends_at > now() + self.MINIMAL_AUCTION_TIMESPAN);
        throwUnless(self.ERRORS_BAD_AUCTION_TOO_LONG, msg.ends_at < now() + self.MAXIMAL_AUCTION_TIMESPAN);
        throwUnless(self.ERRORS_NOT_ENOUGH_ALLOWANCE, self.allowance > 0);
        
        let init = initOf BasicAuction(
            BasicAuctionInit {
                collector: self.collector,
                ends_at: msg.ends_at,
                owner_account: myAddress(),
                name: msg.name,
            }
        );

        let auctionAddress = contractAddress(init);

        throwUnless(self.ERRORS_AUCTION_ALREADY_EXISTS, !self.auctions.exists(auctionAddress));

        let meta = AuctionConfig {
            name: msg.name,
            description: msg.description,
            address: auctionAddress,
            ends_at: msg.ends_at,
            minimal_amount: msg.minimal_amount,
            type: msg.type,
            ended: false,
            refund: false,
        };

        self.auctions.set(auctionAddress, meta);

        deploy(DeployParameters {
            mode: SendDefaultMode | SendRemainingValue,
            value: ton("0"),
            bounce: true,
            init: init,
            body: BasicAuctionInitialise{
                description: msg.description,
                owner: self.owner,
                type: msg.type,
                owner_secret_id: msg.secret_id,
                minimal_amount: msg.minimal_amount,
            }.toCell()
        });
        self.allowance -= 1;
    }

    bounced(msg: bounced<CreateBasicAuction>) {
        let auctionAddress = sender();
        
        if !self.auctions.exists(auctionAddress) { 
            cashback(self.owner);
            return 
        }

        let _ = self.auctions.del(auctionAddress);
        self.allowance += 1;

        // TODO: cashback?
    }

    receive(msg: Profit) {
        let auctionAddress = sender();
        
        throwUnless(self.ERRORS_ACCOUNT_NOT_INITIALISED, self.initialised);
        throwUnless(self.ERRORS_AUCTION_NOT_FOUND, self.auctions.exists(auctionAddress));

        let ctx = context();
        let sender = ctx.sender;
        let amount = min(msg.amount, ctx.value);

        let meta = self.auctions.get(auctionAddress)!!;
        throwUnless(self.ERRORS_AUCTION_ADDRESS_MISMATCH, sender == meta.address);

        // TODO: need to check gas usage for ServiceComission and ReferralCommission
        
        let service_comission = (amount * self.service_comission) / 10000;
        message(MessageParameters {
            mode: SendDefaultMode, // We put charge on ourselves
            to: self.collector,
            value: service_comission,
            body: ServiceComission {}.toCell(),
        });

        let referral_amount = (amount * self.referral_comission) / 10000;
        if self.referree != null {
            message(MessageParameters {
                mode: SendDefaultMode, // Referree will pay the fee
                to: self.referree!!,
                value: referral_amount,
                body: ReferralCommission {}.toCell(),
            });
        }

        meta.ended = true;
        self.auctions.set(auctionAddress, meta);
        self.allowance += 1;

        // TODO: need to test what will happen if account empty at this point.
        emit(
            ProfitReceivedEvent {
                amount: amount,
                address: myAddress(),
                secret_id: self.secret_id,
            }.toCell()
        );
    }

    receive(_: ReferralCommission) {
        throwUnless(self.ERRORS_ACCOUNT_NOT_INITIALISED, self.initialised);

        let ctx = context();
        let forwardFee = ctx.readForwardFee();
        let referral_amount = ctx.value >> 1; // Halve it

        if referral_amount < forwardFee {
            // Not worth it
            return;
        }

        if self.referree == null {
            message(MessageParameters {
                mode: SendDefaultMode, // Collector will pay the fee
                to: self.collector,
                value: referral_amount,
                body: ServiceComission {}.toCell(),
            });
        } else {
            message(MessageParameters {
                mode: SendDefaultMode, // Referree will pay the fee
                to: self.referree!!,
                value: referral_amount,
                body: ReferralCommission {}.toCell(),
            });
        }
    }

    receive(_: Collect) {
        throwUnless(self.ERRORS_ACCOUNT_NOT_INITIALISED, self.initialised);
        throwUnless(self.ERRORS_UNAUTHORISED, sender() == self.owner);

        message(MessageParameters {
            mode: SendDefaultMode | SendRemainingBalance,
            to: self.owner,
            value: 0,
            body: null,
        });
    }

    receive(msg: AccountDelete) {
        throwUnless(self.ERRORS_UNAUTHORISED, sender() == self.owner);

        self.initialised = false;

        message(MessageParameters {
            to: self.owner,
            value: 0,
            mode: SendRemainingBalance | SendDestroyIfZero,
            body: null,
        });
    }

    get fun data(): AccountData {
        return AccountData {
            owner : self.owner,
            version: 1,
            referree : self.referree,
            referral_comission : self.referral_comission,
            service_comission : self.service_comission,
            max_allowance : self.max_allowance,
            allowance : self.allowance,
            initialised : self.initialised,
            secret_id : self.secret_id,
            balance : myBalance(),
            auctions : self.auctions, 
        }
    }
}
