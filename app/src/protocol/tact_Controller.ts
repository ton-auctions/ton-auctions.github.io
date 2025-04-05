import { 
    Cell,
    Slice, 
    Address, 
    Builder, 
    beginCell, 
    ComputeError, 
    TupleItem, 
    TupleReader, 
    Dictionary, 
    contractAddress, 
    address, 
    ContractProvider, 
    Sender, 
    Contract, 
    ContractABI, 
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type DataSize = {
    $$type: 'DataSize';
    cells: bigint;
    bits: bigint;
    refs: bigint;
}

export function storeDataSize(src: DataSize) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.cells, 257);
        b_0.storeInt(src.bits, 257);
        b_0.storeInt(src.refs, 257);
    };
}

export function loadDataSize(slice: Slice) {
    const sc_0 = slice;
    const _cells = sc_0.loadIntBig(257);
    const _bits = sc_0.loadIntBig(257);
    const _refs = sc_0.loadIntBig(257);
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

function loadTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

function loadGetterTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

function storeTupleDataSize(source: DataSize) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.cells);
    builder.writeNumber(source.bits);
    builder.writeNumber(source.refs);
    return builder.build();
}

function dictValueParserDataSize(): DictionaryValue<DataSize> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDataSize(src)).endCell());
        },
        parse: (src) => {
            return loadDataSize(src.loadRef().beginParse());
        }
    }
}

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    const sc_0 = slice;
    const _code = sc_0.loadRef();
    const _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadGetterTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
    const builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounceable: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.bounceable);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    const sc_0 = slice;
    const _bounceable = sc_0.loadBit();
    const _sender = sc_0.loadAddress();
    const _value = sc_0.loadIntBig(257);
    const _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

function loadGetterTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.bounceable);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadSendParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

function loadTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

function loadGetterTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

function storeTupleSendParameters(source: SendParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type MessageParameters = {
    $$type: 'MessageParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeMessageParameters(src: MessageParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadMessageParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

function loadTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

function loadGetterTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

function storeTupleMessageParameters(source: MessageParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

function dictValueParserMessageParameters(): DictionaryValue<MessageParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMessageParameters(src)).endCell());
        },
        parse: (src) => {
            return loadMessageParameters(src.loadRef().beginParse());
        }
    }
}

export type DeployParameters = {
    $$type: 'DeployParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    bounce: boolean;
    init: StateInit;
}

export function storeDeployParameters(src: DeployParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeBit(src.bounce);
        b_0.store(storeStateInit(src.init));
    };
}

export function loadDeployParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _bounce = sc_0.loadBit();
    const _init = loadStateInit(sc_0);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

function loadTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

function loadGetterTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadGetterTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

function storeTupleDeployParameters(source: DeployParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeBoolean(source.bounce);
    builder.writeTuple(storeTupleStateInit(source.init));
    return builder.build();
}

function dictValueParserDeployParameters(): DictionaryValue<DeployParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployParameters(src)).endCell());
        },
        parse: (src) => {
            return loadDeployParameters(src.loadRef().beginParse());
        }
    }
}

export type StdAddress = {
    $$type: 'StdAddress';
    workchain: bigint;
    address: bigint;
}

export function storeStdAddress(src: StdAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(8);
    const _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function loadTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function loadGetterTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function storeTupleStdAddress(source: StdAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    }
}

export type VarAddress = {
    $$type: 'VarAddress';
    workchain: bigint;
    address: Slice;
}

export function storeVarAddress(src: VarAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(32);
    const _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function loadTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function loadGetterTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function storeTupleVarAddress(source: VarAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type BasechainAddress = {
    $$type: 'BasechainAddress';
    hash: bigint | null;
}

export function storeBasechainAddress(src: BasechainAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        if (src.hash !== null && src.hash !== undefined) { b_0.storeBit(true).storeInt(src.hash, 257); } else { b_0.storeBit(false); }
    };
}

export function loadBasechainAddress(slice: Slice) {
    const sc_0 = slice;
    const _hash = sc_0.loadBit() ? sc_0.loadIntBig(257) : null;
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

function loadTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

function loadGetterTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

function storeTupleBasechainAddress(source: BasechainAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.hash);
    return builder.build();
}

function dictValueParserBasechainAddress(): DictionaryValue<BasechainAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBasechainAddress(src)).endCell());
        },
        parse: (src) => {
            return loadBasechainAddress(src.loadRef().beginParse());
        }
    }
}

export type ChangeOwner = {
    $$type: 'ChangeOwner';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwner(src: ChangeOwner) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2174598809, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwner(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2174598809) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadTupleChangeOwner(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOwner = source.readAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadGetterTupleChangeOwner(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOwner = source.readAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function storeTupleChangeOwner(source: ChangeOwner) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

function dictValueParserChangeOwner(): DictionaryValue<ChangeOwner> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeChangeOwner(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwner(src.loadRef().beginParse());
        }
    }
}

export type ChangeOwnerOk = {
    $$type: 'ChangeOwnerOk';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwnerOk(src: ChangeOwnerOk) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(846932810, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwnerOk(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 846932810) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadTupleChangeOwnerOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOwner = source.readAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadGetterTupleChangeOwnerOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOwner = source.readAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

function storeTupleChangeOwnerOk(source: ChangeOwnerOk) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

function dictValueParserChangeOwnerOk(): DictionaryValue<ChangeOwnerOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeChangeOwnerOk(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwnerOk(src.loadRef().beginParse());
        }
    }
}

export type AuctionMeta = {
    $$type: 'AuctionMeta';
    id: bigint;
    name: string;
    description: string;
    address: Address;
    type: string;
    ended: boolean;
    refund: boolean;
}

export function storeAuctionMeta(src: AuctionMeta) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.id, 257);
        b_0.storeStringRefTail(src.name);
        b_0.storeStringRefTail(src.description);
        b_0.storeAddress(src.address);
        b_0.storeStringRefTail(src.type);
        b_0.storeBit(src.ended);
        b_0.storeBit(src.refund);
    };
}

export function loadAuctionMeta(slice: Slice) {
    const sc_0 = slice;
    const _id = sc_0.loadIntBig(257);
    const _name = sc_0.loadStringRefTail();
    const _description = sc_0.loadStringRefTail();
    const _address = sc_0.loadAddress();
    const _type = sc_0.loadStringRefTail();
    const _ended = sc_0.loadBit();
    const _refund = sc_0.loadBit();
    return { $$type: 'AuctionMeta' as const, id: _id, name: _name, description: _description, address: _address, type: _type, ended: _ended, refund: _refund };
}

function loadTupleAuctionMeta(source: TupleReader) {
    const _id = source.readBigNumber();
    const _name = source.readString();
    const _description = source.readString();
    const _address = source.readAddress();
    const _type = source.readString();
    const _ended = source.readBoolean();
    const _refund = source.readBoolean();
    return { $$type: 'AuctionMeta' as const, id: _id, name: _name, description: _description, address: _address, type: _type, ended: _ended, refund: _refund };
}

function loadGetterTupleAuctionMeta(source: TupleReader) {
    const _id = source.readBigNumber();
    const _name = source.readString();
    const _description = source.readString();
    const _address = source.readAddress();
    const _type = source.readString();
    const _ended = source.readBoolean();
    const _refund = source.readBoolean();
    return { $$type: 'AuctionMeta' as const, id: _id, name: _name, description: _description, address: _address, type: _type, ended: _ended, refund: _refund };
}

function storeTupleAuctionMeta(source: AuctionMeta) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.id);
    builder.writeString(source.name);
    builder.writeString(source.description);
    builder.writeAddress(source.address);
    builder.writeString(source.type);
    builder.writeBoolean(source.ended);
    builder.writeBoolean(source.refund);
    return builder.build();
}

function dictValueParserAuctionMeta(): DictionaryValue<AuctionMeta> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAuctionMeta(src)).endCell());
        },
        parse: (src) => {
            return loadAuctionMeta(src.loadRef().beginParse());
        }
    }
}

export type Profit = {
    $$type: 'Profit';
    id: bigint;
    amount: bigint;
}

export function storeProfit(src: Profit) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2850970253, 32);
        b_0.storeInt(src.id, 257);
        b_0.storeUint(src.amount, 128);
    };
}

export function loadProfit(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2850970253) { throw Error('Invalid prefix'); }
    const _id = sc_0.loadIntBig(257);
    const _amount = sc_0.loadUintBig(128);
    return { $$type: 'Profit' as const, id: _id, amount: _amount };
}

function loadTupleProfit(source: TupleReader) {
    const _id = source.readBigNumber();
    const _amount = source.readBigNumber();
    return { $$type: 'Profit' as const, id: _id, amount: _amount };
}

function loadGetterTupleProfit(source: TupleReader) {
    const _id = source.readBigNumber();
    const _amount = source.readBigNumber();
    return { $$type: 'Profit' as const, id: _id, amount: _amount };
}

function storeTupleProfit(source: Profit) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.id);
    builder.writeNumber(source.amount);
    return builder.build();
}

function dictValueParserProfit(): DictionaryValue<Profit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeProfit(src)).endCell());
        },
        parse: (src) => {
            return loadProfit(src.loadRef().beginParse());
        }
    }
}

export type Collect = {
    $$type: 'Collect';
    amount: bigint;
}

export function storeCollect(src: Collect) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1321421870, 32);
        b_0.storeUint(src.amount, 128);
    };
}

export function loadCollect(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1321421870) { throw Error('Invalid prefix'); }
    const _amount = sc_0.loadUintBig(128);
    return { $$type: 'Collect' as const, amount: _amount };
}

function loadTupleCollect(source: TupleReader) {
    const _amount = source.readBigNumber();
    return { $$type: 'Collect' as const, amount: _amount };
}

function loadGetterTupleCollect(source: TupleReader) {
    const _amount = source.readBigNumber();
    return { $$type: 'Collect' as const, amount: _amount };
}

function storeTupleCollect(source: Collect) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    return builder.build();
}

