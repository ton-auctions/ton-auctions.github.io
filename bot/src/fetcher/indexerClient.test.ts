import { describe, it } from "jsr:@std/testing/bdd";
import { MessageProvider, startReadingMessages } from "./process.ts";
import { NETWORKS } from "./networks.ts";
import { requestMessages } from "./indexerClient.ts";
import * as wrappers from "../processor/protocolWrappers.ts";
import { getDAO } from "../data/dao.ts";

describe("Indexer client smoke test", () => {
  it("Should just work", async () => {
    const storage = await getDAO("./db/testdb.sqlite", true);

    const messageProvider: MessageProvider = (opcode, last_seen_lt, network) =>
      requestMessages(opcode, last_seen_lt, network);

    const reader = startReadingMessages(
      NETWORKS.TESTNET,
      wrappers.AccountInitialisedEventOpcode,
      messageProvider,
      storage
    );
    await reader.next();
  });
});
