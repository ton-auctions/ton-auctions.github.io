import { Address, Dictionary, toNano } from "@ton/core";
import { Controller } from "../wrappers/Controller";
import { NetworkProvider } from "@ton/blueprint";

export async function run(provider: NetworkProvider) {
  const owner = Address.parse(
    "0QBKrZkHjRetJ_eZKWCJFRkThnFmZXBOVr8qaY9mhO9Hckle",
  );

  const controller = provider.open(
    await Controller.fromInit(owner, owner, 200n, 200n, Dictionary.empty()),
  );

  await controller.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    null,
  );

  await provider.waitForDeploy(controller.address);
}
