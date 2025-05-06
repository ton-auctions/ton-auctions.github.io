import * as fs from "node:fs/promises";

import { Database } from "jsr:@db/sqlite@0.11";
import { exists } from "jsr:@std/fs/exists";

import { getMessagesDAO, MessageDAO } from "./messages.ts";
import { getUsersDao, UsersDAO } from "./users.ts";
import { getAuctionsDao, AuctionsDAO } from "./auctions.ts";
import { Mutex } from "../utils/mutex.ts";

// Better refactor as DDD
export interface DAO {
  messages: MessageDAO;
  users: UsersDAO;
  auctions: AuctionsDAO;
}

let migrationsApplied = false;
const migrationsLock = new Mutex();

export const getDAO = async (
  filename: string | undefined = Deno.env.get("DB_PATH"),
  dropFirst: boolean = false
) => {
  if (!filename) {
    console.log("DB is not specified");
    Deno.exit(1);
  }

  if (dropFirst) {
    const filesToRemove = [`${filename}`, `${filename}-shm`, `${filename}-wal`];

    for (const path of filesToRemove) {
      const pathExists = await exists(path);

      if (!pathExists) continue;

      await fs.rm(path);
    }
    migrationsApplied = false;
  }

  const db = new Database(filename, {
    int64: true,
  });
  db.exec("pragma journal_mode = WAL");
  db.exec("pragma foreign_keys = ON");

  const decoder = new TextDecoder();

  const files = (await fs.readdir("./migrations")).toSorted();

  const unlock = await migrationsLock.lock();
  try {
    if (!migrationsApplied) {
      for (const file of files) {
        const sql = decoder.decode(await fs.readFile(`./migrations/${file}`));
        db.transaction(() => db.exec(sql))();
      }

      migrationsApplied = true;
    }
  } finally {
    unlock();
  }

  return {
    messages: getMessagesDAO(db),
    users: getUsersDao(db),
    auctions: getAuctionsDao(db),
  } as DAO;
};
