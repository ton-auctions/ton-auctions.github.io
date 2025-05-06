import { Database } from "jsr:@db/sqlite@0.11";
import { Address } from "@ton/core";

export interface Auction {
  name: string;
  addr: Address;
  userIdHash: string;
  endsAt: bigint;
  processed: boolean;
  deleted: boolean;
  won: boolean;
  winnerIdHash: string | null;
  awaitsMessage: boolean;
}

export interface AuctionsDAO {
  add: (
    user_id_hash: string,
    addr: Address,
    name: string,
    ends_at: bigint
  ) => number;

  get: (addr: Address) => Auction | undefined;

  getUserAuctions: (userIdHash: string) => Auction[];
  getWonAuctions: (userIdHash: string) => Auction[];
  markProcessed: (addr: Address) => number;
  markDeleted: (addr: Address) => number;

  addWinner: (addr: Address, id_hash: string) => number;
  getCount: () => number;
}

export const getAuctionsDao = (db: Database) => {
  const add = db.prepare(`
      INSERT INTO auctions 
        (user_id_hash, addr, name, ends_at, processed, deleted, won, winner_id_hash) 
      VALUES 
        (?, ?, ?, ?, 0, 0, 0, NULL)
  `);

  const get = db.prepare(`
      SELECT * FROM auctions WHERE addr = ?  
  `);

  const markProcessed = db.prepare(`
    UPDATE auctions 
    SET processed = 1
    WHERE addr = ?
  `);

  const markDeleted = db.prepare(`
    UPDATE auctions 
    SET deleted = 1, processed = 1
    WHERE addr = ?
  `);

  const addWinner = db.prepare(`
    UPDATE auctions 
    SET winner_id_hash = :id_hash, won = 1, processed = 1
    WHERE addr = :addr
  `);

  const count = db.prepare(`SELECT COUNT(1) as C FROM auctions`);

  const getUserAuctionsWithoutDeleted = db.prepare(`
    SELECT * FROM auctions WHERE user_id_hash = ? AND deleted = 0
  `);

  const getWonAuctions = db.prepare(`
    SELECT * FROM auctions WHERE winner_id_hash = ? AND winner_id_hash != NULL AND deleted = 0
  `);

  const mapToModel = (row: Record<string, unknown>) =>
    ({
      userIdHash: row["user_id_hash"],
      addr: Address.parse(row["addr"] as string),
      endsAt: BigInt(row["ends_at"] as string),
      processed: row["processed"] == 1,
      deleted: row["deleted"] == 1,
      won: row["won"] == 1,
      winnerIdHash: row["winner_id_hash"],
      name: row["name"],
    } as Auction);

  return {
    add: (userIdHash: string, addr: Address, name: string, endsAt: bigint) =>
      db.transaction(() => {
        return add.run(userIdHash, addr.toString(), name, endsAt);
      })(),
    get: (addr: Address) => {
      const rows = get.all(addr.toString());
      for (const row of rows) {
        return mapToModel(row);
      }
    },
    markProcessed: (addr: Address) =>
      db.transaction(() => markProcessed.run(addr.toString()))(),
    markDeleted: (addr: Address) =>
      db.transaction(() => markDeleted.run(addr.toString()))(),
    addWinner: (addr: Address, id_hash: string) =>
      db.transaction(() =>
        addWinner.run({
          id_hash: id_hash,
          addr: addr.toString(),
        })
      )(),
    getCount: () =>
      db.transaction(() => {
        return count.all()[0]["C"];
      })(),

    getUserAuctions: (userIdHash: string) => {
      const rows = getUserAuctionsWithoutDeleted.all(userIdHash);
      return rows.map(mapToModel);
    },
    getWonAuctions: (userIdHash: string) => {
      const rows = getWonAuctions.all(userIdHash);
      return rows.map(mapToModel);
    },
  } as AuctionsDAO;
};
