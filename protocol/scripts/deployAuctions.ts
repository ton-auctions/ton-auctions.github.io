import { toNano } from '@ton/core';
import { Auctions } from '../wrappers/Auctions';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const auctions = provider.open(await Auctions.fromInit());

    await auctions.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(auctions.address);

    // run methods on `auctions`
}