function dictValueParserCollect(): DictionaryValue<Collect> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCollect(src)).endCell());
        },
        parse: (src) => {
            return loadCollect(src.loadRef().beginParse());
        }
    }
}

export type AuctionDeleted = {
    $$type: 'AuctionDeleted';
    id: bigint;
    refund: boolean;
}

export function storeAuctionDeleted(src: AuctionDeleted) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(533462982, 32);
        b_0.storeUint(src.id, 64);
        b_0.storeBit(src.refund);
    };
}

export function loadAuctionDeleted(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 533462982) { throw Error('Invalid prefix'); }
    const _id = sc_0.loadUintBig(64);
    const _refund = sc_0.loadBit();
    return { $$type: 'AuctionDeleted' as const, id: _id, refund: _refund };
}

function loadTupleAuctionDeleted(source: TupleReader) {
    const _id = source.readBigNumber();
    const _refund = source.readBoolean();
    return { $$type: 'AuctionDeleted' as const, id: _id, refund: _refund };
}

function loadGetterTupleAuctionDeleted(source: TupleReader) {
    const _id = source.readBigNumber();
    const _refund = source.readBoolean();
    return { $$type: 'AuctionDeleted' as const, id: _id, refund: _refund };
}

function storeTupleAuctionDeleted(source: AuctionDeleted) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.id);
    builder.writeBoolean(source.refund);
    return builder.build();
}

function dictValueParserAuctionDeleted(): DictionaryValue<AuctionDeleted> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAuctionDeleted(src)).endCell());
        },
        parse: (src) => {
            return loadAuctionDeleted(src.loadRef().beginParse());
        }
    }
}

export type AccountDelete = {
    $$type: 'AccountDelete';
}

export function storeAccountDelete(src: AccountDelete) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1792346535, 32);
    };
}

export function loadAccountDelete(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1792346535) { throw Error('Invalid prefix'); }
    return { $$type: 'AccountDelete' as const };
}

function loadTupleAccountDelete(source: TupleReader) {
    return { $$type: 'AccountDelete' as const };
}

function loadGetterTupleAccountDelete(source: TupleReader) {
    return { $$type: 'AccountDelete' as const };
}

function storeTupleAccountDelete(source: AccountDelete) {
    const builder = new TupleBuilder();
    return builder.build();
}

function dictValueParserAccountDelete(): DictionaryValue<AccountDelete> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAccountDelete(src)).endCell());
        },
        parse: (src) => {
            return loadAccountDelete(src.loadRef().beginParse());
        }
    }
}

export type AccountInitialisation = {
    $$type: 'AccountInitialisation';
    chat_id: bigint;
    referree: Address | null;
    service_comission: bigint;
    referral_comission: bigint;
    max_allowance: bigint;
}

export function storeAccountInitialisation(src: AccountInitialisation) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(src.chat_id, 64);
        b_0.storeAddress(src.referree);
        b_0.storeUint(src.service_comission, 16);
        b_0.storeUint(src.referral_comission, 16);
        b_0.storeUint(src.max_allowance, 16);
    };
}

export function loadAccountInitialisation(slice: Slice) {
    const sc_0 = slice;
    const _chat_id = sc_0.loadUintBig(64);
    const _referree = sc_0.loadMaybeAddress();
    const _service_comission = sc_0.loadUintBig(16);
    const _referral_comission = sc_0.loadUintBig(16);
    const _max_allowance = sc_0.loadUintBig(16);
    return { $$type: 'AccountInitialisation' as const, chat_id: _chat_id, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, max_allowance: _max_allowance };
}

function loadTupleAccountInitialisation(source: TupleReader) {
    const _chat_id = source.readBigNumber();
    const _referree = source.readAddressOpt();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _max_allowance = source.readBigNumber();
    return { $$type: 'AccountInitialisation' as const, chat_id: _chat_id, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, max_allowance: _max_allowance };
}

function loadGetterTupleAccountInitialisation(source: TupleReader) {
    const _chat_id = source.readBigNumber();
    const _referree = source.readAddressOpt();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _max_allowance = source.readBigNumber();
    return { $$type: 'AccountInitialisation' as const, chat_id: _chat_id, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, max_allowance: _max_allowance };
}

function storeTupleAccountInitialisation(source: AccountInitialisation) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.chat_id);
    builder.writeAddress(source.referree);
    builder.writeNumber(source.service_comission);
    builder.writeNumber(source.referral_comission);
    builder.writeNumber(source.max_allowance);
    return builder.build();
}

function dictValueParserAccountInitialisation(): DictionaryValue<AccountInitialisation> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAccountInitialisation(src)).endCell());
        },
        parse: (src) => {
            return loadAccountInitialisation(src.loadRef().beginParse());
        }
    }
}

export type Initialize = {
    $$type: 'Initialize';
    chat_id: bigint;
    referree: Address | null;
    service_comission: bigint;
    referral_comission: bigint;
    max_allowance: bigint;
}

export function storeInitialize(src: Initialize) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2208443317, 32);
        b_0.storeUint(src.chat_id, 64);
        b_0.storeAddress(src.referree);
        b_0.storeUint(src.service_comission, 16);
        b_0.storeUint(src.referral_comission, 16);
        b_0.storeUint(src.max_allowance, 16);
    };
}

export function loadInitialize(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2208443317) { throw Error('Invalid prefix'); }
    const _chat_id = sc_0.loadUintBig(64);
    const _referree = sc_0.loadMaybeAddress();
    const _service_comission = sc_0.loadUintBig(16);
    const _referral_comission = sc_0.loadUintBig(16);
    const _max_allowance = sc_0.loadUintBig(16);
    return { $$type: 'Initialize' as const, chat_id: _chat_id, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, max_allowance: _max_allowance };
}

function loadTupleInitialize(source: TupleReader) {
    const _chat_id = source.readBigNumber();
    const _referree = source.readAddressOpt();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _max_allowance = source.readBigNumber();
    return { $$type: 'Initialize' as const, chat_id: _chat_id, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, max_allowance: _max_allowance };
}

function loadGetterTupleInitialize(source: TupleReader) {
    const _chat_id = source.readBigNumber();
    const _referree = source.readAddressOpt();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _max_allowance = source.readBigNumber();
    return { $$type: 'Initialize' as const, chat_id: _chat_id, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, max_allowance: _max_allowance };
}

function storeTupleInitialize(source: Initialize) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.chat_id);
    builder.writeAddress(source.referree);
    builder.writeNumber(source.service_comission);
    builder.writeNumber(source.referral_comission);
    builder.writeNumber(source.max_allowance);
    return builder.build();
}

function dictValueParserInitialize(): DictionaryValue<Initialize> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeInitialize(src)).endCell());
        },
        parse: (src) => {
            return loadInitialize(src.loadRef().beginParse());
        }
    }
}

export type ReferralCommission = {
    $$type: 'ReferralCommission';
}

export function storeReferralCommission(src: ReferralCommission) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3733998990, 32);
    };
}

export function loadReferralCommission(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3733998990) { throw Error('Invalid prefix'); }
    return { $$type: 'ReferralCommission' as const };
}

function loadTupleReferralCommission(source: TupleReader) {
    return { $$type: 'ReferralCommission' as const };
}

function loadGetterTupleReferralCommission(source: TupleReader) {
    return { $$type: 'ReferralCommission' as const };
}

function storeTupleReferralCommission(source: ReferralCommission) {
    const builder = new TupleBuilder();
    return builder.build();
}

function dictValueParserReferralCommission(): DictionaryValue<ReferralCommission> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeReferralCommission(src)).endCell());
        },
        parse: (src) => {
            return loadReferralCommission(src.loadRef().beginParse());
        }
    }
}

export type CreateBasicAuction = {
    $$type: 'CreateBasicAuction';
    id: bigint;
    name: string;
    description: string;
    minimalAmount: bigint;
    endsAt: bigint;
}

export function storeCreateBasicAuction(src: CreateBasicAuction) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3890680962, 32);
        b_0.storeUint(src.id, 64);
        b_0.storeStringRefTail(src.name);
        b_0.storeStringRefTail(src.description);
        b_0.storeInt(src.minimalAmount, 257);
        b_0.storeUint(src.endsAt, 64);
    };
}

export function loadCreateBasicAuction(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3890680962) { throw Error('Invalid prefix'); }
    const _id = sc_0.loadUintBig(64);
    const _name = sc_0.loadStringRefTail();
    const _description = sc_0.loadStringRefTail();
    const _minimalAmount = sc_0.loadIntBig(257);
    const _endsAt = sc_0.loadUintBig(64);
    return { $$type: 'CreateBasicAuction' as const, id: _id, name: _name, description: _description, minimalAmount: _minimalAmount, endsAt: _endsAt };
}

function loadTupleCreateBasicAuction(source: TupleReader) {
    const _id = source.readBigNumber();
    const _name = source.readString();
    const _description = source.readString();
    const _minimalAmount = source.readBigNumber();
    const _endsAt = source.readBigNumber();
    return { $$type: 'CreateBasicAuction' as const, id: _id, name: _name, description: _description, minimalAmount: _minimalAmount, endsAt: _endsAt };
}

function loadGetterTupleCreateBasicAuction(source: TupleReader) {
    const _id = source.readBigNumber();
    const _name = source.readString();
    const _description = source.readString();
    const _minimalAmount = source.readBigNumber();
    const _endsAt = source.readBigNumber();
    return { $$type: 'CreateBasicAuction' as const, id: _id, name: _name, description: _description, minimalAmount: _minimalAmount, endsAt: _endsAt };
}

function storeTupleCreateBasicAuction(source: CreateBasicAuction) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.id);
    builder.writeString(source.name);
    builder.writeString(source.description);
    builder.writeNumber(source.minimalAmount);
    builder.writeNumber(source.endsAt);
    return builder.build();
}

function dictValueParserCreateBasicAuction(): DictionaryValue<CreateBasicAuction> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCreateBasicAuction(src)).endCell());
        },
        parse: (src) => {
            return loadCreateBasicAuction(src.loadRef().beginParse());
        }
    }
}

