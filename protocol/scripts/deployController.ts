import { toNano } from '@ton/core';
import { Controller } from '../wrappers/Controller';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const controller = provider.open(await Controller.fromInit());

    await controller.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(controller.address);

    // run methods on `controller`
}
