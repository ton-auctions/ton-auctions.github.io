import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import { Address, Dictionary, toNano } from "@ton/core";
import { Controller } from "../wrappers/Controller";
import { Account } from "../wrappers/Account";
import { PrivateKey } from "eciesjs";
import "@ton/test-utils";

describe("Controller", () => {
  let blockchain: Blockchain;
  let deployer: SandboxContract<TreasuryContract>;
  let controller: SandboxContract<Controller>;
  let owner1: SandboxContract<TreasuryContract>;
  let owner2: SandboxContract<TreasuryContract>;
  let referree: SandboxContract<TreasuryContract>;
  let controllerComission = 150n;
  let controllerReferralComission = 200n;

  const sk = new PrivateKey();

  beforeEach(async () => {
    blockchain = await Blockchain.create();
    owner1 = await blockchain.treasury("owner1");
    owner2 = await blockchain.treasury("owner2");
    referree = await blockchain.treasury("referee");
    controller = blockchain.openContract(
      await Controller.fromInit(
        owner1.address,
        owner2.address,
        controllerComission,
        controllerReferralComission,
        Dictionary.empty(),
      ),
    );
    deployer = await blockchain.treasury("deployer");
    const deployResult = await controller.send(
      deployer.getSender(),
      {
        value: toNano("1"),
        bounce: true,
      },
      null,
    );
    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: controller.address,
      deploy: true,
      success: true,
    });
  });

  it("should have default comissions specified", async () => {
    let comission = await controller.getServiceComission();
    expect(comission).toBe(controllerComission);
    let referralComission = await controller.getReferralComission();
    expect(referralComission).toBe(controllerReferralComission);
  });

  it("should allow for comissions configuration", async () => {
    await Promise.allSettled(
      [owner1, owner2].map(async (owner) => {
        let newComission = BigInt(10 + Math.floor(Math.random() * 10));
        let newReferralComission = newComission / 2n;
        const configureControllerResult = await controller.send(
          owner.getSender(),
          {
            value: toNano("0.1"),
          },
          {
            $$type: "ConfigureService",
            service_comission: newComission,
            referral_comission: newReferralComission,
          },
        );
        expect(configureControllerResult.transactions).toHaveTransaction({
          from: owner.address,
          to: controller.address,
          success: true,
          deploy: false,
        });
        let comission = await controller.getServiceComission();
        let referralComission = await controller.getReferralComission();
        expect(typeof comission).toBe("bigint");
        expect(comission).not.toBeNull();
        expect(comission).toBe(newComission);
        expect(typeof referralComission).toBe("bigint");
        expect(referralComission).not.toBeNull();
        expect(referralComission).toBe(newReferralComission);
      }),
    );
  });

  it("should not allow owners to configure comission", async () => {
    const not_owner = await blockchain.treasury("someone_else");
    const configureControllerResult = await controller.send(
      not_owner.getSender(),
      {
        value: toNano("0.1"),
      },
      {
        $$type: "ConfigureService",
        service_comission: 100n,
        referral_comission: 90n,
      },
    );
    expect(configureControllerResult.transactions).toHaveTransaction({
      from: not_owner.address,
      to: controller.address,
      success: false,
      deploy: false,
      aborted: true,
      exitCode: Number(Controller.ERRORS_UNAUTHORISED),
    });
  });

  it("should not allow referral_commission + commission exceed 100% (10000)", async () => {
    const configureControllerResult = await controller.send(
      owner1.getSender(),
      {
        value: toNano("0.1"),
      },
      {
        $$type: "ConfigureService",
        service_comission: 5000n, // 50%
        referral_comission: 6000n, //60%
      },
    );
    expect(configureControllerResult.transactions).toHaveTransaction({
      from: owner1.address,
      to: controller.address,
      success: false,
      deploy: false,
      aborted: true,
      exitCode: Number(Controller.ERRORS_BAD_CONFIGURATION),
    });
  });

  it("should not allow negative values in commission configuration", async () => {
    const cases = [
      [10n, -10n],
      [-5n, -10n],
    ];
    await Promise.allSettled(
      cases.map(async ([commision, referralCommission]) => {
        const configureControllerResult = await controller.send(
          owner1.getSender(),
          {
            value: toNano("0.1"),
          },
          {
            $$type: "ConfigureService",
            service_comission: commision,
            referral_comission: referralCommission,
          },
        );
        expect(configureControllerResult.transactions).toHaveTransaction({
          from: owner1.address,
          to: controller.address,
          success: false,
          deploy: false,
          aborted: true,
          exitCode: Number(Controller.ERRORS_BAD_CONFIGURATION),
        });
      }),
    );
  });

  it("should deploy user account", async () => {
    let user = await blockchain.treasury("user");
    const createAccountResult = await controller.send(
      user.getSender(),
      {
        value: toNano("1"),
      },
      {
        $$type: "CreateAccount",
        chat_id: BigInt(100),
        referree: referree.address,
      },
    );
    expect(createAccountResult.transactions).toHaveTransaction({
      from: user.address,
      to: controller.address,
      success: true,
      deploy: false,
    });
    const accountAddress = await controller.getUserAccount(user.address);
    expect(accountAddress).toBeInstanceOf(Address);
    expect(accountAddress).not.toBeNull();
    expect(createAccountResult.transactions).toHaveTransaction({
      from: controller.address,
      to: accountAddress!,
      success: true,
      deploy: true,
    });
    const userAccount = blockchain.openContract(
      Account.fromAddress(accountAddress!),
    );
    const version = await userAccount.getVersion();
    expect(version).toBe(1n);
    const owner = await userAccount.getOwner();
    expect(owner.toString()).toBe(user.address.toString());

    expect(await userAccount.getServiceComission()).toBe(controllerComission);
    expect(await userAccount.getReferralComission()).toBe(
      controllerReferralComission,
    );
  });

  it("should deploy user account without referree with increased service comission", async () => {
    let user = await blockchain.treasury("user");
    const createAccountResult = await controller.send(
      user.getSender(),
      {
        value: toNano("1"),
      },
      {
        $$type: "CreateAccount",
        chat_id: BigInt(100),
        referree: null,
      },
    );
    expect(createAccountResult.transactions).toHaveTransaction({
      from: user.address,
      to: controller.address,
      success: true,
      deploy: false,
    });
    const accountAddress = await controller.getUserAccount(user.address);
    expect(accountAddress).toBeInstanceOf(Address);
    expect(accountAddress).not.toBeNull();
    expect(createAccountResult.transactions).toHaveTransaction({
      from: controller.address,
      to: accountAddress!,
      success: true,
      deploy: true,
    });
    const userAccount = blockchain.openContract(
      Account.fromAddress(accountAddress!),
    );
    const version = await userAccount.getVersion();
    expect(version).toBe(1n);
    const owner = await userAccount.getOwner();
    expect(owner.toString()).toBe(user.address.toString());

    expect(await userAccount.getServiceComission()).toBe(
      controllerComission + controllerReferralComission,
    );
    expect(await userAccount.getReferralComission()).toBe(0n);
  });

  it("should abort creating user account if no moneys", async () => {
    let user = await blockchain.treasury("user");
    const createAccountResult = await controller.send(
      user.getSender(),
      {
        value: toNano("0"),
        bounce: true,
      },
      {
        $$type: "CreateAccount",
        chat_id: BigInt(100),
        referree: referree.address,
      },
    );
    expect(createAccountResult.transactions).toHaveTransaction({
      from: user.address,
      to: controller.address,
      success: false,
      deploy: false,
      inMessageBounceable: true,
      aborted: true,
    });
    const accountAddress = await controller.getUserAccount(user.address);

    let address = blockchain.openContract(Account.fromAddress(accountAddress));

    expect(address.init).toBeUndefined();
  });

  it("should abort creating user account if not enough moneys", async () => {
    let user = await blockchain.treasury("user");
    const createAccountResult = await controller.send(
      user.getSender(),
      {
        value: toNano("0.5"),
        bounce: true,
      },
      {
        $$type: "CreateAccount",
        chat_id: BigInt(100),
        referree: referree.address,
      },
    );
    expect(createAccountResult.transactions).toHaveTransaction({
      from: user.address,
      to: controller.address,
      success: false,
      deploy: false,
      inMessageBounceable: true,
      aborted: true,
      exitCode: Number(Controller.NOT_ENOUGH_FUNDS_TO_CREATE_ACCOUNT),
    });
    const accountAddress = await controller.getUserAccount(user.address);

    let address = blockchain.openContract(Account.fromAddress(accountAddress));

    expect(address.init).toBeUndefined();
  });

  it("should not deploy account for same user twice", async () => {
    let user = await blockchain.treasury("user");

    let result1 = await controller.send(
      user.getSender(),
      {
        value: toNano("5"),
      },
      {
        $$type: "CreateAccount",
        chat_id: BigInt(100),
        referree: referree.address,
      },
    );

    let account_address = await controller.getUserAccount(user.address);

    expect(result1.transactions).toHaveTransaction({
      from: controller.address,
      to: account_address,
      success: true,
      aborted: false,
      deploy: true,
    });

    expect(result1.transactions).toHaveTransaction({
      from: account_address,
      to: controller.address,
      success: true,
      aborted: false,
      deploy: false,
    });

    const account = blockchain.openContract(
      Account.fromAddress(account_address),
    );

    expect(await account.getInitialised()).toBe(true);

    let result2 = await controller.send(
      user.getSender(),
      {
        value: toNano("1"),
      },
      {
        $$type: "CreateAccount",
        chat_id: BigInt(100),
        referree: referree.address,
      },
    );

    expect(result2.transactions).toHaveLength(3);
  });
});
