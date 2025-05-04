import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import { beginCell, toNano } from "@ton/core";
import { BasicAuction } from "../wrappers/Auctions";
import "@ton/test-utils";
import * as helpers from "./helpers";

describe("Auctions", () => {
  let blockchain: Blockchain;
  let anyone: SandboxContract<TreasuryContract>;
  let auction: SandboxContract<BasicAuction>;
  let owner: SandboxContract<TreasuryContract>;
  let owner_account: SandboxContract<TreasuryContract>;
  let collector: SandboxContract<TreasuryContract>;
  let bidder1: SandboxContract<TreasuryContract>;
  let bidder2: SandboxContract<TreasuryContract>;
  let ends_at = Math.trunc(new Date().valueOf() / 1000) + 3600 * 24;

  beforeEach(async () => {
    blockchain = await Blockchain.create();
    anyone = await blockchain.treasury("deployer");
    owner = await blockchain.treasury("owner");
    owner_account = await blockchain.treasury("account");
    collector = await blockchain.treasury("collector");
    bidder1 = await blockchain.treasury("bidder1");
    bidder2 = await blockchain.treasury("bidder2");

    auction = blockchain.openContract(
      await BasicAuction.fromInit({
        $$type: "BasicAuctionInit",

        collector: collector.address,
        ends_at: BigInt(ends_at),
        name: "name",
        owner_account: owner_account.address,

        // balance: null,
        // description: "",
        // name: ,
        // ended: false,
        // ends_at: ,
        // minimal_amount: toNano("10"),
        // minimal_raise: toNano("10"),
        // owner_account: ,
        // owner_secret_id: ,
        // refund: false,
        // winner: null,
      }),
    );

    const endsAt = Math.trunc(new Date().valueOf() / 1000 + 3600 * 24);

    const deployResult = await auction.send(
      owner_account.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "BasicAuctionInitialise",
        description: "description",
        type: "basic",
        minimal_amount: toNano("10"),
        owner_secret_id: beginCell()
          .storeBuffer(Buffer.from([1, 2, 3]))
          .endCell(),
        owner: owner.address,
      },
    );

    expect(deployResult.transactions).toHaveTransaction({
      from: owner_account.address,
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
        secret_id: beginCell()
          .storeBuffer(Buffer.from([1, 2, 3, 4]))
          .endCell(),
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
        secret_id: beginCell()
          .storeBuffer(Buffer.from([1, 2, 3, 4]))
          .endCell(),
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
    let initialData = await auction.getData();
    let ownerSecretId = initialData.owner_secret_id;
    expect(ownerSecretId.toString()).toBe("x{010203}");

    let bidResult = await auction.send(
      bidder1.getSender(),
      {
        value: toNano("15"),
        bounce: false,
      },
      {
        $$type: "Bid",
        secret_id: beginCell()
          .storeBuffer(Buffer.from([7]))
          .endCell(),
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

    let data = await auction.getData();
    let winner = data.winner;

    let owner_secret_id = data.owner_secret_id;
    expect(owner_secret_id.toString()).toBe("x{010203}");

    expect(winner).not.toBeNull();
    expect(winner!.address.toString()).toBe(bidder1.address.toString());
    expect(winner!.amount).toBe(toNano("15"));
    expect(winner!.secret_id.toString()).toBe("x{07}");
    expect(data.balance! - initialData.balance! - toNano("15")).toBeLessThan(
      toNano("0.01"),
    );
  });

  it("should refuse bid smaller than current bid", async () => {
    let initialData = await auction.getData();
    {
      let bidResult = await auction.send(
        bidder1.getSender(),
        {
          value: toNano("15"),
          bounce: false,
        },
        {
          $$type: "Bid",
          secret_id: beginCell()
            .storeBuffer(Buffer.from([1, 2, 3, 4]))
            .endCell(),
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
      let data = await auction.getData();
      let winner = data.winner;
      expect(winner).not.toBeNull();
      expect(winner!.address.toString()).toBe(bidder1.address.toString());
      expect(winner!.amount).toBe(toNano("15"));
      expect(winner!.secret_id.toString()).toBe("x{01020304}");
      expect(data.balance! - initialData.balance! - toNano("15")).toBeLessThan(
        toNano("0.01"),
      );
    }
    {
      let bidResult = await auction.send(
        bidder2.getSender(),
        {
          value: toNano("10"),
        },
        {
          $$type: "Bid",
          secret_id: beginCell()
            .storeBuffer(Buffer.from([1, 2, 3, 4]))
            .endCell(),
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
      let data = await auction.getData();
      let winner = data.winner;
      expect(winner).not.toBeNull();
      expect(winner!.address.toString()).toBe(bidder1.address.toString());
      expect(winner!.amount).toBe(toNano("15"));
      expect(winner!.secret_id.toString()).toBe("x{01020304}");

      expect(data.balance! - initialData.balance! - toNano("15")).toBeLessThan(
        toNano("0.01"),
      );
    }
  });

  // it("should respect bid minimum bid raise setting", async () => {
  //   let initialData = await auction.getData();
  //   {
  //     let bidResult = await auction.send(
  //       bidder1.getSender(),
  //       {
  //         value: toNano("15"),
  //         bounce: false,
  //       },
  //       {
  //         $$type: "Bid",
  //         secret_id: beginCell()
  //           .storeBuffer(Buffer.from([1, 2, 3]))
  //           .endCell(),
  //       },
  //     );
  //     expect(bidResult.transactions).toHaveTransaction({
  //       from: bidder1.address,
  //       to: auction.address,
  //       success: true,
  //       value: toNano("15"),
  //       deploy: false,
  //       aborted: false,
  //     });
  //     let data = await auction.getData();
  //     let winner = data.winner;
  //     expect(winner).not.toBeNull();
  //     expect(winner!.address.toString()).toBe(bidder1.address.toString());
  //     expect(winner!.amount).toBe(toNano("15"));
  //     expect(winner!.secret_id.toString()).toBe("x{010203}");
  //     expect(data.balance! - initialData.balance! - toNano("15")).toBeLessThan(
  //       toNano("0.01"),
  //     );
  //   }
  //   {
  //     let minimalRaise = initialData.minimal_raise;
  //     let bidResult = await auction.send(
  //       bidder2.getSender(),
  //       {
  //         value: toNano("15") + minimalRaise - 1n,
  //       },
  //       {
  //         $$type: "Bid",
  //         secret_id: beginCell()
  //           .storeBuffer(Buffer.from([1, 3, 4]))
  //           .endCell(),
  //       },
  //     );
  //     expect(bidResult.transactions).toHaveTransaction({
  //       from: bidder2.address,
  //       to: auction.address,
  //       success: false,
  //       value: toNano("15") + minimalRaise - 1n,
  //       deploy: false,
  //       aborted: true,
  //       exitCode: Number(BasicAuction.ERRORS_BID_RAISE_IS_TOO_SMALL),
  //     });
  //     let data = await auction.getData();
  //     let winner = data.winner;
  //     expect(winner).not.toBeNull();
  //     expect(winner!.address.toString()).toBe(bidder1.address.toString());
  //     expect(winner!.amount).toBe(toNano("15"));
  //     expect(winner!.secret_id.toString()).toBe("x{010203}");
  //     expect(data.balance! - initialData.balance! - toNano("15")).toBeLessThan(
  //       toNano("0.01"),
  //     );
  //   }
  // });

  it("should return previous bid and update winner to a highest bidder", async () => {
    let initialData = await auction.getData();
    {
      let bidResult = await auction.send(
        bidder1.getSender(),
        {
          value: toNano("15"),
          bounce: false,
        },
        {
          $$type: "Bid",
          secret_id: beginCell()
            .storeBuffer(Buffer.from([1, 2, 3, 4]))
            .endCell(),
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
      let data = await auction.getData();
      let winner = data.winner;
      expect(winner).not.toBeNull();
      expect(winner!.address.toString()).toBe(bidder1.address.toString());
      expect(winner!.amount).toBe(toNano("15"));
      expect(winner!.secret_id.toString()).toBe("x{01020304}");
      expect(data.balance! - initialData.balance! - toNano("15")).toBeLessThan(
        toNano("0.01"),
      );
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
          secret_id: beginCell()
            .storeBuffer(Buffer.from([1, 2, 3, 4]))
            .endCell(),
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
      let data = await auction.getData();
      let winner = data.winner;
      expect(winner).not.toBeNull();
      expect(winner!.address.toString()).toBe(bidder2.address.toString());
      expect(winner!.amount).toBe(toNano("20"));
      expect(winner!.secret_id.toString()).toBe("x{01020304}");

      expect(data.balance! - initialData.balance! - toNano("20")).toBeLessThan(
        toNano("0.01"),
      );
      let new_bidder1balance = await bidder1.getBalance();
      expect(new_bidder1balance - bidder1balance - toNano("15")).toBeLessThan(
        toNano("0.01"),
      );
    }
  });

  it("should not allow bidding when time is out", async () => {
    blockchain.now = ends_at + 1;
    let initialData = await auction.getData();
    let bidResult = await auction.send(
      bidder1.getSender(),
      {
        value: toNano("15"),
        bounce: true,
      },
      {
        $$type: "Bid",
        secret_id: beginCell()
          .storeBuffer(Buffer.from([1, 2, 3, 4]))
          .endCell(),
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
    let data = await auction.getData();
    let winner = data.winner;
    expect(winner).toBeNull();
    expect(data.balance! - initialData.balance!).toBeLessThan(toNano("0.01"));
  });

  it("Should allow owner to delete unfinished auction without winner", async () => {
    let initialData = await auction.getData();
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
      value: helpers.isCloseTo(initialData.balance! + toNano("0.01")),
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
        secret_id: beginCell()
          .storeBuffer(Buffer.from([1, 2, 3, 4]))
          .endCell(),
      },
    );
    let winner = (await auction.getData()).winner;
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

  it("Should allow anyone to resolve auction", async () => {
    await auction.send(
      bidder1.getSender(),
      {
        value: toNano("15"),
        bounce: false,
      },
      {
        $$type: "Bid",
        secret_id: beginCell()
          .storeBuffer(Buffer.from([1, 2, 3, 4]))
          .endCell(),
      },
    );
    let data = await auction.getData();
    let winner = data.winner;
    expect(winner).not.toBeNull();

    blockchain.now = ends_at + 1;
    let remainingBalance = data.balance;
    let result = await auction.send(
      anyone.getSender(),
      {
        value: toNano("0.01"),
        bounce: true,
      },
      { $$type: "Resolve" },
    );

    expect(result.transactions).toHaveTransaction({
      from: anyone.address,
      to: auction.address,
      aborted: false,
      success: true,
    });

    expect(result.transactions).toHaveTransaction({
      from: auction.address,
      to: owner_account.address,
      aborted: false,
      success: true,
      value: helpers.isCloseTo(remainingBalance!),
    });

    const contract = await blockchain.getContract(auction.address);
    expect(contract.accountState).toBeUndefined();
    expect(contract.balance).toBeLessThan(toNano("0.001"));
  });

  it("Should allow anyone to resolve auction via external message", async () => {
    await auction.send(
      bidder1.getSender(),
      {
        value: toNano("15"),
        bounce: false,
      },
      {
        $$type: "Bid",
        secret_id: beginCell()
          .storeBuffer(Buffer.from([1, 2, 3, 4]))
          .endCell(),
      },
    );
    let data = await auction.getData();
    let winner = data.winner;
    expect(winner).not.toBeNull();

    blockchain.now = ends_at + 1;
    let remainingBalance = data.balance;
    let result = await auction.sendExternal({ $$type: "Resolve" });

    expect(result.transactions).toHaveTransaction({
      to: auction.address,
      aborted: false,
      success: true,
    });

    expect(result.transactions).toHaveTransaction({
      from: auction.address,
      to: owner_account.address,
      aborted: false,
      success: true,
      value: helpers.isCloseTo(remainingBalance!),
    });

    const contract = await blockchain.getContract(auction.address);
    expect(contract.accountState).toBeUndefined();
    expect(contract.balance).toBeLessThan(toNano("0.001"));
  });

  it.skip("Should not allow others to resolve auction", async () => {
    await auction.send(
      bidder1.getSender(),
      {
        value: toNano("15"),
        bounce: false,
      },
      {
        $$type: "Bid",
        secret_id: beginCell()
          .storeBuffer(Buffer.from([1, 2, 3, 4]))
          .endCell(),
      },
    );

    let winner = (await auction.getData()).winner;
    expect(winner).not.toBeNull();
    blockchain.now = ends_at + 1;

    let result = await auction.send(
      bidder1.getSender(),
      {
        value: toNano("0.01"),
        bounce: true,
      },
      { $$type: "Resolve" },
    );

    expect(result.transactions).toHaveTransaction({
      from: bidder1.address,
      to: auction.address,
      aborted: true,
      success: false,
    });
  });

  it("Should not allow to resolve unfinished auction", async () => {
    await auction.send(
      bidder1.getSender(),
      {
        value: toNano("15"),
        bounce: false,
      },
      {
        $$type: "Bid",
        secret_id: beginCell()
          .storeBuffer(Buffer.from([1, 2, 3, 4]))
          .endCell(),
      },
    );
    let winner = (await auction.getData()).winner;
    expect(winner).not.toBeNull();

    let result = await auction.send(
      anyone.getSender(),
      {
        value: toNano("0.01"),
        bounce: true,
      },
      { $$type: "Resolve" },
    );

    expect(result.transactions).toHaveTransaction({
      from: anyone.address,
      to: auction.address,
      aborted: true,
      success: false,
    });
  });

  it("Should allow anyone to resolve finished auction without winner", async () => {
    let initialData = await auction.getData();
    let winner = initialData.winner;

    expect(winner).toBeNull();

    blockchain.now = ends_at + 1;

    let remainingBalance = initialData.balance!;
    let result = await auction.send(
      anyone.getSender(),
      {
        value: toNano("0.01"),
        bounce: true,
      },
      { $$type: "Resolve" },
    );

    expect(result.transactions).toHaveTransaction({
      from: anyone.address,
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
