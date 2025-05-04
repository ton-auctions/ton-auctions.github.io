import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import { Address, beginCell, toNano } from "@ton/core";
import { Account } from "../wrappers/Account";
import "@ton/test-utils";
import { BasicAuction } from "../wrappers/Auctions";
import { isCloseTo } from "./helpers";
import { Controller } from "../wrappers/Controller";

let createAuction = async (
  blockchain: Blockchain,
  controller: SandboxContract<TreasuryContract>,
  user: SandboxContract<TreasuryContract>,
  account: SandboxContract<Account>,
  name?: string,
) => {
  name = name || "Auction 1";

  const endsAt = Math.trunc(new Date().valueOf() / 1000 + 3600 * 24);
  const description = "Empty";

  const auction = blockchain.openContract(
    await BasicAuction.fromInit({
      $$type: "BasicAuctionInit",
      collector: controller.address,
      ends_at: BigInt(endsAt),
      name: name,
      owner_account: account.address,
    }),
  );

  const result = await account.send(
    user.getSender(),
    {
      value: toNano("0.02"),
      bounce: false,
    },
    {
      $$type: "CreateBasicAuction",
      name: name,
      type: "basic",
      description: description,
      minimal_amount: toNano("1"),
      ends_at: BigInt(endsAt),
      secret_id: beginCell()
        .storeBuffer(Buffer.from([0, 1, 2, 3]))
        .endCell(),
    },
  );
  expect(result.transactions).toHaveTransaction({
    from: user.address,
    to: account.address,
    value: toNano("0.02"),
    aborted: false,
    success: true,
    deploy: false,
  });
  expect(result.transactions).toHaveTransaction({
    from: account.address,
    to: auction.address,
    aborted: false,
    success: true,
    deploy: true,
  });

  const data = await account.getData();

  expect(data.auctions.get(auction.address)).not.toBeUndefined();

  const contract = await blockchain.getContract(auction.address);
  expect(contract.accountState?.type).toBe("active");

  return auction;
};

const getBalance = async (blockchain: Blockchain, address: Address) => {
  const contract = await blockchain.getContract(address);
  return contract.balance;
};

let deleteAuction = async (
  blockchain: Blockchain,
  account: SandboxContract<Account>,
  auction: SandboxContract<BasicAuction>,
  refund?: boolean,
) => {
  let result = await account.send(
    blockchain.sender(auction.address),
    {
      value: toNano("0.02"),
      bounce: false,
    },
    {
      $$type: "AuctionDeleted",
      refund: refund || false,
    },
  );
  expect(result.transactions).toHaveTransaction({
    from: auction.address,
    to: account.address,
    success: true,
    deploy: false,
    aborted: false,
  });
};

let sendProfit = async (
  blockchain: Blockchain,
  auction: SandboxContract<BasicAuction>,
  account: SandboxContract<Account>,
  amount: bigint,
) => {
  const profitResult = await account.send(
    blockchain.sender(auction!.address),
    {
      value: amount,
    },
    {
      $$type: "Profit",
      amount,
    },
  );

  expect(profitResult.transactions).toHaveTransaction({
    from: auction!.address,
    to: account.address,
    success: true,
    aborted: false,
    deploy: false,
    value: amount,
  });
};

let bid = async (
  bidder: SandboxContract<TreasuryContract>,
  auction: SandboxContract<BasicAuction>,
  amount: bigint,
) => {
  let result = await auction.send(
    bidder.getSender(),
    {
      value: amount,
    },
    {
      $$type: "Bid",
      secret_id: beginCell()
        .storeBuffer(Buffer.from([1, 9, 2, 3]))
        .endCell(),
    },
  );

  expect(result.transactions).toHaveTransaction({
    from: bidder.address,
    to: auction.address,
    success: true,
    value: amount,
    deploy: false,
    aborted: false,
  });
};

