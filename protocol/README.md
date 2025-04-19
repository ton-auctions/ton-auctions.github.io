# slotton

## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies.
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Build

`npx blueprint build` or `yarn blueprint build`

### Test

`npx blueprint test` or `yarn blueprint test`

### Deploy or run another script

`npx blueprint run` or `yarn blueprint run`

### Add a new contract

`npx blueprint create ContractName` or `yarn blueprint create ContractName`


### Protocol structure

contract `Controller`:
    // admin
    internal ConfigureService
    internal ConfigureAccount
    internal CleanInitialiser
    internal ServiceComission
    
    // user
    internal CreateAccount
    internal RequestInitialisation
    internal AccountCreated

contract `Account`:
    // service
    internal Initialize
    internal ConfigureAccount
    internal AuctionDeleted 
    internal Profit
    internal ReferralCommission

    // user
    internal Collect
    internal CreateBasicAuction    
    internal AccountDelete
    internal CleanUp

contract `BasicAuction`:
    // user
    internal Delete
    internal Bid
    
    // zzz
    external Resolve

    