export type CleanUp = {
    $$type: 'CleanUp';
}

export function storeCleanUp(src: CleanUp) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2848052031, 32);
    };
}

export function loadCleanUp(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2848052031) { throw Error('Invalid prefix'); }
    return { $$type: 'CleanUp' as const };
}

function loadTupleCleanUp(source: TupleReader) {
    return { $$type: 'CleanUp' as const };
}

function loadGetterTupleCleanUp(source: TupleReader) {
    return { $$type: 'CleanUp' as const };
}

function storeTupleCleanUp(source: CleanUp) {
    const builder = new TupleBuilder();
    return builder.build();
}

function dictValueParserCleanUp(): DictionaryValue<CleanUp> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCleanUp(src)).endCell());
        },
        parse: (src) => {
            return loadCleanUp(src.loadRef().beginParse());
        }
    }
}

export type AccountData = {
    $$type: 'AccountData';
    initialised: boolean;
    version: bigint;
    owner: Address;
    service_comission: bigint;
    referral_comission: bigint;
    max_allowance: bigint;
    allowance: bigint;
    balance: bigint;
    auctions: Dictionary<bigint, AuctionMeta>;
    chat_id: bigint;
    referree: Address | null;
}

export function storeAccountData(src: AccountData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.initialised);
        b_0.storeInt(src.version, 257);
        b_0.storeAddress(src.owner);
        b_0.storeUint(src.service_comission, 16);
        b_0.storeUint(src.referral_comission, 16);
        b_0.storeInt(src.max_allowance, 257);
        const b_1 = new Builder();
        b_1.storeInt(src.allowance, 257);
        b_1.storeInt(src.balance, 257);
        b_1.storeDict(src.auctions, Dictionary.Keys.BigInt(257), dictValueParserAuctionMeta());
        b_1.storeInt(src.chat_id, 257);
        const b_2 = new Builder();
        b_2.storeAddress(src.referree);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadAccountData(slice: Slice) {
    const sc_0 = slice;
    const _initialised = sc_0.loadBit();
    const _version = sc_0.loadIntBig(257);
    const _owner = sc_0.loadAddress();
    const _service_comission = sc_0.loadUintBig(16);
    const _referral_comission = sc_0.loadUintBig(16);
    const _max_allowance = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _allowance = sc_1.loadIntBig(257);
    const _balance = sc_1.loadIntBig(257);
    const _auctions = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserAuctionMeta(), sc_1);
    const _chat_id = sc_1.loadIntBig(257);
    const sc_2 = sc_1.loadRef().beginParse();
    const _referree = sc_2.loadMaybeAddress();
    return { $$type: 'AccountData' as const, initialised: _initialised, version: _version, owner: _owner, service_comission: _service_comission, referral_comission: _referral_comission, max_allowance: _max_allowance, allowance: _allowance, balance: _balance, auctions: _auctions, chat_id: _chat_id, referree: _referree };
}

function loadTupleAccountData(source: TupleReader) {
    const _initialised = source.readBoolean();
    const _version = source.readBigNumber();
    const _owner = source.readAddress();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _max_allowance = source.readBigNumber();
    const _allowance = source.readBigNumber();
    const _balance = source.readBigNumber();
    const _auctions = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserAuctionMeta(), source.readCellOpt());
    const _chat_id = source.readBigNumber();
    const _referree = source.readAddressOpt();
    return { $$type: 'AccountData' as const, initialised: _initialised, version: _version, owner: _owner, service_comission: _service_comission, referral_comission: _referral_comission, max_allowance: _max_allowance, allowance: _allowance, balance: _balance, auctions: _auctions, chat_id: _chat_id, referree: _referree };
}

function loadGetterTupleAccountData(source: TupleReader) {
    const _initialised = source.readBoolean();
    const _version = source.readBigNumber();
    const _owner = source.readAddress();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _max_allowance = source.readBigNumber();
    const _allowance = source.readBigNumber();
    const _balance = source.readBigNumber();
    const _auctions = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserAuctionMeta(), source.readCellOpt());
    const _chat_id = source.readBigNumber();
    const _referree = source.readAddressOpt();
    return { $$type: 'AccountData' as const, initialised: _initialised, version: _version, owner: _owner, service_comission: _service_comission, referral_comission: _referral_comission, max_allowance: _max_allowance, allowance: _allowance, balance: _balance, auctions: _auctions, chat_id: _chat_id, referree: _referree };
}

function storeTupleAccountData(source: AccountData) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.initialised);
    builder.writeNumber(source.version);
    builder.writeAddress(source.owner);
    builder.writeNumber(source.service_comission);
    builder.writeNumber(source.referral_comission);
    builder.writeNumber(source.max_allowance);
    builder.writeNumber(source.allowance);
    builder.writeNumber(source.balance);
    builder.writeCell(source.auctions.size > 0 ? beginCell().storeDictDirect(source.auctions, Dictionary.Keys.BigInt(257), dictValueParserAuctionMeta()).endCell() : null);
    builder.writeNumber(source.chat_id);
    builder.writeAddress(source.referree);
    return builder.build();
}

function dictValueParserAccountData(): DictionaryValue<AccountData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAccountData(src)).endCell());
        },
        parse: (src) => {
            return loadAccountData(src.loadRef().beginParse());
        }
    }
}

export type Account$Data = {
    $$type: 'Account$Data';
    collector: Address;
    owner: Address;
    referree: Address | null;
    service_comission: bigint;
    referral_comission: bigint;
    chat_id: bigint;
    auctions: Dictionary<bigint, AuctionMeta>;
    max_allowance: bigint;
    allowance: bigint;
    initialised: boolean;
}

export function storeAccount$Data(src: Account$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.collector);
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.referree);
        b_0.storeUint(src.service_comission, 16);
        b_0.storeUint(src.referral_comission, 16);
        const b_1 = new Builder();
        b_1.storeInt(src.chat_id, 257);
        b_1.storeDict(src.auctions, Dictionary.Keys.BigInt(257), dictValueParserAuctionMeta());
        b_1.storeInt(src.max_allowance, 257);
        b_1.storeInt(src.allowance, 257);
        b_1.storeBit(src.initialised);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadAccount$Data(slice: Slice) {
    const sc_0 = slice;
    const _collector = sc_0.loadAddress();
    const _owner = sc_0.loadAddress();
    const _referree = sc_0.loadMaybeAddress();
    const _service_comission = sc_0.loadUintBig(16);
    const _referral_comission = sc_0.loadUintBig(16);
    const sc_1 = sc_0.loadRef().beginParse();
    const _chat_id = sc_1.loadIntBig(257);
    const _auctions = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserAuctionMeta(), sc_1);
    const _max_allowance = sc_1.loadIntBig(257);
    const _allowance = sc_1.loadIntBig(257);
    const _initialised = sc_1.loadBit();
    return { $$type: 'Account$Data' as const, collector: _collector, owner: _owner, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, chat_id: _chat_id, auctions: _auctions, max_allowance: _max_allowance, allowance: _allowance, initialised: _initialised };
}

function loadTupleAccount$Data(source: TupleReader) {
    const _collector = source.readAddress();
    const _owner = source.readAddress();
    const _referree = source.readAddressOpt();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _chat_id = source.readBigNumber();
    const _auctions = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserAuctionMeta(), source.readCellOpt());
    const _max_allowance = source.readBigNumber();
    const _allowance = source.readBigNumber();
    const _initialised = source.readBoolean();
    return { $$type: 'Account$Data' as const, collector: _collector, owner: _owner, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, chat_id: _chat_id, auctions: _auctions, max_allowance: _max_allowance, allowance: _allowance, initialised: _initialised };
}

function loadGetterTupleAccount$Data(source: TupleReader) {
    const _collector = source.readAddress();
    const _owner = source.readAddress();
    const _referree = source.readAddressOpt();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _chat_id = source.readBigNumber();
    const _auctions = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserAuctionMeta(), source.readCellOpt());
    const _max_allowance = source.readBigNumber();
    const _allowance = source.readBigNumber();
    const _initialised = source.readBoolean();
    return { $$type: 'Account$Data' as const, collector: _collector, owner: _owner, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, chat_id: _chat_id, auctions: _auctions, max_allowance: _max_allowance, allowance: _allowance, initialised: _initialised };
}

function storeTupleAccount$Data(source: Account$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.collector);
    builder.writeAddress(source.owner);
    builder.writeAddress(source.referree);
    builder.writeNumber(source.service_comission);
    builder.writeNumber(source.referral_comission);
    builder.writeNumber(source.chat_id);
    builder.writeCell(source.auctions.size > 0 ? beginCell().storeDictDirect(source.auctions, Dictionary.Keys.BigInt(257), dictValueParserAuctionMeta()).endCell() : null);
    builder.writeNumber(source.max_allowance);
    builder.writeNumber(source.allowance);
    builder.writeBoolean(source.initialised);
    return builder.build();
}

function dictValueParserAccount$Data(): DictionaryValue<Account$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAccount$Data(src)).endCell());
        },
        parse: (src) => {
            return loadAccount$Data(src.loadRef().beginParse());
        }
    }
}

export type Bid = {
    $$type: 'Bid';
    chat_id: bigint;
}

export function storeBid(src: Bid) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(509079518, 32);
        b_0.storeInt(src.chat_id, 257);
    };
}

export function loadBid(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 509079518) { throw Error('Invalid prefix'); }
    const _chat_id = sc_0.loadIntBig(257);
    return { $$type: 'Bid' as const, chat_id: _chat_id };
}

function loadTupleBid(source: TupleReader) {
    const _chat_id = source.readBigNumber();
    return { $$type: 'Bid' as const, chat_id: _chat_id };
}

function loadGetterTupleBid(source: TupleReader) {
    const _chat_id = source.readBigNumber();
    return { $$type: 'Bid' as const, chat_id: _chat_id };
}

function storeTupleBid(source: Bid) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.chat_id);
    return builder.build();
}

function dictValueParserBid(): DictionaryValue<Bid> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBid(src)).endCell());
        },
        parse: (src) => {
            return loadBid(src.loadRef().beginParse());
        }
    }
}