let createUserAndAccount = async (
  blockchain: Blockchain,
  collector: SandboxContract<TreasuryContract>,
  referree_account?: SandboxContract<Account> | null,
  service_comission?: bigint,
  referral_comission?: bigint,
  alias?: string,
): Promise<[SandboxContract<TreasuryContract>, SandboxContract<Account>]> => {
  let user = await blockchain.treasury(alias || "owner");

  let account_contract = blockchain.openContract(
    await Account.fromInit({
      $$type: "AccountInit",
      collector: collector.address,
      owner: user.address,
    }),
  );

  const deployResult = await account_contract.send(
    collector.getSender(),
    {
      value: toNano("0.1"),
    },
    {
      $$type: "AccountInitialise",
      max_allowance: 10n,
      referral_comission: referral_comission || 150n,
      service_comission: service_comission || 150n,
      referree: referree_account?.address || null,
      secret_id: beginCell()
        .storeBuffer(Buffer.from([9, 9, 9]))
        .endCell(),
    },
  );

  expect(deployResult.transactions).toHaveTransaction({
    from: collector.address,
    to: account_contract.address,
    deploy: true,
    success: true,
  });

  return [user, account_contract];
};

describe("Account", () => {
  let blockchain: Blockchain;
  let deployer: SandboxContract<TreasuryContract>;
  let collector: SandboxContract<TreasuryContract>;

  let referree: SandboxContract<TreasuryContract>;
  let referreeAccount: SandboxContract<Account>;

  let user: SandboxContract<TreasuryContract>;
  let userAccount: SandboxContract<Account>;

  let userWithoutReferree: SandboxContract<TreasuryContract>;
  let userWithoutReferreeAccount: SandboxContract<Account>;

  beforeEach(async () => {
    blockchain = await Blockchain.create();

    collector = await blockchain.treasury("collector");
    deployer = await blockchain.treasury("deployer");

    [referree, referreeAccount] = await createUserAndAccount(
      blockchain,
      collector,
      null,
      150n,
      150n,
      "referee",
    );

    [user, userAccount] = await createUserAndAccount(
      blockchain,
      collector,
      referreeAccount,
      150n,
      200n,
      "owner_with_referee",
    );

    [userWithoutReferree, userWithoutReferreeAccount] =
      await createUserAndAccount(
        blockchain,
        collector,
        null,
        150n,
        200n,
        "owner",
      );
  });

  it("Should send commission to referree and collector", async () => {
    const auction = await createAuction(
      blockchain,
      collector,
      user,
      userAccount,
    );

    const initialUserData = await userAccount.getData();

    const initialUserBalance = await getBalance(
      blockchain,
      userAccount.address,
    );

    const initialReferreeBalance = await getBalance(
      blockchain,
      referreeAccount.address,
    );

    const initialCollectorBalance = await collector.getBalance();

    const auctionMeta = initialUserData.auctions.get(auction.address);

    expect(auctionMeta).not.toBeNull();

    const profitResult = await userAccount.send(
      blockchain.sender(auctionMeta!.address),
      {
        value: toNano("1000"),
      },
      {
        $$type: "Profit",
        amount: toNano("1000"),
      },
    );

    // ProfitSender sends moneys to userAccount
    expect(profitResult.transactions).toHaveTransaction({
      from: auctionMeta!.address,
      to: userAccount.address,
      success: true,
      aborted: false,
      deploy: false,
      value: toNano("1000"),
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

    // UserAccount sends 2% moneys to ReferreeAccount
    expect(profitResult.transactions).toHaveTransaction({
      from: userAccount.address,
      to: referreeAccount.address,
      success: true,
      aborted: false,
      deploy: false,
      value: isCloseTo(toNano("20")),
    });

    expect(profitResult.transactions).toHaveTransaction({
      from: referreeAccount.address,
      to: collector.address,
      success: true,
      aborted: false,
      deploy: false,
      value: isCloseTo(toNano("10")),
    });

    expect(profitResult.transactions).toHaveLength(4);

    const userBalance = await getBalance(blockchain, userAccount.address);
    const expectedUserBalance = toNano("965") + initialUserBalance;
    expect(expectedUserBalance - userBalance).toBeLessThan(toNano("0.01"));

    const referreeBalance = await getBalance(
      blockchain,
      referreeAccount.address,
    );
    const expectedReferreeBalance = toNano("10") + initialReferreeBalance;

    expect(expectedReferreeBalance - referreeBalance).toBeLessThan(
      toNano("0.01"),
    );

    const collectorBalance = await collector.getBalance();
    const expectedCollectorBalance = toNano("15") + initialCollectorBalance;
    expect(expectedCollectorBalance - collectorBalance).toBeLessThan(
      toNano("0.01"),
    );
  });

  it("User does not takes profit from addresses not in auctions list", async () => {
    const initialBalance = await getBalance(
      blockchain,
      userWithoutReferreeAccount.address,
    );

    const profitResult = await userWithoutReferreeAccount.send(
      blockchain.sender(referree.address),
      {
        value: toNano("1000"),
      },
      {
        $$type: "Profit",
        amount: toNano("1000"),
      },
    );

    // ProfitSender sends moneys to userAccount
    expect(profitResult.transactions).toHaveTransaction({
      from: referree.address,
      to: userWithoutReferreeAccount.address,
      success: false,
      aborted: true,
      deploy: false,
      value: isCloseTo(toNano("1000")),
    });

    expect(profitResult.transactions).toHaveLength(2);

    const balance = await getBalance(
      blockchain,
      userWithoutReferreeAccount.address,
    );
    expect(initialBalance - balance).toBeLessThan(toNano("0.01"));
  });

  it("Should send commission to controller if no referry exist", async () => {
    const auction = await createAuction(
      blockchain,
      collector,
      userWithoutReferree,
      userWithoutReferreeAccount,
    );

    const data = await userWithoutReferreeAccount.getData();

    const auctionMeta = data.auctions.get(auction.address);

    const initialBalance = await getBalance(
      blockchain,
      userWithoutReferreeAccount.address,
    );
    const initialReferreeBalance = await getBalance(
      blockchain,
      referreeAccount.address,
    );
    const initialCollectorBalance = await collector.getBalance();

    expect(auctionMeta).not.toBeUndefined();

    const profitResult = await userWithoutReferreeAccount.send(
      blockchain.sender(auctionMeta!.address),
      {
        value: toNano("1000"),
      },
      {
        $$type: "Profit",
        amount: toNano("1000"),
      },
    );

    // ProfitSender sends moneys to userAccount
    expect(profitResult.transactions).toHaveTransaction({
      from: auctionMeta!.address,
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

    expect(profitResult.transactions).toHaveLength(2);

    const balance = await getBalance(
      blockchain,
      userWithoutReferreeAccount.address,
    );
    const expected = toNano("1000") - toNano("15") + initialBalance;
    expect(expected - balance).toBeLessThan(toNano("0.01"));

    const referreeBalance = await getBalance(
      blockchain,
      referreeAccount.address,
    );
    expect(initialReferreeBalance - referreeBalance).toBeLessThan(
      toNano("0.01"),
    );

    const collectorBalance = await collector.getBalance();
    const expectedCollectorBalance = toNano("15") + initialCollectorBalance;
    expect(expectedCollectorBalance - collectorBalance).toBeLessThan(
      toNano("0.01"),
    );
  });

  it("Non owner should not be able to create auction", async () => {
    const createContractResult = await userAccount.send(
      collector.getSender(),
      {
        value: toNano("0.1"),
        bounce: false,
      },
      {
        $$type: "CreateBasicAuction",
        name: "Auction 1",
        type: "basic",
        description: "Empty",
        minimal_amount: toNano("1"),
        ends_at: BigInt(Math.trunc(new Date().valueOf() / 1000 + 3600 * 24)),
        secret_id: beginCell()
          .storeBuffer(Buffer.from([9, 9, 9]))
          .endCell(),
      },
    );

    expect(createContractResult.transactions).toHaveTransaction({
      from: collector.address,
      to: userAccount.address,
      success: false,
      aborted: true,
      deploy: false,
    });

    let data = await userAccount.getData();
    expect(data.auctions.keys().length).toBe(0);

    expect(createContractResult.transactions).toHaveLength(2);
  });

  it("User should not be able to create Auction for less than 5 hours", async () => {
    const createContractResult = await userAccount.send(
      user.getSender(),
      {
        value: toNano("0.1"),
        bounce: false,
      },
      {
        $$type: "CreateBasicAuction",
        name: "Auction 1",
        type: "basic",
        description: "Empty",
        minimal_amount: toNano("1"),
        ends_at: BigInt(Math.trunc(new Date().valueOf() / 1000)),
        secret_id: beginCell()
          .storeBuffer(Buffer.from([9, 9, 9]))
          .endCell(),
      },
    );

    expect(createContractResult.transactions).toHaveTransaction({
      from: user.address,
      to: userAccount.address,
      success: false,
      aborted: true,
      deploy: false,
    });

    let data = await userAccount.getData();
    expect(data.auctions.keys().length).toBe(0);
    expect(createContractResult.transactions).toHaveLength(2);
  });

  it("User should not be able to create Auction for more than 30 days", async () => {
    const createContractResult = await userAccount.send(
      user.getSender(),
      {
        value: toNano("0.1"),
        bounce: false,
      },
      {
        $$type: "CreateBasicAuction",
        name: "Auction 1",
        type: "basic",
        description: "Empty",
        minimal_amount: toNano("1"),
        ends_at: BigInt(Math.trunc(new Date().valueOf() / 1000)),
        secret_id: beginCell()
          .storeBuffer(Buffer.from([9, 9, 9]))
          .endCell(),
      },
    );

    expect(createContractResult.transactions).toHaveTransaction({
      from: user.address,
      to: userAccount.address,
      success: false,
      aborted: true,
      deploy: false,
    });

    let data = await userAccount.getData();

    expect(data.auctions.keys().length).toBe(0);
    expect(createContractResult.transactions).toHaveLength(2);
  });

  it("User should be able to create Auction through account", async () => {
    const auction = await createAuction(
      blockchain,
      collector,
      user,
      userAccount,
    );

    let data = await userAccount.getData();

    let auctionData = data.auctions.get(auction.address);

    expect(auctionData).not.toBeNull();
    expect(auctionData).toMatchObject({
      $$type: "AuctionConfig",
      name: "Auction 1",
      description: "Empty",
      type: "basic",
      ended: false,
    });
  });

  it("User should be able to delete Auction", async () => {
    let auction = await createAuction(blockchain, collector, user, userAccount);

    {
      let data = await userAccount.getData();
      const allowance = Number(data.allowance);
      expect(allowance).toBe(9);
    }

    let result = await auction.send(
      user.getSender(),
      {
        value: toNano("0.1"),
      },
      {
        $$type: "Delete",
      },
    );

    expect(result.transactions).toHaveTransaction({
      from: user.address,
      to: auction.address,
      success: true,
      aborted: false,
      deploy: false,
    });

    expect(result.transactions).toHaveTransaction({
      from: auction.address,
      to: userAccount.address,
      success: true,
      aborted: false,
      deploy: false,
    });

    {
      let data = await userAccount.getData();
      const allowance = Number(data.allowance);
      expect(allowance).toBe(10);
    }
  });

  it("Owner should be able to collect profit", async () => {
    let auction = await createAuction(blockchain, collector, user, userAccount);

    let accountBalance = await getBalance(blockchain, userAccount.address);

    await sendProfit(blockchain, auction, userAccount, toNano("1000"));
    let accountBalanceAfterProfit = await getBalance(
      blockchain,
      userAccount.address,
    );

    expect(
      accountBalanceAfterProfit - accountBalance - toNano("1000"),
    ).toBeLessThan(toNano("0.01"));

    let result = await userAccount.send(
      user.getSender(),
      {
        value: toNano("0.1"),
      },
      {
        $$type: "Collect",
        // amount: await userAccount.getBalance(),
      },
    );
    let accountBalanceAfterCollect = await getBalance(
      blockchain,
      userAccount.address,
    );

    expect(result.transactions).toHaveTransaction({
      from: userAccount.address,
      to: user.address,
      success: true,
      aborted: false,
      deploy: false,
    });

    expect(accountBalanceAfterCollect).toBeLessThan(toNano("0.1"));
  });

  it("No one else should be able to collect profit", async () => {
    let auction = await createAuction(blockchain, collector, user, userAccount);
    let accountBalance = await getBalance(blockchain, userAccount.address);

    await sendProfit(blockchain, auction, userAccount, toNano("1000"));
    let accountBalanceAfterProfit = await getBalance(
      blockchain,
      userAccount.address,
    );

    expect(
      accountBalanceAfterProfit - accountBalance - toNano("1000"),
    ).toBeLessThan(toNano("0.01"));

    let result = await userAccount.send(
      collector.getSender(),
      {
        value: toNano("0.1"),
      },
      {
        $$type: "Collect",
        // amount: await userAccount.getBalance(),
      },
    );

    expect(result.transactions).toHaveTransaction({
      from: collector.address,
      to: userAccount.address,
      success: false,
      aborted: true,
      deploy: false,
    });
  });

  it("Adding new auctions depletes allowance", async () => {
    expect((await userAccount.getData()).allowance).toBe(10n);
    await createAuction(blockchain, collector, user, userAccount, "1");
    expect((await userAccount.getData()).allowance).toBe(9n);
    await createAuction(blockchain, collector, user, userAccount, "2");
    expect((await userAccount.getData()).allowance).toBe(8n);
    await createAuction(blockchain, collector, user, userAccount, "3");
    expect((await userAccount.getData()).allowance).toBe(7n);
    await createAuction(blockchain, collector, user, userAccount, "4");
    expect((await userAccount.getData()).allowance).toBe(6n);

    let result2 = await userAccount.send(
      user.getSender(),
      {
        value: toNano("0.02"),
        bounce: false,
      },
      {
        $$type: "CreateBasicAuction",
        name: "3",
        type: "basic",
        description: "Empty",
        minimal_amount: toNano("1"),
        ends_at: BigInt(Math.trunc(new Date().valueOf() / 1000 + 3600 * 24)),
        secret_id: beginCell()
          .storeBuffer(Buffer.from([9, 9, 9]))
          .endCell(),
      },
    );

    expect(result2.transactions).toHaveTransaction({
      from: user.address,
      to: userAccount.address,
      success: false,
      deploy: false,
      aborted: true,
      exitCode: Number(Controller.ERRORS_AUCTION_ALREADY_EXISTS),
    });

    await createAuction(blockchain, collector, user, userAccount, "5");
    expect((await userAccount.getData()).allowance).toBe(5n);
    await createAuction(blockchain, collector, user, userAccount, "6");
    expect((await userAccount.getData()).allowance).toBe(4n);
    await createAuction(blockchain, collector, user, userAccount, "7");
    expect((await userAccount.getData()).allowance).toBe(3n);
    await createAuction(blockchain, collector, user, userAccount, "8");
    expect((await userAccount.getData()).allowance).toBe(2n);
    await createAuction(blockchain, collector, user, userAccount, "9");
    expect((await userAccount.getData()).allowance).toBe(1n);
    await createAuction(blockchain, collector, user, userAccount, "10");
    expect((await userAccount.getData()).allowance).toBe(0n);

    let result1 = await userAccount.send(
      user.getSender(),
      {
        value: toNano("0.02"),
        bounce: false,
      },
      {
        $$type: "CreateBasicAuction",
        name: "11",
        type: "basic",
        description: "Empty",
        minimal_amount: toNano("1"),
        ends_at: BigInt(Math.trunc(new Date().valueOf() / 1000 + 3600 * 24)),
        secret_id: beginCell()
          .storeBuffer(Buffer.from([9, 9, 9]))
          .endCell(),
      },
    );

    expect(result1.transactions).toHaveTransaction({
      from: user.address,
      to: userAccount.address,
      success: false,
      deploy: false,
      aborted: true,
      exitCode: Number(Controller.ERRORS_NOT_ENOUGH_ALLOWANCE),
    });
  });

  it("Resolve (Profit) increases allowance", async () => {
    let auction = await createAuction(blockchain, collector, user, userAccount);
    let allowanceBefore = (await userAccount.getData()).allowance;
    await sendProfit(blockchain, auction, userAccount, toNano("1000"));
    let allowanceAfter = (await userAccount.getData()).allowance;
    expect(allowanceAfter - allowanceBefore).toBe(1n);
  });

  it("Refund increases allowance", async () => {
    let auction = await createAuction(blockchain, collector, user, userAccount);
    let allowanceBefore = (await userAccount.getData()).allowance;
    await deleteAuction(blockchain, userAccount, auction, true);
    let allowanceAfter = (await userAccount.getData()).allowance;
    expect(allowanceAfter - allowanceBefore).toBe(1n);
  });

  it("Delete increases allowance", async () => {
    let auction = await createAuction(blockchain, collector, user, userAccount);
    let allowanceBefore = (await userAccount.getData()).allowance;
    await deleteAuction(blockchain, userAccount, auction, false);
    let allowanceAfter = (await userAccount.getData()).allowance;
    expect(allowanceAfter - allowanceBefore).toBe(1n);
  });

  it("Check referral comission chain of 3-4 users", async () => {
    // 0
    let [user1, account1] = await createUserAndAccount(
      blockchain,
      collector,
      null,
      0n,
      1000n, // 10%
      "u1",
    );
    // 1
    let [user2, account2] = await createUserAndAccount(
      blockchain,
      collector,
      account1,
      0n,
      1000n, // 10%
      "u2",
    );
    // 2
    let [user3, account3] = await createUserAndAccount(
      blockchain,
      collector,
      account2,
      0n,
      1000n, // 10%
      "u3",
    );
    // 4
    let [user4, account4] = await createUserAndAccount(
      blockchain,
      collector,
      account3,
      0n,
      1000n, // 10%
      "u4",
    );
    // 16
    let [user5, account5] = await createUserAndAccount(
      blockchain,
      collector,
      account4,
      0n,
      1000n, // 10%
      "u5",
    );
    let auction = await createAuction(blockchain, collector, user5, account5);

    let balance1before = await getBalance(blockchain, account1.address);
    let balance2before = await getBalance(blockchain, account2.address);
    let balance3before = await getBalance(blockchain, account3.address);
    let balance4before = await getBalance(blockchain, account4.address);
    await sendProfit(blockchain, auction, account5, toNano("100000"));
    let balance1after = await getBalance(blockchain, account1.address);
    let balance2after = await getBalance(blockchain, account2.address);
    let balance3after = await getBalance(blockchain, account3.address);
    let balance4after = await getBalance(blockchain, account4.address);

    expect(balance1after - balance1before - toNano("6250")).toBeLessThan(
      toNano("0.01"),
    );
    expect(balance2after - balance2before - toNano("12500")).toBeLessThan(
      toNano("0.01"),
    );
    expect(balance3after - balance3before - toNano("25000")).toBeLessThan(
      toNano("0.01"),
    );
    expect(balance4after - balance4before - toNano("50000")).toBeLessThan(
      toNano("0.01"),
    );
  });
});
