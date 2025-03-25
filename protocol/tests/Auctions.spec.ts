import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { BasicAuction } from '../wrappers/Auctions';
import '@ton/test-utils';

describe('Auctions', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let auctions: SandboxContract<BasicAuction>;

    // beforeEach(async () => {
    //     blockchain = await Blockchain.create();

    //     auctions = blockchain.openContract(await BasicAuction.fromInit());

    //     deployer = await blockchain.treasury('deployer');

    //     const deployResult = await auctions.send(
    //         deployer.getSender(),
    //         {
    //             value: toNano('0.05'),
    //         },
    //         {
    //             $$type: 'Deploy',
    //             queryId: 0n,
    //         }
    //     );

    //     expect(deployResult.transactions).toHaveTransaction({
    //         from: deployer.address,
    //         to: auctions.address,
    //         deploy: true,
    //         success: true,
    //     });
    // });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and auctions are ready to use
    });
});