export type Winner = {
    $$type: 'Winner';
    address: Address;
    amount: bigint;
    chat_id: bigint;
}

export function storeWinner(src: Winner) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.address);
        b_0.storeUint(src.amount, 128);
        b_0.storeInt(src.chat_id, 64);
    };
}

export function loadWinner(slice: Slice) {
    const sc_0 = slice;
    const _address = sc_0.loadAddress();
    const _amount = sc_0.loadUintBig(128);
    const _chat_id = sc_0.loadIntBig(64);
    return { $$type: 'Winner' as const, address: _address, amount: _amount, chat_id: _chat_id };
}

function loadTupleWinner(source: TupleReader) {
    const _address = source.readAddress();
    const _amount = source.readBigNumber();
    const _chat_id = source.readBigNumber();
    return { $$type: 'Winner' as const, address: _address, amount: _amount, chat_id: _chat_id };
}

function loadGetterTupleWinner(source: TupleReader) {
    const _address = source.readAddress();
    const _amount = source.readBigNumber();
    const _chat_id = source.readBigNumber();
    return { $$type: 'Winner' as const, address: _address, amount: _amount, chat_id: _chat_id };
}

function storeTupleWinner(source: Winner) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.address);
    builder.writeNumber(source.amount);
    builder.writeNumber(source.chat_id);
    return builder.build();
}

function dictValueParserWinner(): DictionaryValue<Winner> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeWinner(src)).endCell());
        },
        parse: (src) => {
            return loadWinner(src.loadRef().beginParse());
        }
    }
}

export type AuctionData = {
    $$type: 'AuctionData';
    id: bigint;
    owner_account: Address;
    minimal_amount: bigint;
    ends_at: bigint;
    winner: Winner | null;
    ended: boolean;
}

export function storeAuctionData(src: AuctionData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(src.id, 64);
        b_0.storeAddress(src.owner_account);
        b_0.storeUint(src.minimal_amount, 128);
        b_0.storeUint(src.ends_at, 64);
        if (src.winner !== null && src.winner !== undefined) { b_0.storeBit(true); b_0.store(storeWinner(src.winner)); } else { b_0.storeBit(false); }
        b_0.storeBit(src.ended);
    };
}

export function loadAuctionData(slice: Slice) {
    const sc_0 = slice;
    const _id = sc_0.loadUintBig(64);
    const _owner_account = sc_0.loadAddress();
    const _minimal_amount = sc_0.loadUintBig(128);
    const _ends_at = sc_0.loadUintBig(64);
    const _winner = sc_0.loadBit() ? loadWinner(sc_0) : null;
    const _ended = sc_0.loadBit();
    return { $$type: 'AuctionData' as const, id: _id, owner_account: _owner_account, minimal_amount: _minimal_amount, ends_at: _ends_at, winner: _winner, ended: _ended };
}

function loadTupleAuctionData(source: TupleReader) {
    const _id = source.readBigNumber();
    const _owner_account = source.readAddress();
    const _minimal_amount = source.readBigNumber();
    const _ends_at = source.readBigNumber();
    const _winner_p = source.readTupleOpt();
    const _winner = _winner_p ? loadTupleWinner(_winner_p) : null;
    const _ended = source.readBoolean();
    return { $$type: 'AuctionData' as const, id: _id, owner_account: _owner_account, minimal_amount: _minimal_amount, ends_at: _ends_at, winner: _winner, ended: _ended };
}

function loadGetterTupleAuctionData(source: TupleReader) {
    const _id = source.readBigNumber();
    const _owner_account = source.readAddress();
    const _minimal_amount = source.readBigNumber();
    const _ends_at = source.readBigNumber();
    const _winner_p = source.readTupleOpt();
    const _winner = _winner_p ? loadTupleWinner(_winner_p) : null;
    const _ended = source.readBoolean();
    return { $$type: 'AuctionData' as const, id: _id, owner_account: _owner_account, minimal_amount: _minimal_amount, ends_at: _ends_at, winner: _winner, ended: _ended };
}

function storeTupleAuctionData(source: AuctionData) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.id);
    builder.writeAddress(source.owner_account);
    builder.writeNumber(source.minimal_amount);
    builder.writeNumber(source.ends_at);
    if (source.winner !== null && source.winner !== undefined) {
        builder.writeTuple(storeTupleWinner(source.winner));
    } else {
        builder.writeTuple(null);
    }
    builder.writeBoolean(source.ended);
    return builder.build();
}

function dictValueParserAuctionData(): DictionaryValue<AuctionData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAuctionData(src)).endCell());
        },
        parse: (src) => {
            return loadAuctionData(src.loadRef().beginParse());
        }
    }
}

export type Resolve = {
    $$type: 'Resolve';
}

export function storeResolve(src: Resolve) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3964878528, 32);
    };
}

export function loadResolve(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3964878528) { throw Error('Invalid prefix'); }
    return { $$type: 'Resolve' as const };
}

function loadTupleResolve(source: TupleReader) {
    return { $$type: 'Resolve' as const };
}

function loadGetterTupleResolve(source: TupleReader) {
    return { $$type: 'Resolve' as const };
}

function storeTupleResolve(source: Resolve) {
    const builder = new TupleBuilder();
    return builder.build();
}

function dictValueParserResolve(): DictionaryValue<Resolve> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeResolve(src)).endCell());
        },
        parse: (src) => {
            return loadResolve(src.loadRef().beginParse());
        }
    }
}

export type Delete = {
    $$type: 'Delete';
}

export function storeDelete(src: Delete) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(373953009, 32);
    };
}

export function loadDelete(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 373953009) { throw Error('Invalid prefix'); }
    return { $$type: 'Delete' as const };
}

function loadTupleDelete(source: TupleReader) {
    return { $$type: 'Delete' as const };
}

function loadGetterTupleDelete(source: TupleReader) {
    return { $$type: 'Delete' as const };
}

function storeTupleDelete(source: Delete) {
    const builder = new TupleBuilder();
    return builder.build();
}

function dictValueParserDelete(): DictionaryValue<Delete> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDelete(src)).endCell());
        },
        parse: (src) => {
            return loadDelete(src.loadRef().beginParse());
        }
    }
}

export type BasicAuction$Data = {
    $$type: 'BasicAuction$Data';
    id: bigint;
    owner: Address;
    owner_account: Address;
    collector: Address;
    minimal_amount: bigint;
    ends_at: bigint;
    owner_chat_id: bigint;
    winner: Winner | null;
    ended: boolean;
}

export function storeBasicAuction$Data(src: BasicAuction$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(src.id, 64);
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.owner_account);
        b_0.storeAddress(src.collector);
        b_0.storeUint(src.minimal_amount, 128);
        const b_1 = new Builder();
        b_1.storeUint(src.ends_at, 64);
        b_1.storeInt(src.owner_chat_id, 257);
        if (src.winner !== null && src.winner !== undefined) { b_1.storeBit(true); b_1.store(storeWinner(src.winner)); } else { b_1.storeBit(false); }
        b_1.storeBit(src.ended);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadBasicAuction$Data(slice: Slice) {
    const sc_0 = slice;
    const _id = sc_0.loadUintBig(64);
    const _owner = sc_0.loadAddress();
    const _owner_account = sc_0.loadAddress();
    const _collector = sc_0.loadAddress();
    const _minimal_amount = sc_0.loadUintBig(128);
    const sc_1 = sc_0.loadRef().beginParse();
    const _ends_at = sc_1.loadUintBig(64);
    const _owner_chat_id = sc_1.loadIntBig(257);
    const _winner = sc_1.loadBit() ? loadWinner(sc_1) : null;
    const _ended = sc_1.loadBit();
    return { $$type: 'BasicAuction$Data' as const, id: _id, owner: _owner, owner_account: _owner_account, collector: _collector, minimal_amount: _minimal_amount, ends_at: _ends_at, owner_chat_id: _owner_chat_id, winner: _winner, ended: _ended };
}

function loadTupleBasicAuction$Data(source: TupleReader) {
    const _id = source.readBigNumber();
    const _owner = source.readAddress();
    const _owner_account = source.readAddress();
    const _collector = source.readAddress();
    const _minimal_amount = source.readBigNumber();
    const _ends_at = source.readBigNumber();
    const _owner_chat_id = source.readBigNumber();
    const _winner_p = source.readTupleOpt();
    const _winner = _winner_p ? loadTupleWinner(_winner_p) : null;
    const _ended = source.readBoolean();
    return { $$type: 'BasicAuction$Data' as const, id: _id, owner: _owner, owner_account: _owner_account, collector: _collector, minimal_amount: _minimal_amount, ends_at: _ends_at, owner_chat_id: _owner_chat_id, winner: _winner, ended: _ended };
}

function loadGetterTupleBasicAuction$Data(source: TupleReader) {
    const _id = source.readBigNumber();
    const _owner = source.readAddress();
    const _owner_account = source.readAddress();
    const _collector = source.readAddress();
    const _minimal_amount = source.readBigNumber();
    const _ends_at = source.readBigNumber();
    const _owner_chat_id = source.readBigNumber();
    const _winner_p = source.readTupleOpt();
    const _winner = _winner_p ? loadTupleWinner(_winner_p) : null;
    const _ended = source.readBoolean();
    return { $$type: 'BasicAuction$Data' as const, id: _id, owner: _owner, owner_account: _owner_account, collector: _collector, minimal_amount: _minimal_amount, ends_at: _ends_at, owner_chat_id: _owner_chat_id, winner: _winner, ended: _ended };
}

function storeTupleBasicAuction$Data(source: BasicAuction$Data) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.id);
    builder.writeAddress(source.owner);
    builder.writeAddress(source.owner_account);
    builder.writeAddress(source.collector);
    builder.writeNumber(source.minimal_amount);
    builder.writeNumber(source.ends_at);
    builder.writeNumber(source.owner_chat_id);
    if (source.winner !== null && source.winner !== undefined) {
        builder.writeTuple(storeTupleWinner(source.winner));
    } else {
        builder.writeTuple(null);
    }
    builder.writeBoolean(source.ended);
    return builder.build();
}

