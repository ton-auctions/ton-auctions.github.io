import { Mutex } from "../utils/mutex.ts";
import { Network } from "./networks.ts";
import moment from "moment";

async function* apiKeyGenerator(network: Network) {
  let idx = 0;
  const keys = network.keys();
  const count = keys.length;
  while (true) {
    idx = idx % count;
    yield keys[idx];
    idx += 1;
  }
}

const _generatorCache: {
  [key: string]: [AsyncGenerator<string, void, unknown>, Mutex];
} = {};

async function nextKey(network: Network) {
  if (!_generatorCache[network.name]) {
    _generatorCache[network.name] = [apiKeyGenerator(network), new Mutex()];
  }
  const [generator, mutex] = _generatorCache[network.name];

  const unlock = await mutex.lock();
  try {
    return (await generator.next()).value!;
  } finally {
    unlock();
  }
}

export interface Message {
  hash: string;
  opcode: string;
  source: string; // TODO: for validation
  // destination?: string;
  // value?: unknown;
  // fwd_fee?: unknown;
  // ihr_fee?: unknown;
  created_lt: string;
  // created_at: unknown;
  // ihr_disabled?: boolean;
  // bounce?: boolean;
  // bounced?: boolean;
  // import_fee?: unknown;
  // out_msg_tx_hash: string;
  message_content: {
    // hash: string;
    body: string;
    // decoded: null;
  };
  // init_state?: unknown;
}

interface Response<T> {
  messages: T[];
  address_book: unknown;
  metadata: unknown;
}

export async function* requestMessages(
  opcode: string,
  after_lt: bigint,
  network: Network,
  timeoutBetweenApiCalls?: number
) {
  const params = new URLSearchParams();
  const timeout = timeoutBetweenApiCalls || 1000;

  let offset = 0;
  params.set("limit", "100");
  params.set("sort", "asc");
  params.set("start_lt", after_lt.toString());
  params.set("opcode", opcode);

  let lastCall = moment();
  while (true) {
    params.set("offset", `${offset}`);
    params.set("api_key", await nextKey(network));

    const diff = moment().diff(lastCall, "milliseconds");

    if (diff < timeout) {
      await new Promise((resolve) => setTimeout(resolve, timeout - diff));
    }

    const response = await fetch(
      `${network.toncenter}/api/v3/messages?${params}`
    );

    lastCall = moment();

    if (!response.ok) {
      // TODO: log
      console.log("Bad API response", response);
      continue;
    }

    let json;
    try {
      json = (await response.json()) as Response<Message>;
    } catch (e) {
      console.error("Can't parse JSON", e);

      continue;
    }

    if (json.messages.length == 0) {
      break;
    }

    offset += json.messages.length;

    for (const msg of json.messages) {
      yield msg;
    }
  }
}
