import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import { toNano } from "@ton/core";
import { BasicAuction } from "../wrappers/Auctions";
import "@ton/test-utils";
import * as helpers from "./helpers";

describe("Auctions", () => {
  let blockchain: Blockchain;
  let deployer: SandboxContract<TreasuryContract>;
  let auction: SandboxContract<BasicAuction>;
  let owner: SandboxContract<TreasuryContract>;
  let owner_account: SandboxContract<TreasuryContract>;
  let collector: SandboxContract<TreasuryContract>;
  let bidder1: SandboxContract<TreasuryContract>;
  let bidder2: SandboxContract<TreasuryContract>;

  let ends_at = Math.trunc(new Date().valueOf() / 1000) + 3600 * 24;

  beforeEach(async () => {
    blockchain = await Blockchain.create();
    deployer = await blockchain.treasury("deployer");
    owner = await blockchain.treasury("owner");
    owner_account = await blockchain.treasury("account");
    collector = await blockchain.treasury("collector");
    bidder1 = await blockchain.treasury("bidder1");
    bidder2 = await blockchain.treasury("bidder2");

    auction = blockchain.openContract(
      await BasicAuction.fromInit(
        BigInt(0),
        "name",
        "description",
        owner.address,
        owner_account.address,
        collector.address,
        toNano("10"),
        BigInt(ends_at),
        BigInt(0),
        null,
        false,
        false,
      ),
    );

    const deployResult = await auction.send(
      deployer.getSender(),
      {
        value: toNano("0.05"),
      },
      null,
    );

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: auction.address,
      deploy: true,
      success: true,
    });
  });

  it("should not allow bidding less than minimal amount", async () => {
    let bidResult = await auction.send(
      bidder1.getSender(),
      {
        value: toNano("5"),
        bounce: false,
      },
      {
        $$type: "Bid",
        chat_id: BigInt(100),
      },
    );

    expect(bidResult.transactions).toHaveLength(2);
    expect(bidResult.transactions).toHaveTransaction({
      from: bidder1.address,
      to: auction.address,
      success: false,
      aborted: true,
      exitCode: Number(BasicAuction.ERRORS_BID_IS_TOO_SMALL),
    });
  });

  it.skip("should not allow owner to bid", async () => {
    let bidResult = await auction.send(
      owner.getSender(),
      {
        value: toNano("15"),
        bounce: false,
      },
      {
        $$type: "Bid",
        chat_id: BigInt(100),
      },
    );

    expect(bidResult.transactions).toHaveLength(2);
    expect(bidResult.transactions).toHaveTransaction({
      from: owner.address,
      to: auction.address,
      success: false,
      aborted: true,
      exitCode: Number(BasicAuction.ERRORS_OWNER_BID_NOT_ALLOWED),
    });
  });

  it("should allow bidding", async () => {
    let balance = await auction.getBalance();

    let bidResult = await auction.send(
      bidder1.getSender(),
      {
        value: toNano("15"),
        bounce: false,
      },
      {
        $$type: "Bid",
        chat_id: BigInt(100),
      },
    );

    expect(bidResult.transactions).toHaveTransaction({
      from: bidder1.address,
      to: auction.address,
      success: true,
      value: toNano("15"),
      deploy: false,
      aborted: false,
    });

    let winner = await auction.getWinner();

    expect(winner).not.toBeNull();

    expect(winner!.address.toString()).toBe(bidder1.address.toString());
    expect(winner!.amount).toBe(toNano("15"));
    expect(winner!.chat_id).toBe(BigInt(100));

    let new_balance = await auction.getBalance();
    expect(new_balance - balance - toNano("15")).toBeLessThan(toNano("0.01"));
  });

  it("should refuse bid smaller than current bid", async () => {
    let balance = await auction.getBalance();

    {
      let bidResult = await auction.send(
        bidder1.getSender(),
        {
          value: toNano("15"),
          bounce: false,
        },
        {
          $$type: "Bid",
          chat_id: BigInt(100),
        },
      );

      expect(bidResult.transactions).toHaveTransaction({
        from: bidder1.address,
        to: auction.address,
        success: true,
        value: toNano("15"),
        deploy: false,
        aborted: false,
      });

      let winner = await auction.getWinner();

      expect(winner).not.toBeNull();

      expect(winner!.address.toString()).toBe(bidder1.address.toString());
      expect(winner!.amount).toBe(toNano("15"));
      expect(winner!.chat_id).toBe(BigInt(100));

      let new_balance = await auction.getBalance();
      expect(new_balance - balance - toNano("15")).toBeLessThan(toNano("0.01"));
    }
    {
      let bidResult = await auction.send(
        bidder2.getSender(),
        {
          value: toNano("10"),
        },
        {
          $$type: "Bid",
          chat_id: BigInt(100),
        },
      );

      expect(bidResult.transactions).toHaveTransaction({
        from: bidder2.address,
        to: auction.address,
        success: false,
        value: helpers.isCloseTo(toNano("10")),
        deploy: false,
        aborted: true,
        exitCode: Number(BasicAuction.ERRORS_BID_IS_TOO_SMALL),
      });

      let winner = await auction.getWinner();

      expect(winner).not.toBeNull();

      expect(winner!.address.toString()).toBe(bidder1.address.toString());
      expect(winner!.amount).toBe(toNano("15"));
      expect(winner!.chat_id).toBe(BigInt(100));

      let new_balance = await auction.getBalance();
      expect(new_balance - balance - toNano("15")).toBeLessThan(toNano("0.01"));
    }
  });

  it("should respect bid minimum bid raise setting", async () => {
    let balance = await auction.getBalance();

    {
      let bidResult = await auction.send(
        bidder1.getSender(),
        {
          value: toNano("15"),
          bounce: false,
        },
        {
          $$type: "Bid",
          chat_id: BigInt(100),
        },
      );

      expect(bidResult.transactions).toHaveTransaction({
        from: bidder1.address,
        to: auction.address,
        success: true,
        value: toNano("15"),
        deploy: false,
        aborted: false,
      });

      let winner = await auction.getWinner();

      expect(winner).not.toBeNull();

      expect(winner!.address.toString()).toBe(bidder1.address.toString());
      expect(winner!.amount).toBe(toNano("15"));
      expect(winner!.chat_id).toBe(BigInt(100));

      let new_balance = await auction.getBalance();
      expect(new_balance - balance - toNano("15")).toBeLessThan(toNano("0.01"));
    }
    {
      let minimalRaise = await auction.getMinimalRaise();

      let bidResult = await auction.send(
        bidder2.getSender(),
        {
          value: toNano("15") + minimalRaise - 1n,
        },
        {
          $$type: "Bid",
          chat_id: BigInt(100),
        },
      );

      expect(bidResult.transactions).toHaveTransaction({
        from: bidder2.address,
        to: auction.address,
        success: false,
        value: toNano("15") + minimalRaise - 1n,
        deploy: false,
        aborted: true,
        exitCode: Number(BasicAuction.ERRORS_BID_RAISE_IS_TOO_SMALL),
      });

      let winner = await auction.getWinner();

      expect(winner).not.toBeNull();

      expect(winner!.address.toString()).toBe(bidder1.address.toString());
      expect(winner!.amount).toBe(toNano("15"));
      expect(winner!.chat_id).toBe(BigInt(100));

      let new_balance = await auction.getBalance();
      expect(new_balance - balance - toNano("15")).toBeLessThan(toNano("0.01"));
    }
  });

  it("should return previous bid and update winner to a highest bidder", async () => {
    let balance = await auction.getBalance();
    {
      let bidResult = await auction.send(
        bidder1.getSender(),
        {
          value: toNano("15"),
          bounce: false,
        },
        {
          $$type: "Bid",
          chat_id: BigInt(100),
        },
      );

      expect(bidResult.transactions).toHaveTransaction({
        from: bidder1.address,
        to: auction.address,
        success: true,
        value: toNano("15"),
        deploy: false,
        aborted: false,
      });

      let winner = await auction.getWinner();

      expect(winner).not.toBeNull();

      expect(winner!.address.toString()).toBe(bidder1.address.toString());
      expect(winner!.amount).toBe(toNano("15"));
      expect(winner!.chat_id).toBe(BigInt(100));

      let new_balance = await auction.getBalance();
      expect(new_balance - balance - toNano("15")).toBeLessThan(toNano("0.01"));
    }

    let bidder1balance = await bidder1.getBalance();
    {
      let bidResult = await auction.send(
        bidder2.getSender(),
        {
          value: toNano("20"),
          bounce: false,
        },
        {
          $$type: "Bid",
          chat_id: BigInt(100),
        },
      );

      expect(bidResult.transactions).toHaveTransaction({
        from: bidder2.address,
        to: auction.address,
        success: true,
        value: toNano("20"),
        deploy: false,
        aborted: false,
      });

      expect(bidResult.transactions).toHaveTransaction({
        from: auction.address,
        to: bidder1.address,
        success: true,
        value: helpers.isCloseTo(toNano("15")),
        deploy: false,
        aborted: false,
      });

      let winner = await auction.getWinner();

      expect(winner).not.toBeNull();

      expect(winner!.address.toString()).toBe(bidder2.address.toString());
      expect(winner!.amount).toBe(toNano("20"));
      expect(winner!.chat_id).toBe(BigInt(100));

      let new_balance = await auction.getBalance();
      expect(new_balance - balance - toNano("20")).toBeLessThan(toNano("0.01"));

      let new_bidder1balance = await bidder1.getBalance();

      expect(new_bidder1balance - bidder1balance - toNano("15")).toBeLessThan(
        toNano("0.01"),
      );
    }
  });

  it("should not allow bidding when time is out", async () => {
    blockchain.now = ends_at + 1;

    let balance = await auction.getBalance();

    let bidResult = await auction.send(
      bidder1.getSender(),
      {
        value: toNano("15"),
        bounce: true,
      },
      {
        $$type: "Bid",
        chat_id: BigInt(100),
      },
    );

    expect(bidResult.transactions).toHaveTransaction({
      from: bidder1.address,
      to: auction.address,
      success: false,
      value: toNano("15"),
      deploy: false,
      aborted: true,
    });

    let winner = await auction.getWinner();

    expect(winner).toBeNull();

    let new_balance = await auction.getBalance();
    expect(new_balance - balance).toBeLessThan(toNano("0.01"));
  });

  it("Should allow owner to delete unfinished auction without winner", async () => {
    let balance = (await auction.getBalance()) + toNano("0.01");

    let deleteResult = await auction.send(
      owner.getSender(),
      {
        value: toNano("0.01"),
        bounce: true,
      },
      {
        $$type: "Delete",
      },
    );

    expect(deleteResult.transactions).toHaveTransaction({
      from: owner.address,
      to: auction.address,
      success: true,
      value: toNano("0.01"),
      deploy: false,
      aborted: false,
    });

    expect(deleteResult.transactions).toHaveTransaction({
      from: auction.address,
      to: owner_account.address,
      success: true,
      value: helpers.isCloseTo(balance),
      deploy: false,
      aborted: false,
    });
  });

  it("Should not allow others to delete auction", async () => {
    let deleteResult = await auction.send(
      bidder2.getSender(),
      {
        value: toNano("0.01"),
        bounce: true,
      },
      {
        $$type: "Delete",
      },
    );

    expect(deleteResult.transactions).toHaveTransaction({
      from: bidder2.address,
      to: auction.address,
      success: false,
      value: toNano("0.01"),
      deploy: false,
      aborted: true,
    });
  });

  it("Should not allow owner to delete unfinished auction with winner", async () => {
    await auction.send(
      bidder1.getSender(),
      {
        value: toNano("15"),
        bounce: false,
      },
      {
        $$type: "Bid",
        chat_id: BigInt(100),
      },
    );

    let winner = await auction.getWinner();

    expect(winner).not.toBeNull();

    let deleteResult = await auction.send(
      owner.getSender(),
      {
        value: toNano("0.01"),
        bounce: true,
      },
      {
        $$type: "Delete",
      },
    );

    expect(deleteResult.transactions).toHaveTransaction({
      from: owner.address,
      to: auction.address,
      aborted: true,
      success: false,
    });
  });

  it("Should allow owner to resolve auction", async () => {
    await auction.send(
      bidder1.getSender(),
      {
        value: toNano("15"),
        bounce: false,
      },
      {
        $$type: "Bid",
        chat_id: BigInt(100),
      },
    );

    let winner = await auction.getWinner();

    expect(winner).not.toBeNull();

    blockchain.now = ends_at + 1;

    let remainingBalance = await auction.getBalance();

    let result = await auction.send(
      owner.getSender(),
      {
        value: toNano("0.01"),
        bounce: true,
      },
      {
        $$type: "Resolve",
      },
    );

    expect(result.transactions).toHaveTransaction({
      from: owner.address,
      to: auction.address,
      aborted: false,
      success: true,
    });

    expect(result.transactions).toHaveTransaction({
      from: auction.address,
      to: owner_account.address,
      aborted: false,
      success: true,
      value: helpers.isCloseTo(remainingBalance),
    });

    expect(await auction.getBalance()).toBeLessThan(toNano("0.001"));
  });

  it("Should not allow others to resolve auction", async () => {
    await auction.send(
      bidder1.getSender(),
      {
        value: toNano("15"),
        bounce: false,
      },
      {
        $$type: "Bid",
        chat_id: BigInt(100),
      },
    );

    let winner = await auction.getWinner();

    expect(winner).not.toBeNull();

    blockchain.now = ends_at + 1;

    let result = await auction.send(
      bidder1.getSender(),
      {
        value: toNano("0.01"),
        bounce: true,
      },
      {
        $$type: "Resolve",
      },
    );

    expect(result.transactions).toHaveTransaction({
      from: bidder1.address,
      to: auction.address,
      aborted: true,
      success: false,
    });
  });

  it("Should not allow owner to resolve unfinished auction", async () => {
    await auction.send(
      bidder1.getSender(),
      {
        value: toNano("15"),
        bounce: false,
      },
      {
        $$type: "Bid",
        chat_id: BigInt(100),
      },
    );

    let winner = await auction.getWinner();

    expect(winner).not.toBeNull();

    let result = await auction.send(
      owner.getSender(),
      {
        value: toNano("0.01"),
        bounce: true,
      },
      {
        $$type: "Resolve",
      },
    );

    expect(result.transactions).toHaveTransaction({
      from: owner.address,
      to: auction.address,
      aborted: true,
      success: false,
    });
  });

  it("Should allow owner to resolve finished auction without winner", async () => {
    let winner = await auction.getWinner();

    expect(winner).toBeNull();

    blockchain.now = ends_at + 1;

    let remainingBalance = await auction.getBalance();

    let result = await auction.send(
      owner.getSender(),
      {
        value: toNano("0.01"),
        bounce: true,
      },
      {
        $$type: "Resolve",
      },
    );

    expect(result.transactions).toHaveTransaction({
      from: owner.address,
      to: auction.address,
      aborted: false,
      success: true,
    });

    expect(result.transactions).toHaveTransaction({
      from: auction.address,
      to: owner_account.address,
      aborted: false,
      success: true,
      value: helpers.isCloseTo(remainingBalance),
    });
  });
});
