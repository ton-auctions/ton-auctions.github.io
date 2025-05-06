import { DAO, getDAO } from "./dao.ts";
import { Address } from "@ton/core";
import { expect } from "@std/expect/expect";
import { beforeEach, describe, it } from "jsr:@std/testing/bdd";

describe("Users DAO", () => {
  let dao: DAO;

  beforeEach(async () => {
    dao = await getDAO("./db/testdb.sqlite", true);
  });

  it("Should return undefined in user does not exist", () => {
    expect(dao.users.getUser("unknown")).toBeUndefined();
  });

  it("Should returns user if exists", () => {
    dao.users.saveUser({
      chatId: 123123,
      userIdHash: "userIdHash",
    });

    expect(dao.users.userCount()).toBe(1n);
    const user = dao.users.getUser("userIdHash");
    expect(user).not.toBeUndefined();
    expect(user).toMatchObject({
      chatId: 123123,
      userIdHash: "userIdHash",
    });
  });

  it("Should overwrite existent user on save", () => {
    dao.users.saveUser({
      chatId: 123123,
      userIdHash: "userIdHash",
    });

    dao.users.saveUser({
      chatId: 1231232323,
      userIdHash: "userIdHash",
    });

    expect(dao.users.userCount()).toBe(1n);
    const user = dao.users.getUser("userIdHash");
    expect(user).not.toBeUndefined();
    expect(user).toMatchObject({
      chatId: 1231232323,
      userIdHash: "userIdHash",
    });
  });

  it("Should save account for unexistent user", () => {
    expect(() => {
      dao.users.saveAccount({
        address: Address.parse(
          "UQCSBgoQXcdx82WE_OdARpS9mIEDMgGnhpr-hEwO8wf7CCGD"
        ),
        userIdHash: "somehash",
      });
    }).toThrow();
  });

  it("Should save account for existent user and then retrieve user by its address", () => {
    dao.users.saveUser({
      chatId: 8782932232,
      userIdHash: "userIdHash",
    });

    const addr = Address.parse(
      "UQCSBgoQXcdx82WE_OdARpS9mIEDMgGnhpr-hEwO8wf7CCGD"
    );
    dao.users.saveAccount({
      address: addr,
      userIdHash: "userIdHash",
    });

    expect(dao.users.userCount()).toBe(1n);

    const user = dao.users.getUserForAccount(addr);

    expect(user).toMatchObject({
      chatId: 8782932232,
      userIdHash: "userIdHash",
    });
  });

  it("Should be able to save several users and query them", () => {
    const count = 10;

    for (let i = 0; i < count; i++) {
      dao.users.saveUser({
        chatId: 978987987,
        userIdHash: `user${i}`,
      });
    }

    expect(dao.users.userCount()).toBe(BigInt(count));

    for (let i = 0; i < count; i++) {
      const user = dao.users.getUser(`user${i}`);

      expect(user).toMatchObject({
        chatId: 978987987,
        userIdHash: `user${i}`,
      });
    }
  });
});
