import { Database } from "jsr:@db/sqlite@0.11";
import moment from "moment";
import { BotDescription } from "gramio";

export interface MessageModel {
  msgHash: string;
  network: string;
  opcode: string;
  createdLt: bigint;
  bodyRaw: string;
  reservedForSendingAt: number | null;
  notificationSentAt: number | null;
  reserveCount: number;
}

export interface MessageDAO {
  reserve: (msg_hash: string) => number;
  updateLastSeenLtForOpcode: (
    last_seen_lt: bigint,
    network_name: string,
    opcode: string
  ) => number;
  getLastSeenLtForOpcode: (network_name: string, opcode: string) => bigint;
  addMessage: (message: MessageModel) => number;
  getMessage: (msgHash: string) => MessageModel;
  getUnreservedMessageBatch: (
    network_name: string,
    size?: number
  ) => MessageModel[];
  getCount: () => number;
  registerOpcode: (network: string, opcode: string) => number;
  markNotificationSent: (msgHash: string) => number;
  opcodeExists: (network: string, opcode: string) => boolean;
}

export const getMessagesDAO = (db: Database) => {
  const opcodeExists = db.prepare(`
    SELECT 1 
    FROM ton_indexer
    WHERE 1=1
      AND network = ? 
      AND opcode = ? 
  `);

  const markNotifications = db.prepare(`
    UPDATE messages SET notification_sent_at = ? WHERE msg_hash = ?
  `);

  const registerOpcode = db.prepare(`
    INSERT INTO ton_indexer
      (network, opcode, last_seen_lt)
    VALUES
      (?, ?, 0)
  `);

  const updateLastSeenLtForOpcode = db.prepare(`
    UPDATE ton_indexer 
    SET last_seen_lt = ? 
    WHERE 1=1
      AND network = ? 
      AND opcode = ? 
      AND last_seen_lt < ?`);

  const getLastSeenLtForOpcode = db.prepare(`
    SELECT last_seen_lt 
    FROM ton_indexer 
    WHERE 1=1 
      AND network = ? 
      AND opcode = ?`);

  const saveMessage = db.prepare(`
    INSERT OR IGNORE INTO messages 
      (msg_hash, network, opcode, created_lt, body_raw, reserved_for_sending_at, notification_sent_at, reserve_count)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?)`);

  const getUnreservedMessageBatch = db.prepare(`
    SELECT 
      * 
    FROM messages 
    WHERE 1=1
      AND ? - COALESCE(reserved_for_sending_at, 0) > 900
      AND network = ?
      AND notification_sent_at IS NULL
      AND reserve_count < 10
    ORDER BY rowid ASC
    LIMIT ?`);

  const get = db.prepare(`SELECT * FROM messages WHERE msg_hash = ?`);

  const reserve = db.prepare(`
    UPDATE messages 
    SET reserved_for_sending_at = :now, reserve_count = reserve_count + 1
    WHERE 1=1
      AND :now - COALESCE(reserved_for_sending_at, 0) > 900
      AND msg_hash = :msg_hash
  `);

  const count = db.prepare(`
    SELECT COUNT(1) as C
    FROM messages
  `);

  return {
    reserve: (msg_hash: string) => {
      const now = moment().unix();
      reserve.run({ now: now, msg_hash: msg_hash });
    },

    addMessage: (message: MessageModel) =>
      db.transaction(() =>
        saveMessage.run(
          message.msgHash,
          message.network,
          message.opcode,
          message.createdLt,
          message.bodyRaw,
          message.reservedForSendingAt || null,
          message.notificationSentAt || null,
          message.reserveCount || 0
        )
      )(),

    updateLastSeenLtForOpcode: (
      last_seen_lt: bigint,
      network_name: string,
      opcode: string
    ) =>
      db.transaction(() => {
        return updateLastSeenLtForOpcode.run(
          last_seen_lt,
          network_name,
          opcode,
          last_seen_lt
        );
      })(),

    opcodeExists: (network_name: string, opcode: string) => {
      const rows = opcodeExists.all(network_name, opcode);
      return rows.length > 0;
    },

    getLastSeenLtForOpcode: (network_name: string, opcode: string) => {
      const rows = getLastSeenLtForOpcode.all(network_name, opcode);
      for (const row of rows) {
        return BigInt(row["last_seen_lt"]);
      }
      return 0;
    },

    getUnreservedMessageBatch: (network_name: string, size: number = 10) => {
      const unix = moment().unix();

      const rows = getUnreservedMessageBatch.all(unix, network_name, size).map(
        (v) =>
          ({
            bodyRaw: v["body_raw"],
            createdLt: v["created_lt"],
            network: v["network"],
            msgHash: v["msg_hash"],
            opcode: v["opcode"],
            notificationSentAt: v["notification_sent_at"],
            reservedForSendingAt: v["reserved_for_sending_at"],
            reserveCount: v["reserve_count"],
          } as MessageModel)
      );
      return rows;
    },

    getMessage: (msgHash: string) => {
      const rows = get.all(msgHash);
      return {
        bodyRaw: rows[0]["body_raw"],
        createdLt: rows[0]["created_lt"],
        network: rows[0]["network"],
        msgHash: rows[0]["msg_hash"],
        opcode: rows[0]["opcode"],
        notificationSentAt: rows[0]["notification_sent_at"],
        reservedForSendingAt: rows[0]["reserved_for_sending_at"],
        reserveCount: rows[0]["reserve_count"],
      } as MessageModel;
    },

    getCount: () => {
      const rows = count.all();
      return rows[0]["C"];
    },

    registerOpcode: (network: string, opcode: string) =>
      db.transaction(() => {
        return registerOpcode.run(network, opcode);
      })(),

    markNotificationSent: (msgHash: string) =>
      db.transaction(() => {
        return markNotifications.run(moment().unix(), msgHash);
      })(),
  } as MessageDAO;
};
