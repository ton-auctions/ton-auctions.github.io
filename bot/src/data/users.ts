import { Database } from "jsr:@db/sqlite@0.11";
import { Address } from "@ton/core";

export interface AccountModel {
  userIdHash: string;
  address: Address;
}

export interface UserModel {
  userIdHash: string;
  chatId: number;
}

export interface UsersDAO {
  getUsers: () => UserModel[];
  getUser: (userIdHash: string) => UserModel | undefined;
  saveUser: (user: UserModel) => number;
  saveAccount: (account: AccountModel) => number;
  getUserForAccount: (accountAddr: Address) => UserModel | undefined;
  userCount: () => number;
}

export const getUsersDao = (db: Database) => {
  const getUser = db.prepare(`
        SELECT user_id_hash, chat_id FROM users WHERE user_id_hash = :id
    `);

  const getUsers = db.prepare(`
        SELECT user_id_hash, chat_id FROM users 
    `);

  const saveUser = db.prepare(`
        INSERT INTO users (user_id_hash, chat_id) VALUES (:id, :chat_id) 
        ON CONFLICT (user_id_hash) DO
        UPDATE SET chat_id = :chat_id WHERE user_id_hash = :id
    `);

  const saveAccount = db.prepare(`
        INSERT OR IGNORE INTO accounts (user_id_hash, addr) 
        VALUES (:id, :addr)
    `);

  const getUserForAccount = db.prepare(`
      SELECT u.user_id_hash, u.chat_id 
      FROM 
        users as u, 
        accounts as a 
      WHERE 1 = 1
        AND u.user_id_hash = a.user_id_hash
        AND a.addr = ?
  `);

  const userCount = db.prepare(`
    SELECT COUNT(1) as C FROM users as u
  `);

  return {
    getUsers: () => {
      return getUsers.all().map(
        (v) =>
          ({
            userIdHash: v["user_id_hash"],
            chatId: Number.parseInt(v["chat_id"]),
          } as UserModel)
      );
    },
    getUser: (userIdHash: string) => {
      const rows = getUser.all({ id: userIdHash }).map(
        (v) =>
          ({
            userIdHash: v["user_id_hash"],
            chatId: Number.parseInt(v["chat_id"]),
          } as UserModel)
      );
      for (const row of rows) {
        return row;
      }
      return undefined;
    },

    saveUser: (user: UserModel) =>
      db.transaction(() =>
        saveUser.run({
          id: user.userIdHash,
          chat_id: user.chatId,
        })
      )(),
    saveAccount: (account: AccountModel) =>
      saveAccount.run({
        id: account.userIdHash,
        addr: account.address.toString(),
      }),
    getUserForAccount: (addr: Address) => {
      const rows = getUserForAccount.all(addr.toString());
      for (const row of rows) {
        return {
          chatId: Number.parseInt(row["chat_id"]),
          userIdHash: row["user_id_hash"],
        } as UserModel;
      }
      return undefined;
    },
    userCount: () => {
      const rows = userCount.all();
      return rows[0]["C"];
    },
  } as UsersDAO;
};