function dictValueParserBasicAuction$Data(): DictionaryValue<BasicAuction$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBasicAuction$Data(src)).endCell());
        },
        parse: (src) => {
            return loadBasicAuction$Data(src.loadRef().beginParse());
        }
    }
}

export type CreateAccount = {
    $$type: 'CreateAccount';
    chat_id: bigint;
    referree: Address | null;
}

export function storeCreateAccount(src: CreateAccount) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(241429993, 32);
        b_0.storeInt(src.chat_id, 257);
        b_0.storeAddress(src.referree);
    };
}

export function loadCreateAccount(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 241429993) { throw Error('Invalid prefix'); }
    const _chat_id = sc_0.loadIntBig(257);
    const _referree = sc_0.loadMaybeAddress();
    return { $$type: 'CreateAccount' as const, chat_id: _chat_id, referree: _referree };
}

function loadTupleCreateAccount(source: TupleReader) {
    const _chat_id = source.readBigNumber();
    const _referree = source.readAddressOpt();
    return { $$type: 'CreateAccount' as const, chat_id: _chat_id, referree: _referree };
}

function loadGetterTupleCreateAccount(source: TupleReader) {
    const _chat_id = source.readBigNumber();
    const _referree = source.readAddressOpt();
    return { $$type: 'CreateAccount' as const, chat_id: _chat_id, referree: _referree };
}

function storeTupleCreateAccount(source: CreateAccount) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.chat_id);
    builder.writeAddress(source.referree);
    return builder.build();
}

function dictValueParserCreateAccount(): DictionaryValue<CreateAccount> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCreateAccount(src)).endCell());
        },
        parse: (src) => {
            return loadCreateAccount(src.loadRef().beginParse());
        }
    }
}

export type AccountCreated = {
    $$type: 'AccountCreated';
}

export function storeAccountCreated(src: AccountCreated) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3905897037, 32);
    };
}

export function loadAccountCreated(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3905897037) { throw Error('Invalid prefix'); }
    return { $$type: 'AccountCreated' as const };
}

function loadTupleAccountCreated(source: TupleReader) {
    return { $$type: 'AccountCreated' as const };
}

function loadGetterTupleAccountCreated(source: TupleReader) {
    return { $$type: 'AccountCreated' as const };
}

function storeTupleAccountCreated(source: AccountCreated) {
    const builder = new TupleBuilder();
    return builder.build();
}

function dictValueParserAccountCreated(): DictionaryValue<AccountCreated> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAccountCreated(src)).endCell());
        },
        parse: (src) => {
            return loadAccountCreated(src.loadRef().beginParse());
        }
    }
}

export type ConfigureService = {
    $$type: 'ConfigureService';
    service_comission: bigint;
    referral_comission: bigint;
}

export function storeConfigureService(src: ConfigureService) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1770454153, 32);
        b_0.storeUint(src.service_comission, 16);
        b_0.storeUint(src.referral_comission, 16);
    };
}

export function loadConfigureService(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1770454153) { throw Error('Invalid prefix'); }
    const _service_comission = sc_0.loadUintBig(16);
    const _referral_comission = sc_0.loadUintBig(16);
    return { $$type: 'ConfigureService' as const, service_comission: _service_comission, referral_comission: _referral_comission };
}

function loadTupleConfigureService(source: TupleReader) {
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    return { $$type: 'ConfigureService' as const, service_comission: _service_comission, referral_comission: _referral_comission };
}

function loadGetterTupleConfigureService(source: TupleReader) {
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    return { $$type: 'ConfigureService' as const, service_comission: _service_comission, referral_comission: _referral_comission };
}

function storeTupleConfigureService(source: ConfigureService) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.service_comission);
    builder.writeNumber(source.referral_comission);
    return builder.build();
}

function dictValueParserConfigureService(): DictionaryValue<ConfigureService> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeConfigureService(src)).endCell());
        },
        parse: (src) => {
            return loadConfigureService(src.loadRef().beginParse());
        }
    }
}

export type CleanInitialiser = {
    $$type: 'CleanInitialiser';
    address: Address;
}

export function storeCleanInitialiser(src: CleanInitialiser) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2553827134, 32);
        b_0.storeAddress(src.address);
    };
}

export function loadCleanInitialiser(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2553827134) { throw Error('Invalid prefix'); }
    const _address = sc_0.loadAddress();
    return { $$type: 'CleanInitialiser' as const, address: _address };
}

function loadTupleCleanInitialiser(source: TupleReader) {
    const _address = source.readAddress();
    return { $$type: 'CleanInitialiser' as const, address: _address };
}

function loadGetterTupleCleanInitialiser(source: TupleReader) {
    const _address = source.readAddress();
    return { $$type: 'CleanInitialiser' as const, address: _address };
}

function storeTupleCleanInitialiser(source: CleanInitialiser) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.address);
    return builder.build();
}

function dictValueParserCleanInitialiser(): DictionaryValue<CleanInitialiser> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCleanInitialiser(src)).endCell());
        },
        parse: (src) => {
            return loadCleanInitialiser(src.loadRef().beginParse());
        }
    }
}

export type ConfigureAccount = {
    $$type: 'ConfigureAccount';
    address: Address;
    service_comission: bigint;
    referral_comission: bigint;
    max_allowance: bigint;
}

export function storeConfigureAccount(src: ConfigureAccount) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2001958088, 32);
        b_0.storeAddress(src.address);
        b_0.storeUint(src.service_comission, 16);
        b_0.storeUint(src.referral_comission, 16);
        b_0.storeUint(src.max_allowance, 16);
    };
}

export function loadConfigureAccount(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2001958088) { throw Error('Invalid prefix'); }
    const _address = sc_0.loadAddress();
    const _service_comission = sc_0.loadUintBig(16);
    const _referral_comission = sc_0.loadUintBig(16);
    const _max_allowance = sc_0.loadUintBig(16);
    return { $$type: 'ConfigureAccount' as const, address: _address, service_comission: _service_comission, referral_comission: _referral_comission, max_allowance: _max_allowance };
}

function loadTupleConfigureAccount(source: TupleReader) {
    const _address = source.readAddress();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _max_allowance = source.readBigNumber();
    return { $$type: 'ConfigureAccount' as const, address: _address, service_comission: _service_comission, referral_comission: _referral_comission, max_allowance: _max_allowance };
}

function loadGetterTupleConfigureAccount(source: TupleReader) {
    const _address = source.readAddress();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _max_allowance = source.readBigNumber();
    return { $$type: 'ConfigureAccount' as const, address: _address, service_comission: _service_comission, referral_comission: _referral_comission, max_allowance: _max_allowance };
}

function storeTupleConfigureAccount(source: ConfigureAccount) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.address);
    builder.writeNumber(source.service_comission);
    builder.writeNumber(source.referral_comission);
    builder.writeNumber(source.max_allowance);
    return builder.build();
}

function dictValueParserConfigureAccount(): DictionaryValue<ConfigureAccount> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeConfigureAccount(src)).endCell());
        },
        parse: (src) => {
            return loadConfigureAccount(src.loadRef().beginParse());
        }
    }
}

export type RequestInitialisation = {
    $$type: 'RequestInitialisation';
    user_account: Address;
}

export function storeRequestInitialisation(src: RequestInitialisation) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(277078452, 32);
        b_0.storeAddress(src.user_account);
    };
}

export function loadRequestInitialisation(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 277078452) { throw Error('Invalid prefix'); }
    const _user_account = sc_0.loadAddress();
    return { $$type: 'RequestInitialisation' as const, user_account: _user_account };
}

function loadTupleRequestInitialisation(source: TupleReader) {
    const _user_account = source.readAddress();
    return { $$type: 'RequestInitialisation' as const, user_account: _user_account };
}

function loadGetterTupleRequestInitialisation(source: TupleReader) {
    const _user_account = source.readAddress();
    return { $$type: 'RequestInitialisation' as const, user_account: _user_account };
}

function storeTupleRequestInitialisation(source: RequestInitialisation) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.user_account);
    return builder.build();
}

function dictValueParserRequestInitialisation(): DictionaryValue<RequestInitialisation> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeRequestInitialisation(src)).endCell());
        },
        parse: (src) => {
            return loadRequestInitialisation(src.loadRef().beginParse());
        }
    }
}

export type ServiceComission = {
    $$type: 'ServiceComission';
}

export function storeServiceComission(src: ServiceComission) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(265023355, 32);
    };
}

export function loadServiceComission(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 265023355) { throw Error('Invalid prefix'); }
    return { $$type: 'ServiceComission' as const };
}

function loadTupleServiceComission(source: TupleReader) {
    return { $$type: 'ServiceComission' as const };
}

function loadGetterTupleServiceComission(source: TupleReader) {
    return { $$type: 'ServiceComission' as const };
}

function storeTupleServiceComission(source: ServiceComission) {
    const builder = new TupleBuilder();
    return builder.build();
}

function dictValueParserServiceComission(): DictionaryValue<ServiceComission> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeServiceComission(src)).endCell());
        },
        parse: (src) => {
            return loadServiceComission(src.loadRef().beginParse());
        }
    }
}

export type Controller$Data = {
    $$type: 'Controller$Data';
    owner1: Address;
    owner2: Address;
    service_comission: bigint;
    referral_comission: bigint;
    initialisers: Dictionary<Address, AccountInitialisation>;
}

export function storeController$Data(src: Controller$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner1);
        b_0.storeAddress(src.owner2);
        b_0.storeUint(src.service_comission, 16);
        b_0.storeUint(src.referral_comission, 16);
        b_0.storeDict(src.initialisers, Dictionary.Keys.Address(), dictValueParserAccountInitialisation());
    };
}

