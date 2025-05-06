import { Address, Builder, Cell, Slice } from "@ton/core";

export type ParsedMessage =
  | AccountInitialisedEvent
  | ProfitReceivedEvent
  | AuctionCreatedEvent
  | AuctionResolvedEvent
  | AuctionOutbiddedEvent;

export const AccountInitialisedEventOpcode = "0x00acca00";
export const ProfitReceivedEventOpcode = "0x00acca01";
export const AuctionOutbiddedEventOpcode = "0x00aaaa01";
export const AuctionResolvedEventOpcode = "0x00aaaa02";
export const AuctionCreatedEventOpcode = "0x00aaaa03";

export const MESSAGE_PARSERS: { [key: string]: (s: Slice) => ParsedMessage } = {
  [AccountInitialisedEventOpcode]: loadAccountInitialisedEvent,
  [ProfitReceivedEventOpcode]: loadProfitReceivedEvent,
  [AuctionOutbiddedEventOpcode]: loadAuctionOutbiddedEvent,
  [AuctionResolvedEventOpcode]: loadAuctionResolvedEvent,
  [AuctionCreatedEventOpcode]: loadAuctionCreatedEvent,
};

export type AccountInitialisedEvent = {
  $$type: "AccountInitialisedEvent";
  address: Address;
  secret_id: Cell;
};

export function storeAccountInitialisedEvent(src: AccountInitialisedEvent) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(11323904, 32);
    b_0.storeAddress(src.address);
    b_0.storeRef(src.secret_id);
  };
}

export function loadAccountInitialisedEvent(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 11323904) {
    throw Error("Invalid prefix");
  }
  const _address = sc_0.loadAddress();
  const _secret_id = sc_0.loadRef();
  return {
    $$type: "AccountInitialisedEvent" as const,
    address: _address,
    secret_id: _secret_id,
  };
}

export type ProfitReceivedEvent = {
  $$type: "ProfitReceivedEvent";
  address: Address;
  amount: bigint;
  secret_id: Cell;
};

export function storeProfitReceivedEvent(src: ProfitReceivedEvent) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(11323905, 32);
    b_0.storeAddress(src.address);
    b_0.storeInt(src.amount, 257);
    b_0.storeRef(src.secret_id);
  };
}

export function loadProfitReceivedEvent(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 11323905) {
    throw Error("Invalid prefix");
  }
  const _address = sc_0.loadAddress();
  const _amount = sc_0.loadIntBig(257);
  const _secret_id = sc_0.loadRef();
  return {
    $$type: "ProfitReceivedEvent" as const,
    address: _address,
    amount: _amount,
    secret_id: _secret_id,
  };
}

export type AuctionOutbiddedEvent = {
  $$type: "AuctionOutbiddedEvent";
  address: Address;
  owner_secret_id: Cell;
  old_winner_secret_id: Cell;
  new_winner_secret_id: Cell;
  amount: bigint;
};

export function loadAuctionOutbiddedEvent(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 11184641) {
    throw Error("Invalid prefix");
  }
  const _address = sc_0.loadAddress();
  const _owner_secret_id = sc_0.loadRef();
  const _old_winner_secret_id = sc_0.loadRef();
  const _new_winner_secret_id = sc_0.loadRef();
  const _amount = sc_0.loadIntBig(257);
  return {
    $$type: "AuctionOutbiddedEvent" as const,
    address: _address,
    owner_secret_id: _owner_secret_id,
    old_winner_secret_id: _old_winner_secret_id,
    new_winner_secret_id: _new_winner_secret_id,
    amount: _amount,
  };
}

export function storeAuctionOutbiddedEvent(src: AuctionOutbiddedEvent) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(11184641, 32);
    b_0.storeAddress(src.address);
    b_0.storeRef(src.owner_secret_id);
    b_0.storeRef(src.old_winner_secret_id);
    b_0.storeRef(src.new_winner_secret_id);
    b_0.storeInt(src.amount, 257);
  };
}

export type AuctionResolvedEvent = {
  $$type: "AuctionResolvedEvent";
  address: Address;
  owner_secret_id: Cell;
  winner_secret_id: Cell | null;
};

export function loadAuctionResolvedEvent(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 11184642) {
    throw Error("Invalid prefix");
  }
  const _address = sc_0.loadAddress();
  const _owner_secret_id = sc_0.loadRef();
  const _winner_secret_id = sc_0.loadBit() ? sc_0.loadRef() : null;
  return {
    $$type: "AuctionResolvedEvent" as const,
    address: _address,
    owner_secret_id: _owner_secret_id,
    winner_secret_id: _winner_secret_id,
  };
}

export function storeAuctionResolvedEvent(src: AuctionResolvedEvent) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(11184642, 32);
    b_0.storeAddress(src.address);
    b_0.storeRef(src.owner_secret_id);
    if (src.winner_secret_id !== null && src.winner_secret_id !== undefined) {
      b_0.storeBit(true).storeRef(src.winner_secret_id);
    } else {
      b_0.storeBit(false);
    }
  };
}

export type AuctionCreatedEvent = {
  $$type: "AuctionCreatedEvent";
  name: string;
  address: Address;
  owner_secret_id: Cell;
  ends_at: bigint;
};

export function storeAuctionCreatedEvent(src: AuctionCreatedEvent) {
  return (builder: Builder) => {
    const b_0 = builder;
    b_0.storeUint(11184643, 32);
    b_0.storeStringRefTail(src.name);
    b_0.storeAddress(src.address);
    b_0.storeRef(src.owner_secret_id);
    b_0.storeInt(src.ends_at, 257);
  };
}

export function loadAuctionCreatedEvent(slice: Slice) {
  const sc_0 = slice;
  if (sc_0.loadUint(32) !== 11184643) {
    throw Error("Invalid prefix");
  }
  const _name = sc_0.loadStringRefTail();
  const _address = sc_0.loadAddress();
  const _owner_secret_id = sc_0.loadRef();
  const _ends_at = sc_0.loadIntBig(257);
  return {
    $$type: "AuctionCreatedEvent" as const,
    name: _name,
    address: _address,
    owner_secret_id: _owner_secret_id,
    ends_at: _ends_at,
  };
}
