import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Controller } from '../wrappers/Controller';
import '@ton/test-utils';

describe('Controller', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let controller: SandboxContract<Controller>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        controller = blockchain.openContract(await Controller.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await controller.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: controller.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and controller are ready to use
    });
});