export function loadController$Data(slice: Slice) {
    const sc_0 = slice;
    const _owner1 = sc_0.loadAddress();
    const _owner2 = sc_0.loadAddress();
    const _service_comission = sc_0.loadUintBig(16);
    const _referral_comission = sc_0.loadUintBig(16);
    const _initialisers = Dictionary.load(Dictionary.Keys.Address(), dictValueParserAccountInitialisation(), sc_0);
    return { $$type: 'Controller$Data' as const, owner1: _owner1, owner2: _owner2, service_comission: _service_comission, referral_comission: _referral_comission, initialisers: _initialisers };
}

function loadTupleController$Data(source: TupleReader) {
    const _owner1 = source.readAddress();
    const _owner2 = source.readAddress();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _initialisers = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserAccountInitialisation(), source.readCellOpt());
    return { $$type: 'Controller$Data' as const, owner1: _owner1, owner2: _owner2, service_comission: _service_comission, referral_comission: _referral_comission, initialisers: _initialisers };
}

function loadGetterTupleController$Data(source: TupleReader) {
    const _owner1 = source.readAddress();
    const _owner2 = source.readAddress();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _initialisers = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserAccountInitialisation(), source.readCellOpt());
    return { $$type: 'Controller$Data' as const, owner1: _owner1, owner2: _owner2, service_comission: _service_comission, referral_comission: _referral_comission, initialisers: _initialisers };
}

function storeTupleController$Data(source: Controller$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner1);
    builder.writeAddress(source.owner2);
    builder.writeNumber(source.service_comission);
    builder.writeNumber(source.referral_comission);
    builder.writeCell(source.initialisers.size > 0 ? beginCell().storeDictDirect(source.initialisers, Dictionary.Keys.Address(), dictValueParserAccountInitialisation()).endCell() : null);
    return builder.build();
}

function dictValueParserController$Data(): DictionaryValue<Controller$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeController$Data(src)).endCell());
        },
        parse: (src) => {
            return loadController$Data(src.loadRef().beginParse());
        }
    }
}

 type Controller_init_args = {
    $$type: 'Controller_init_args';
    owner1: Address;
    owner2: Address;
    service_comission: bigint;
    referral_comission: bigint;
    initialisers: Dictionary<Address, AccountInitialisation>;
}

function initController_init_args(src: Controller_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner1);
        b_0.storeAddress(src.owner2);
        b_0.storeUint(src.service_comission, 16);
        b_0.storeUint(src.referral_comission, 16);
        b_0.storeDict(src.initialisers, Dictionary.Keys.Address(), dictValueParserAccountInitialisation());
    };
}

