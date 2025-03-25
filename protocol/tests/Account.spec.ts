import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import { Dictionary, toNano } from "@ton/core";
import { Account } from "../wrappers/Account";
import "@ton/test-utils";

const isCloseTo = (cmp: bigint) => {
  return (value: bigint | undefined) => {
    if (!value) return false;

    const diff = cmp > value ? cmp - value : value - cmp;

    return diff < toNano("0.01");
  };
};

describe("Account", () => {
  let blockchain: Blockchain;
  let deployer: SandboxContract<TreasuryContract>;
  let collector: SandboxContract<TreasuryContract>;
  let referree: SandboxContract<TreasuryContract>;
  let user: SandboxContract<TreasuryContract>;
  let profitSender: SandboxContract<TreasuryContract>;

  let referreeAccount: SandboxContract<Account>;
  let userAccount: SandboxContract<Account>;
  let userWithoutReferreeAccount: SandboxContract<Account>;

  beforeEach(async () => {
    blockchain = await Blockchain.create();

    referree = await blockchain.treasury("referree");
    user = await blockchain.treasury("owner");
    collector = await blockchain.treasury("collector");
    deployer = await blockchain.treasury("deployer");
    profitSender = await blockchain.treasury("profitSender");

    referreeAccount = blockchain.openContract(
      await Account.fromInit(
        collector.address,
        referree.address,
        null,
        150n, // 1.5%
        150n, // 1.5%
        999n,
        Dictionary.empty(),
      ),
    );

    userAccount = blockchain.openContract(
      await Account.fromInit(
        collector.address,
        user.address,
        referreeAccount.address,
        150n, // 1.5%
        200n, // 1.5%
        999n,
        Dictionary.empty(),
      ),
    );

    userWithoutReferreeAccount = blockchain.openContract(
      await Account.fromInit(
        collector.address,
        user.address,
        null,
        150n, // 1.5%
        200n, // 2%
        999n,
        Dictionary.empty(),
      ),
    );

    const users = [userAccount, userWithoutReferreeAccount, referreeAccount];

    for (var account of users) {
      const deployResult = await account.send(
        deployer.getSender(),
        {
          value: toNano("1"),
        },
        null,
      );

      expect(deployResult.transactions).toHaveTransaction({
        from: deployer.address,
        to: account.address,
        deploy: true,
        success: true,
      });
    }
  });

  it("Should send commission to referree and collector", async () => {
    const initialBalance = await userAccount.getBalance();

    const profitResult = await userAccount.send(
      profitSender.getSender(),
      {
        value: toNano("1000"),
      },
      {
        $$type: "ProfitMsg",
      },
    );

    // ProfitSender sends moneys to userAccount
    expect(profitResult.transactions).toHaveTransaction({
      from: profitSender.address,
      to: userAccount.address,
      success: true,
      aborted: false,
      deploy: false,
      value: toNano("1000"),
    });

    // UserAccount sends 2% moneys to ReferreeAccount
    expect(profitResult.transactions).toHaveTransaction({
      from: userAccount.address,
      to: referreeAccount.address,
      success: true,
      aborted: false,
      deploy: false,
      value: isCloseTo(toNano("20")),
    });

    // UserAccount sends 1.5% moneys to Collector
    expect(profitResult.transactions).toHaveTransaction({
      from: userAccount.address,
      to: collector.address,
      success: true,
      aborted: false,
      deploy: false,
      value: isCloseTo(toNano("15")),
    });

    expect(profitResult.transactions).toHaveLength(4);

    const balance = await userAccount.getBalance();
    const expected = toNano("965") + initialBalance;
    expect(expected - balance).toBeLessThan(toNano("0.01"));
  });

  it("Should send no commission if no referry exist", async () => {
    const initialBalance = await userWithoutReferreeAccount.getBalance();

    const profitResult = await userWithoutReferreeAccount.send(
      profitSender.getSender(),
      {
        value: toNano("1000"),
      },
      {
        $$type: "ProfitMsg",
      },
    );

    // ProfitSender sends moneys to userAccount
    expect(profitResult.transactions).toHaveTransaction({
      from: profitSender.address,
      to: userWithoutReferreeAccount.address,
      success: true,
      aborted: false,
      deploy: false,
      value: isCloseTo(toNano("1000")),
    });

    // UserAccount sends 2% moneys to ReferreeAccount
    expect(profitResult.transactions).not.toHaveTransaction({
      from: userAccount.address,
      success: true,
      aborted: false,
      deploy: false,
      value: isCloseTo(toNano("0")),
    });

    // UserAccount sends 3.5% moneys to Collector
    expect(profitResult.transactions).toHaveTransaction({
      from: userWithoutReferreeAccount.address,
      to: collector.address,
      success: true,
      aborted: false,
      deploy: false,
      value: isCloseTo(toNano("15")),
    });

    expect(profitResult.transactions).toHaveLength(3);

    const balance = await userWithoutReferreeAccount.getBalance();
    const expected = toNano("1000") - toNano("15") + initialBalance;
    expect(expected - balance).toBeLessThan(toNano("0.01"));
  });

  it("Non User should be not be able to create contract", async () => {
    const createContractResult = await userAccount.send(
      profitSender.getSender(),
      {
        value: toNano("0.1"),
        bounce: false,
      },
      {
        $$type: "CreateBasicAuctionMsg",
        id: BigInt(0),
        name: "Auction 1",
        description: "Empty",
        minimal_amount: toNano("1"),
        ends_at: BigInt(Math.trunc(new Date().valueOf() / 1000)),
        comission: BigInt(0),
      },
    );

    expect(createContractResult.transactions).toHaveTransaction({
      from: profitSender.address,
      to: userAccount.address,
      success: false,
      aborted: true,
      deploy: false,
    });

    let auction = await userAccount.getAuction(BigInt(0));
    expect(auction).toBeNull();

    expect(createContractResult.transactions).toHaveLength(2);
  });

  it("User should be able to create Auction through account", async () => {
    const createContractResult = await userAccount.send(
      user.getSender(),
      {
        value: toNano("0.1"),
        bounce: false,
      },
      {
        $$type: "CreateBasicAuctionMsg",
        id: BigInt(0),
        name: "Auction 1",
        description: "Empty",
        minimal_amount: toNano("1"),
        ends_at: BigInt(Math.trunc(new Date().valueOf() / 1000)),
        comission: BigInt(0),
      },
    );

    expect(createContractResult.transactions).toHaveTransaction({
      from: user.address,
      to: userAccount.address,
      success: true,
      aborted: false,
      deploy: false,
    });

    let auction = await userAccount.getAuction(BigInt(0));
    expect(auction).not.toBeNull();
    expect(auction).toMatchObject({
      $$type: "AuctionMeta",
      id: BigInt(0),
      name: "Auction 1",
      description: "Empty",
      type: "basic",
    });

    expect(createContractResult.transactions).toHaveTransaction({
      from: userAccount.address,
      to: auction!.address,
      success: true,
      aborted: false,
      deploy: true,
    });
  });
});