async function Controller_init(owner1: Address, owner2: Address, service_comission: bigint, referral_comission: bigint, initialisers: Dictionary<Address, AccountInitialisation>) {
    const __code = Cell.fromHex('b5ee9c7241025f01001519000114ff00f4a413f4bcf2c80b01020162020c04c4d001d072d721d200d200fa4021103450666f04f86102f862ed44d0fa40fa40d30fd30ff40455406c1506925f06e07025d74920c21f953105d31f06de2182106986fc89bae302218210775374c8bae30221821098384f3ebae3022182100e63ede9ba03040506008e5f0402d30fd30f5932f8425330c70592307f945240c705e2f2e0c920c2fff2e0ca21c2fff2e0ca5301a0812710bbf2e0ca4014c855405054cf1658cf16cb0f12cb0ff400c9ed5401b85b04fa40d30fd30fd30f553034f8425370c70592307f945260c705e2f2e0c921c2fff2e0ca20c2fff2e0ca5ca0812710bbf2e0ca22441402c855308210775374c85005cb1f5003cf16cb0fcb0fcb0fc9104610351024706ddb3c5f054d006c5b04fa400131f8425340c70592307f945230c705e2f2e0c9500581010bf459304430c855405054cf1658cf16cb0f12cb0ff400c9ed5404fe8f695b04810101d70020d70b01c30093fa40019472d7216de21232f8416f2410235f03f8286d7053006d531110787088c8559150a9cf165007cf165005206e95307001cb0192cf16e213cb0fcb0f01c8810101cf0012f40012810101cf0013810101cf00ca00c901ccc95ce0362082101083e1b4bae302208210e8cf424dba0f07090b01fc705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d02981010b2259f40a6fa131925f0ae05475846e955b5358a070de461581010b50267a1034c855405045cb3f58206e95307001cb0192cf16e2cb0fcb0fcb0fc910394940206e953059f45930944133f413e20800c08040705a7f50926d55305f41f90001f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f9040003c8cf8580ca0012cccccf884008cbff01fa028069cf40cf8634f400c901fb004034c855405054cf1658cf16cb0f12cb0ff400c9ed5401f23034f8422581010b2259f40a6fa131b3925f06e081010b260259f40b6fa192306ddf206e92306d8e20d0d33f20d70b01c30093fa40019472d7216de201d30fd30fd30f55406c156f05e2206ef2d0806f25c85540821083a22bb55006cb1f14cb3f58206e95307001cb0192cf16e2cb0fcb0fcb0fc9103544300a0112f842017f6ddb3c5f054d00de8e323034f8422581010b2259f40a6fa131b3925f06e0500581010bf459304430c855405054cf1658cf16cb0f12cb0ff400c9ed54e0365f042182100fcbef7bba915be001c00001c121b08e1f8100826d70f84270c8cf8580ca00cf8440ce01fa02806acf40f400c901fb00e0f2c0820201200d570133be38c76a2687d207d206987e987fa022aa0360aaa826d9e3628c0e01e8f8286d7053006d531110787088c8559150a9cf165007cf165005206e95307001cb0192cf16e213cb0fcb0f01c8810101cf0012f40012810101cf0013810101cf00ca00c901ccc9705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d00f0114ff00f4a413f4bcf2c80b10020162114e02f8d001d072d721d200d200fa4021103450666f04f86102f862ed44d0fa40fa4020d70b01c30093fa40019472d7216de201d30fd30fd401d0810101d700f404810101d700810101d700d20030105a10591058105710566c1a0b8e9c098020d7217021d749c21f9430d31f01de8210e7e71482bae3025f0be0702ad74920121301e6d33f0131228101012259f40c6fa131b3925f0be0228101012259f40d6fa192306ddf206e92306d8e1ed0810101d700d401d001d401d001fa40d401d001d200d20055606c176f07e2206ef2d0806f2710365f06f84201c705b3925f0be058810101f45a3008a4107910681057104610354104034704f2c21f95310ad31f0bde21821083a22bb5ba8f5310485f0803d33f20d70b01c30093fa40019472d7216de201d30fd30fd30f554035f8425270c705f2e0cc08b3f2e0cf237f6f00c801308210e8cf424d01cb1fc9108a107910485e3310341023f842017f6ddb3ce0218210775374c8bae3022182101fcbffc6ba4d47141500dc5b343407fa40d30fd30fd30f553034f84252a0c705f2e0ccf82813c705f2e0cc5226a114a010791068105710461035410403c8559050a9cf165007cf165005206e95307001cb0192cf16e213cb0fcb0f01c8810101cf0012f40012810101cf0013810101cf00ca00c901ccc9ed5404f68ee35b09d33fd20059322bf2e0ce238101012259f40c6fa131f2e0cc238101012259f40d6fa192306ddf206e92306d8e1ed0810101d700d401d001d401d001fa40d401d001d200d20055606c176f07e2206ef2d0806f275bf84222c705f2e0cd7f81010108e0218210a9c1d33fbae302218210e7e71482bae302214616194401f45f033828f2e0cef8425360c70592307f945270c705e2f2e0c97a6d22810101f4856fa520911295316d326d01e2908ae85b32107910681057104610354403c8559050a9cf165007cf165005206e95307001cb0192cf16e213cb0fcb0f01c8810101cf0012f40012810101cf0013810101cf00ca00c901ccc9ed541701fc206e92306d8e1ed0810101d700d401d001d401d001fa40d401d001d200d20055606c176f07e2206ef2d0806f2721b38e44810101275551c855605067810101cf00c85005cf16c95004ccc85003cf16c958cc01cf16c858cf16c901ccca00ca00c9103412206e953059f45a30944133f415e202a559925f07e2810101240218002459f4786fa5209402d4305895316d326d01e201c05b09d33fd401d001d401d001810101d700d33f5540352ef2e0cef84252c0c705f2e0c9f823814650a05250bcf2e0caf8238208278d00a05250b9f2e0cb2dc200f2e0d0268101012559f40c6fa131b3f2e0d1f8286d7026515f0556114a342d021a02fe88c855815089cb3f5006cf165004cf1658cf16cb7f01c8cb3f12810101cf00226eb38e167f01ca0002206ef2d0806f2310345acf1612cb7fca3f95327058ca00e212ca00c901ccc95c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d08b56261736963870261b420114ff00f4a413f4bcf2c80b1c0201621d2503f2d001d072d721d200d200fa4021103450666f04f86102f862ed44d0d33ffa40fa40fa40d37fd401d0d33f810101d700d200019afa40d37fd23f55206f03916de201d20030104910481047104610456c190a925f0ae07029d74920c21f953109d31f0ade218210164a11f1bae3022182101e57efdebae3023a201e1f2101b65b38f8425360c70592307f945240c705e2f2e0ce08b392266e9170e2f2e0d17f8306702870c85982101fcbffc65003cb1fcb3fca00c927597013c8cf8580ca00cf8440ce01fa02806acf40f400c901fb00106810571046103544302402725b08810101d700013129b3f2e0d0f8235230bcf2e0cbf8416f2430325315bef2e0c92a6eb3913ae30d4099126f031068105710461035440302202400d60a206ef2d0806f235331bcf2e0c921a7058064a90482101dcd650001b6095220a05240bcf2e0ca705410326d027fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb00c87101cb0312cb3fcb7f2acf16c9c88258c000000000000000000000000101cb67ccc970fb00012e8210ec533ec0bae3023a5f0801c00001c121b0dcf2c0822202fe303808b3f2e0d0f8235210b9f2e0d2f8425350c70592307f945230c705e2f2e0cec87201cb035280cb3f20c931c88258c000000000000000000000000101cb67ccc970fb00266e8e31830670277fc85982101fcbffc65003cb1fcb3fca00c92659027fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb00e30e55157f2324007e26206ef2d0806f2330318306277003c8598210a9ee5a8d5003cb1f810101cf00cb7fc9544633027fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb000092c855805089cb3f5006cf165004cf1658cf16cb7f01c8cb3f12810101cf00226eb38e167f01ca0002206ef2d0806f2310345acf1612cb7fca3f95327058ca00e212ca00c901ccc9ed5402012026340201202729017dba882ed44d0d33ffa40fa40fa40d37fd401d0d33f810101d700d200019afa40d37fd23f55206f03916de201d20030104910481047104610456c19db3c6c918280002230201202a2c017db4a3bda89a1a67ff481f481f481a6ffa803a1a67f020203ae01a4000335f481a6ffa47eaa40de0722dbc403a4006020922090208e208c208ad833b678d92302b0002270201202d320201202e30017daf5076a268699ffd207d207d2069bfea00e8699fc08080eb80690000cd7d2069bfe91faa903781c8b6f100e9001808248824082388230822b60ced9e3648c02f000af8235240bc017daf6b76a268699ffd207d207d2069bfea00e8699fc08080eb80690000cd7d2069bfe91faa903781c8b6f100e9001808248824082388230822b60ced9e3648c0310040216eb38e1921206ef2d0806f233031a7058064a90482101dcd650001b609e024017db0fdfb513434cffe903e903e9034dff5007434cfe0404075c034800066be9034dff48fd5481bc0e45b788074800c041244120411c41184115b0676cf1b246033000224020120353e020120363c0201583738017daf6076a268699ffd207d207d2069bfea00e8699fc08080eb80690000cd7d2069bfe91faa903781c8b6f100e9001808248824082388230822b60ced9e3648c05c02016a393a017ba077b513434cffe903e903e9034dff5007434cfe0404075c034800066be9034dff48fd5481bc0e45b788074800c041244120411c41184115b0676cf1b2465a017ba243b513434cffe903e903e9034dff5007434cfe0404075c034800066be9034dff48fd5481bc0e45b788074800c041244120411c41184115b0676cf1b2463b000228017db5921da89a1a67ff481f481f481a6ffa803a1a67f020203ae01a4000335f481a6ffa47eaa40de0722dbc403a4006020922090208e208c208ad833b678d92303d0002200201583f4001a9b3657b513434cffe903e903e9034dff5007434cfe0404075c034800066be9034dff48fd5481bc0e45b788074800c041244120411c41184115b0676cf1b24481ba48c1b66481bbcb4201bc8dbc0f8881ba48c1b77a05e017db379fb513434cffe903e903e9034dff5007434cfe0404075c034800066be9034dff48fd5481bc0e45b788074800c041244120411c41184115b0676cf1b2460410004216e01fe05104608552070555081010107c855605067810101cf00c85005cf16c95004ccc85003cf16c958cc01cf16c858cf16c901ccca00ca00c910364160206e953059f45a30944133f415e270821005f5e1005a7f40066d55305f41f90001f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f9040003c8cf8580ca00124300c4cccccf884008cbff01fa028069cf40cf8634f400c901fb0008a5107910681057104610354403c8559050a9cf165007cf165005206e95307001cb0192cf16e213cb0fcb0f01c8810101cf0012f40012810101cf0013810101cf00ca00c901ccc9ed5402fe8210a9ee5a8dba8ef55b09810101d700d37f59322bf2e0ce238101012259f40c6fa131f2e0ccf8416f2430325033b608248101012359f40d6fa192306ddf206e92306d8e1ed0810101d700d401d001d401d001fa40d401d001d200d20055606c176f07e2206ef2d0806f27315229c705f2e0cd535ca8812710a904706f00e0454801e4c8013082100fcbef7b01cb1fc912561259027fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb00515ba8812710a9042d6eb38e31702e206ef2d0806f00c801308210de904d8e01cb1fc94130027fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb009130e255037f81010108460192c855605067810101cf00c85005cf16c95004ccc85003cf16c958cc01cf16c858cf16c901ccca00ca00c91034206e953059f45a30944133f415e208a410791068105710461035410403470078c8559050a9cf165007cf165005206e95307001cb0192cf16e213cb0fcb0f01c8810101cf0012f40012810101cf0013810101cf00ca00c901ccc9ed5403f6218210de904d8eba8ee410895f093202f2e0cef8416f2443305230fa40fa0071d721fa00fa00306c6170f83a01ab005202b9925f03e0216e8e32327001206ef2d0806f00c801308210de904d8e01cb1fc94130027fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb00e30de02182104ec34c2ebae3023b20494a4b005831706f00c8013082100fcbef7b01cb1fc94330027fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb000082109a5f0a01d37f013102f2e0cef8425210c705f2e0c983066f00c801308210de904d8e01cb1fc913027fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb0001c082106ad509a7ba8e48108b5f0bf8425210c705f2e0c9708100a06d5a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00e0c0000ac1211ab0e3025f0af2c0824c015c29925f0ae0f828c80182101083e1b458cb1f01cf16c9108a10791068105710461035443012f842017f6ddb3c5f0a4d00a06d6d226eb3995b206ef2d0806f22019132e21024700304804250231036552212c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb000201204f50018bbe1a3f6a2687d207d20106b8580e18049fd2000ca396b90b6f100e987e987ea00e8408080eb807a02408080eb80408080eb80690018082d082c882c082b882b360d6d9e3650c5e02012051550201485254018bb1d8bb51343e903e900835c2c070c024fe9000651cb5c85b788074c3f4c3f5007420404075c03d0120404075c020404075c034800c0416841644160415c4159b06b6cf1b2ae053002671f8276f102259546ba0546a805468b12d5611018bb1b03b51343e903e900835c2c070c024fe9000651cb5c85b788074c3f4c3f5007420404075c03d0120404075c020404075c034800c0416841644160415c4159b06b6cf1b28605c01bbba1eaed44d0fa40fa4020d70b01c30093fa40019472d7216de201d30fd30fd401d0810101d700f404810101d700810101d700d20030105a10591058105710566c1a5509db3c6ca1206e92306d99206ef2d0806f276f07e2206e92306dde8560068810101250259f40d6fa192306ddf206e92306d8e1ed0810101d700d401d001d401d001fa40d401d001d200d20055606c176f07e2020120585d020148595b012fb39cfb51343e903e9034c3f4c3fd0115501b0576cf1b14605a000222012fb1b03b51343e903e9034c3f4c3fd0115501b0576cf1b14605c0008f8276f10012fbaaa2ed44d0fa40fa40d30fd30ff40455406c15db3c6c5185e0002211e5dd43d');
    const builder = beginCell();
    initController_init_args({ $$type: 'Controller_init_args', owner1, owner2, service_comission, referral_comission, initialisers })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export const Controller_errors = {
    2: { message: `Stack underflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    11: { message: `'Unknown' error` },
    12: { message: `Fatal error` },
    13: { message: `Out of gas error` },
    14: { message: `Virtualization error` },
    32: { message: `Action list is invalid` },
    33: { message: `Action list is too long` },
    34: { message: `Action is invalid or not supported` },
    35: { message: `Invalid source address in outbound message` },
    36: { message: `Invalid destination address in outbound message` },
    37: { message: `Not enough Toncoin` },
    38: { message: `Not enough extra currencies` },
    39: { message: `Outbound message does not fit into a cell after rewriting` },
    40: { message: `Cannot process a message` },
    41: { message: `Library reference is null` },
    42: { message: `Library change action error` },
    43: { message: `Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree` },
    50: { message: `Account state size exceeded limits` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid standard address` },
    138: { message: `Not a basechain address` },
} as const

export const Controller_errors_backward = {
    "Stack underflow": 2,
    "Stack overflow": 3,
    "Integer overflow": 4,
    "Integer out of expected range": 5,
    "Invalid opcode": 6,
    "Type check error": 7,
    "Cell overflow": 8,
    "Cell underflow": 9,
    "Dictionary error": 10,
    "'Unknown' error": 11,
    "Fatal error": 12,
    "Out of gas error": 13,
    "Virtualization error": 14,
    "Action list is invalid": 32,
    "Action list is too long": 33,
    "Action is invalid or not supported": 34,
    "Invalid source address in outbound message": 35,
    "Invalid destination address in outbound message": 36,
    "Not enough Toncoin": 37,
    "Not enough extra currencies": 38,
    "Outbound message does not fit into a cell after rewriting": 39,
    "Cannot process a message": 40,
    "Library reference is null": 41,
    "Library change action error": 42,
    "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree": 43,
    "Account state size exceeded limits": 50,
    "Null reference exception": 128,
    "Invalid serialization prefix": 129,
    "Invalid incoming message": 130,
    "Constraints error": 131,
    "Access denied": 132,
    "Contract stopped": 133,
    "Invalid argument": 134,
    "Code of a contract was not found": 135,
    "Invalid standard address": 136,
    "Not a basechain address": 138,
} as const

const Controller_types: ABIType[] = [
    {"name":"DataSize","header":null,"fields":[{"name":"cells","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bits","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"refs","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounceable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"MessageParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"DeployParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"init","type":{"kind":"simple","type":"StateInit","optional":false}}]},
    {"name":"StdAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"VarAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":32}},{"name":"address","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"BasechainAddress","header":null,"fields":[{"name":"hash","type":{"kind":"simple","type":"int","optional":true,"format":257}}]},
    {"name":"ChangeOwner","header":2174598809,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ChangeOwnerOk","header":846932810,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"AuctionMeta","header":null,"fields":[{"name":"id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"name","type":{"kind":"simple","type":"string","optional":false}},{"name":"description","type":{"kind":"simple","type":"string","optional":false}},{"name":"address","type":{"kind":"simple","type":"address","optional":false}},{"name":"type","type":{"kind":"simple","type":"string","optional":false}},{"name":"ended","type":{"kind":"simple","type":"bool","optional":false}},{"name":"refund","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"Profit","header":2850970253,"fields":[{"name":"id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":128}}]},
    {"name":"Collect","header":1321421870,"fields":[{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":128}}]},
    {"name":"AuctionDeleted","header":533462982,"fields":[{"name":"id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"refund","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"AccountDelete","header":1792346535,"fields":[]},
    {"name":"AccountInitialisation","header":null,"fields":[{"name":"chat_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"referree","type":{"kind":"simple","type":"address","optional":true}},{"name":"service_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"referral_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"max_allowance","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
    {"name":"Initialize","header":2208443317,"fields":[{"name":"chat_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"referree","type":{"kind":"simple","type":"address","optional":true}},{"name":"service_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"referral_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"max_allowance","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
    {"name":"ReferralCommission","header":3733998990,"fields":[]},
    {"name":"CreateBasicAuction","header":3890680962,"fields":[{"name":"id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"name","type":{"kind":"simple","type":"string","optional":false}},{"name":"description","type":{"kind":"simple","type":"string","optional":false}},{"name":"minimalAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"endsAt","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"CleanUp","header":2848052031,"fields":[]},
    {"name":"AccountData","header":null,"fields":[{"name":"initialised","type":{"kind":"simple","type":"bool","optional":false}},{"name":"version","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"service_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"referral_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"max_allowance","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"allowance","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"balance","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"auctions","type":{"kind":"dict","key":"int","value":"AuctionMeta","valueFormat":"ref"}},{"name":"chat_id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"referree","type":{"kind":"simple","type":"address","optional":true}}]},
    {"name":"Account$Data","header":null,"fields":[{"name":"collector","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"referree","type":{"kind":"simple","type":"address","optional":true}},{"name":"service_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"referral_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"chat_id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"auctions","type":{"kind":"dict","key":"int","value":"AuctionMeta","valueFormat":"ref"}},{"name":"max_allowance","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"allowance","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"initialised","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"Bid","header":509079518,"fields":[{"name":"chat_id","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"Winner","header":null,"fields":[{"name":"address","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":128}},{"name":"chat_id","type":{"kind":"simple","type":"int","optional":false,"format":64}}]},
    {"name":"AuctionData","header":null,"fields":[{"name":"id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"owner_account","type":{"kind":"simple","type":"address","optional":false}},{"name":"minimal_amount","type":{"kind":"simple","type":"uint","optional":false,"format":128}},{"name":"ends_at","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"winner","type":{"kind":"simple","type":"Winner","optional":true}},{"name":"ended","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"Resolve","header":3964878528,"fields":[]},
    {"name":"Delete","header":373953009,"fields":[]},
    {"name":"BasicAuction$Data","header":null,"fields":[{"name":"id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner_account","type":{"kind":"simple","type":"address","optional":false}},{"name":"collector","type":{"kind":"simple","type":"address","optional":false}},{"name":"minimal_amount","type":{"kind":"simple","type":"uint","optional":false,"format":128}},{"name":"ends_at","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"owner_chat_id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"winner","type":{"kind":"simple","type":"Winner","optional":true}},{"name":"ended","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"CreateAccount","header":241429993,"fields":[{"name":"chat_id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"referree","type":{"kind":"simple","type":"address","optional":true}}]},
    {"name":"AccountCreated","header":3905897037,"fields":[]},
    {"name":"ConfigureService","header":1770454153,"fields":[{"name":"service_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"referral_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
    {"name":"CleanInitialiser","header":2553827134,"fields":[{"name":"address","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ConfigureAccount","header":2001958088,"fields":[{"name":"address","type":{"kind":"simple","type":"address","optional":false}},{"name":"service_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"referral_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"max_allowance","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
    {"name":"RequestInitialisation","header":277078452,"fields":[{"name":"user_account","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ServiceComission","header":265023355,"fields":[]},
    {"name":"Controller$Data","header":null,"fields":[{"name":"owner1","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner2","type":{"kind":"simple","type":"address","optional":false}},{"name":"service_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"referral_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"initialisers","type":{"kind":"dict","key":"address","value":"AccountInitialisation","valueFormat":"ref"}}]},
]

const Controller_opcodes = {
    "ChangeOwner": 2174598809,
    "ChangeOwnerOk": 846932810,
    "Profit": 2850970253,
    "Collect": 1321421870,
    "AuctionDeleted": 533462982,
    "AccountDelete": 1792346535,
    "Initialize": 2208443317,
    "ReferralCommission": 3733998990,
    "CreateBasicAuction": 3890680962,
    "CleanUp": 2848052031,
    "Bid": 509079518,
    "Resolve": 3964878528,
    "Delete": 373953009,
    "CreateAccount": 241429993,
    "AccountCreated": 3905897037,
    "ConfigureService": 1770454153,
    "CleanInitialiser": 2553827134,
    "ConfigureAccount": 2001958088,
    "RequestInitialisation": 277078452,
    "ServiceComission": 265023355,
}

const Controller_getters: ABIGetter[] = [
    {"name":"userAccount","methodId":83736,"arguments":[{"name":"user","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"serviceComission","methodId":102003,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"referralComission","methodId":125602,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"balance","methodId":104128,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
]

export const Controller_getterMapping: { [key: string]: string } = {
    'userAccount': 'getUserAccount',
    'serviceComission': 'getServiceComission',
    'referralComission': 'getReferralComission',
    'balance': 'getBalance',
}

const Controller_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"ConfigureService"}},
    {"receiver":"internal","message":{"kind":"typed","type":"ConfigureAccount"}},
    {"receiver":"internal","message":{"kind":"typed","type":"CleanInitialiser"}},
    {"receiver":"internal","message":{"kind":"typed","type":"CreateAccount"}},
    {"receiver":"internal","message":{"kind":"typed","type":"RequestInitialisation"}},
    {"receiver":"internal","message":{"kind":"typed","type":"AccountCreated"}},
    {"receiver":"internal","message":{"kind":"empty"}},
    {"receiver":"internal","message":{"kind":"typed","type":"ServiceComission"}},
]


export class Controller implements Contract {
    
    public static readonly VERSION = 1n;
    public static readonly ERRORS_UNAUTHORISED = 201n;
    public static readonly ERRORS_BAD_AUCTION_TOO_SHORT = 202n;
    public static readonly ERRORS_BAD_AUCTION_TOO_LONG = 203n;
    public static readonly ERRORS_AUCTION_NOT_EXIST = 204n;
    public static readonly ERRORS_WRONG_AUCTION_ADDRESS = 205n;
    public static readonly ERRORS_AUCTION_NOT_INITIALISED = 206n;
    public static readonly ERRORS_AUCTION_INITIALISED = 207n;
    public static readonly ERRORS_NOT_ENOUGH_ALLOWANCE = 208n;
    public static readonly ERRORS_AUCTION_ALREADY_EXISTS = 209n;
    public static readonly MINIMAL_COMMISSION_TO_BE_PAID = 100000000n;
    public static readonly MINIMAL_AUCTION_TIMESPAN = 18000n;
    public static readonly MAXIMAL_AUCTION_TIMESPAN = 2592000n;
    public static readonly EVENT_ACCOUNT_CREATED = 1000n;
    public static readonly storageReserve = 0n;
    public static readonly ERRORS_BID_IS_TOO_SMALL = 201n;
    public static readonly ERRORS_BID_RAISE_IS_TOO_SMALL = 202n;
    public static readonly ERRORS_FINISHED = 203n;
    public static readonly ERRORS_NOT_ALLOWED = 206n;
    public static readonly ERRORS_OWNER_BID_NOT_ALLOWED = 207n;
    public static readonly ERRORS_ENDED = 208n;
    public static readonly ERRORS_HAS_WINNER = 209n;
    public static readonly ERRORS_UNFINISHED = 210n;
    public static readonly EVENT_OUTBIDDED = 1n;
    public static readonly EVENT_RESOLVED = 2n;
    public static readonly MINIMAL_RAISE = 500000000n;
    public static readonly ERRORS_BAD_CONFIGURATION = 202n;
    public static readonly NOT_ENOUGH_FUNDS_TO_CREATE_ACCOUNT = 203n;
    public static readonly DEFAULT_ALLOWANCE = 10n;
    public static readonly errors = Controller_errors_backward;
    public static readonly opcodes = Controller_opcodes;
    
    static async init(owner1: Address, owner2: Address, service_comission: bigint, referral_comission: bigint, initialisers: Dictionary<Address, AccountInitialisation>) {
        return await Controller_init(owner1, owner2, service_comission, referral_comission, initialisers);
    }
    
    static async fromInit(owner1: Address, owner2: Address, service_comission: bigint, referral_comission: bigint, initialisers: Dictionary<Address, AccountInitialisation>) {
        const __gen_init = await Controller_init(owner1, owner2, service_comission, referral_comission, initialisers);
        const address = contractAddress(0, __gen_init);
        return new Controller(address, __gen_init);
    }
    
    static fromAddress(address: Address) {
        return new Controller(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  Controller_types,
        getters: Controller_getters,
        receivers: Controller_receivers,
        errors: Controller_errors,
    };
    
    constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: ConfigureService | ConfigureAccount | CleanInitialiser | CreateAccount | RequestInitialisation | AccountCreated | null | ServiceComission) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ConfigureService') {
            body = beginCell().store(storeConfigureService(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ConfigureAccount') {
            body = beginCell().store(storeConfigureAccount(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'CleanInitialiser') {
            body = beginCell().store(storeCleanInitialiser(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'CreateAccount') {
            body = beginCell().store(storeCreateAccount(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'RequestInitialisation') {
            body = beginCell().store(storeRequestInitialisation(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AccountCreated') {
            body = beginCell().store(storeAccountCreated(message)).endCell();
        }
        if (message === null) {
            body = new Cell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ServiceComission') {
            body = beginCell().store(storeServiceComission(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getUserAccount(provider: ContractProvider, user: Address) {
        const builder = new TupleBuilder();
        builder.writeAddress(user);
        const source = (await provider.get('userAccount', builder.build())).stack;
        const result = source.readAddress();
        return result;
    }
    
    async getServiceComission(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('serviceComission', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getReferralComission(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('referralComission', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getBalance(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('balance', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
}