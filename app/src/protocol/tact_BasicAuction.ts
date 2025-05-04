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

export type CreateAccount = {
    $$type: 'CreateAccount';
    secret_id: Cell;
    referree: Address | null;
}

export function storeCreateAccount(src: CreateAccount) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(878580077, 32);
        b_0.storeRef(src.secret_id);
        b_0.storeAddress(src.referree);
    };
}

export function loadCreateAccount(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 878580077) { throw Error('Invalid prefix'); }
    const _secret_id = sc_0.loadRef();
    const _referree = sc_0.loadMaybeAddress();
    return { $$type: 'CreateAccount' as const, secret_id: _secret_id, referree: _referree };
}

function loadTupleCreateAccount(source: TupleReader) {
    const _secret_id = source.readCell();
    const _referree = source.readAddressOpt();
    return { $$type: 'CreateAccount' as const, secret_id: _secret_id, referree: _referree };
}

function loadGetterTupleCreateAccount(source: TupleReader) {
    const _secret_id = source.readCell();
    const _referree = source.readAddressOpt();
    return { $$type: 'CreateAccount' as const, secret_id: _secret_id, referree: _referree };
}

function storeTupleCreateAccount(source: CreateAccount) {
    const builder = new TupleBuilder();
    builder.writeCell(source.secret_id);
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

export type RequestInitialisation = {
    $$type: 'RequestInitialisation';
}

export function storeRequestInitialisation(src: RequestInitialisation) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3393990837, 32);
    };
}

export function loadRequestInitialisation(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3393990837) { throw Error('Invalid prefix'); }
    return { $$type: 'RequestInitialisation' as const };
}

function loadTupleRequestInitialisation(source: TupleReader) {
    return { $$type: 'RequestInitialisation' as const };
}

function loadGetterTupleRequestInitialisation(source: TupleReader) {
    return { $$type: 'RequestInitialisation' as const };
}

function storeTupleRequestInitialisation(source: RequestInitialisation) {
    const builder = new TupleBuilder();
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

export type CollectMoneys = {
    $$type: 'CollectMoneys';
}

export function storeCollectMoneys(src: CollectMoneys) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(707278593, 32);
    };
}

export function loadCollectMoneys(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 707278593) { throw Error('Invalid prefix'); }
    return { $$type: 'CollectMoneys' as const };
}

function loadTupleCollectMoneys(source: TupleReader) {
    return { $$type: 'CollectMoneys' as const };
}

function loadGetterTupleCollectMoneys(source: TupleReader) {
    return { $$type: 'CollectMoneys' as const };
}

function storeTupleCollectMoneys(source: CollectMoneys) {
    const builder = new TupleBuilder();
    return builder.build();
}

function dictValueParserCollectMoneys(): DictionaryValue<CollectMoneys> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCollectMoneys(src)).endCell());
        },
        parse: (src) => {
            return loadCollectMoneys(src.loadRef().beginParse());
        }
    }
}

export type AuctionConfig = {
    $$type: 'AuctionConfig';
    name: string;
    description: string;
    address: Address;
    type: string;
    ends_at: bigint;
    minimal_amount: bigint;
    ended: boolean;
    refund: boolean;
}

export function storeAuctionConfig(src: AuctionConfig) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeStringRefTail(src.name);
        b_0.storeStringRefTail(src.description);
        b_0.storeAddress(src.address);
        b_0.storeStringRefTail(src.type);
        b_0.storeUint(src.ends_at, 64);
        b_0.storeUint(src.minimal_amount, 128);
        b_0.storeBit(src.ended);
        b_0.storeBit(src.refund);
    };
}

export function loadAuctionConfig(slice: Slice) {
    const sc_0 = slice;
    const _name = sc_0.loadStringRefTail();
    const _description = sc_0.loadStringRefTail();
    const _address = sc_0.loadAddress();
    const _type = sc_0.loadStringRefTail();
    const _ends_at = sc_0.loadUintBig(64);
    const _minimal_amount = sc_0.loadUintBig(128);
    const _ended = sc_0.loadBit();
    const _refund = sc_0.loadBit();
    return { $$type: 'AuctionConfig' as const, name: _name, description: _description, address: _address, type: _type, ends_at: _ends_at, minimal_amount: _minimal_amount, ended: _ended, refund: _refund };
}

function loadTupleAuctionConfig(source: TupleReader) {
    const _name = source.readString();
    const _description = source.readString();
    const _address = source.readAddress();
    const _type = source.readString();
    const _ends_at = source.readBigNumber();
    const _minimal_amount = source.readBigNumber();
    const _ended = source.readBoolean();
    const _refund = source.readBoolean();
    return { $$type: 'AuctionConfig' as const, name: _name, description: _description, address: _address, type: _type, ends_at: _ends_at, minimal_amount: _minimal_amount, ended: _ended, refund: _refund };
}

function loadGetterTupleAuctionConfig(source: TupleReader) {
    const _name = source.readString();
    const _description = source.readString();
    const _address = source.readAddress();
    const _type = source.readString();
    const _ends_at = source.readBigNumber();
    const _minimal_amount = source.readBigNumber();
    const _ended = source.readBoolean();
    const _refund = source.readBoolean();
    return { $$type: 'AuctionConfig' as const, name: _name, description: _description, address: _address, type: _type, ends_at: _ends_at, minimal_amount: _minimal_amount, ended: _ended, refund: _refund };
}

function storeTupleAuctionConfig(source: AuctionConfig) {
    const builder = new TupleBuilder();
    builder.writeString(source.name);
    builder.writeString(source.description);
    builder.writeAddress(source.address);
    builder.writeString(source.type);
    builder.writeNumber(source.ends_at);
    builder.writeNumber(source.minimal_amount);
    builder.writeBoolean(source.ended);
    builder.writeBoolean(source.refund);
    return builder.build();
}

function dictValueParserAuctionConfig(): DictionaryValue<AuctionConfig> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAuctionConfig(src)).endCell());
        },
        parse: (src) => {
            return loadAuctionConfig(src.loadRef().beginParse());
        }
    }
}

export type AccountInit = {
    $$type: 'AccountInit';
    collector: Address;
    owner: Address;
}

export function storeAccountInit(src: AccountInit) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.collector);
        b_0.storeAddress(src.owner);
    };
}

export function loadAccountInit(slice: Slice) {
    const sc_0 = slice;
    const _collector = sc_0.loadAddress();
    const _owner = sc_0.loadAddress();
    return { $$type: 'AccountInit' as const, collector: _collector, owner: _owner };
}

function loadTupleAccountInit(source: TupleReader) {
    const _collector = source.readAddress();
    const _owner = source.readAddress();
    return { $$type: 'AccountInit' as const, collector: _collector, owner: _owner };
}

function loadGetterTupleAccountInit(source: TupleReader) {
    const _collector = source.readAddress();
    const _owner = source.readAddress();
    return { $$type: 'AccountInit' as const, collector: _collector, owner: _owner };
}

function storeTupleAccountInit(source: AccountInit) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.collector);
    builder.writeAddress(source.owner);
    return builder.build();
}

function dictValueParserAccountInit(): DictionaryValue<AccountInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAccountInit(src)).endCell());
        },
        parse: (src) => {
            return loadAccountInit(src.loadRef().beginParse());
        }
    }
}

export type AccountData = {
    $$type: 'AccountData';
    owner: Address;
    version: bigint;
    referree: Address | null;
    service_comission: bigint;
    referral_comission: bigint;
    max_allowance: bigint;
    allowance: bigint;
    initialised: boolean;
    secret_id: Cell;
    balance: bigint;
    auctions: Dictionary<Address, AuctionConfig>;
}

export function storeAccountData(src: AccountData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeInt(src.version, 257);
        b_0.storeAddress(src.referree);
        b_0.storeUint(src.service_comission, 16);
        b_0.storeUint(src.referral_comission, 16);
        const b_1 = new Builder();
        b_1.storeInt(src.max_allowance, 257);
        b_1.storeInt(src.allowance, 257);
        b_1.storeBit(src.initialised);
        b_1.storeRef(src.secret_id);
        b_1.storeInt(src.balance, 257);
        b_1.storeDict(src.auctions, Dictionary.Keys.Address(), dictValueParserAuctionConfig());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadAccountData(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _version = sc_0.loadIntBig(257);
    const _referree = sc_0.loadMaybeAddress();
    const _service_comission = sc_0.loadUintBig(16);
    const _referral_comission = sc_0.loadUintBig(16);
    const sc_1 = sc_0.loadRef().beginParse();
    const _max_allowance = sc_1.loadIntBig(257);
    const _allowance = sc_1.loadIntBig(257);
    const _initialised = sc_1.loadBit();
    const _secret_id = sc_1.loadRef();
    const _balance = sc_1.loadIntBig(257);
    const _auctions = Dictionary.load(Dictionary.Keys.Address(), dictValueParserAuctionConfig(), sc_1);
    return { $$type: 'AccountData' as const, owner: _owner, version: _version, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, max_allowance: _max_allowance, allowance: _allowance, initialised: _initialised, secret_id: _secret_id, balance: _balance, auctions: _auctions };
}

function loadTupleAccountData(source: TupleReader) {
    const _owner = source.readAddress();
    const _version = source.readBigNumber();
    const _referree = source.readAddressOpt();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _max_allowance = source.readBigNumber();
    const _allowance = source.readBigNumber();
    const _initialised = source.readBoolean();
    const _secret_id = source.readCell();
    const _balance = source.readBigNumber();
    const _auctions = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserAuctionConfig(), source.readCellOpt());
    return { $$type: 'AccountData' as const, owner: _owner, version: _version, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, max_allowance: _max_allowance, allowance: _allowance, initialised: _initialised, secret_id: _secret_id, balance: _balance, auctions: _auctions };
}

function loadGetterTupleAccountData(source: TupleReader) {
    const _owner = source.readAddress();
    const _version = source.readBigNumber();
    const _referree = source.readAddressOpt();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _max_allowance = source.readBigNumber();
    const _allowance = source.readBigNumber();
    const _initialised = source.readBoolean();
    const _secret_id = source.readCell();
    const _balance = source.readBigNumber();
    const _auctions = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserAuctionConfig(), source.readCellOpt());
    return { $$type: 'AccountData' as const, owner: _owner, version: _version, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, max_allowance: _max_allowance, allowance: _allowance, initialised: _initialised, secret_id: _secret_id, balance: _balance, auctions: _auctions };
}

function storeTupleAccountData(source: AccountData) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeNumber(source.version);
    builder.writeAddress(source.referree);
    builder.writeNumber(source.service_comission);
    builder.writeNumber(source.referral_comission);
    builder.writeNumber(source.max_allowance);
    builder.writeNumber(source.allowance);
    builder.writeBoolean(source.initialised);
    builder.writeCell(source.secret_id);
    builder.writeNumber(source.balance);
    builder.writeCell(source.auctions.size > 0 ? beginCell().storeDictDirect(source.auctions, Dictionary.Keys.Address(), dictValueParserAuctionConfig()).endCell() : null);
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
    auctions: Dictionary<Address, AuctionConfig>;
    max_allowance: bigint;
    allowance: bigint;
    initialised: boolean;
    secret_id: Cell;
}

export function storeAccount$Data(src: Account$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.collector);
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.referree);
        b_0.storeUint(src.service_comission, 16);
        b_0.storeUint(src.referral_comission, 16);
        b_0.storeDict(src.auctions, Dictionary.Keys.Address(), dictValueParserAuctionConfig());
        const b_1 = new Builder();
        b_1.storeInt(src.max_allowance, 257);
        b_1.storeInt(src.allowance, 257);
        b_1.storeBit(src.initialised);
        b_1.storeRef(src.secret_id);
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
    const _auctions = Dictionary.load(Dictionary.Keys.Address(), dictValueParserAuctionConfig(), sc_0);
    const sc_1 = sc_0.loadRef().beginParse();
    const _max_allowance = sc_1.loadIntBig(257);
    const _allowance = sc_1.loadIntBig(257);
    const _initialised = sc_1.loadBit();
    const _secret_id = sc_1.loadRef();
    return { $$type: 'Account$Data' as const, collector: _collector, owner: _owner, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, auctions: _auctions, max_allowance: _max_allowance, allowance: _allowance, initialised: _initialised, secret_id: _secret_id };
}

function loadTupleAccount$Data(source: TupleReader) {
    const _collector = source.readAddress();
    const _owner = source.readAddress();
    const _referree = source.readAddressOpt();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _auctions = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserAuctionConfig(), source.readCellOpt());
    const _max_allowance = source.readBigNumber();
    const _allowance = source.readBigNumber();
    const _initialised = source.readBoolean();
    const _secret_id = source.readCell();
    return { $$type: 'Account$Data' as const, collector: _collector, owner: _owner, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, auctions: _auctions, max_allowance: _max_allowance, allowance: _allowance, initialised: _initialised, secret_id: _secret_id };
}

function loadGetterTupleAccount$Data(source: TupleReader) {
    const _collector = source.readAddress();
    const _owner = source.readAddress();
    const _referree = source.readAddressOpt();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _auctions = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserAuctionConfig(), source.readCellOpt());
    const _max_allowance = source.readBigNumber();
    const _allowance = source.readBigNumber();
    const _initialised = source.readBoolean();
    const _secret_id = source.readCell();
    return { $$type: 'Account$Data' as const, collector: _collector, owner: _owner, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, auctions: _auctions, max_allowance: _max_allowance, allowance: _allowance, initialised: _initialised, secret_id: _secret_id };
}

function storeTupleAccount$Data(source: Account$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.collector);
    builder.writeAddress(source.owner);
    builder.writeAddress(source.referree);
    builder.writeNumber(source.service_comission);
    builder.writeNumber(source.referral_comission);
    builder.writeCell(source.auctions.size > 0 ? beginCell().storeDictDirect(source.auctions, Dictionary.Keys.Address(), dictValueParserAuctionConfig()).endCell() : null);
    builder.writeNumber(source.max_allowance);
    builder.writeNumber(source.allowance);
    builder.writeBoolean(source.initialised);
    builder.writeCell(source.secret_id);
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

export type Collect = {
    $$type: 'Collect';
}

export function storeCollect(src: Collect) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1729135813, 32);
    };
}

export function loadCollect(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1729135813) { throw Error('Invalid prefix'); }
    return { $$type: 'Collect' as const };
}

function loadTupleCollect(source: TupleReader) {
    return { $$type: 'Collect' as const };
}

function loadGetterTupleCollect(source: TupleReader) {
    return { $$type: 'Collect' as const };
}

function storeTupleCollect(source: Collect) {
    const builder = new TupleBuilder();
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

export type AccountInitialisedEvent = {
    $$type: 'AccountInitialisedEvent';
    address: Address;
    secret_id: Cell;
}

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
    if (sc_0.loadUint(32) !== 11323904) { throw Error('Invalid prefix'); }
    const _address = sc_0.loadAddress();
    const _secret_id = sc_0.loadRef();
    return { $$type: 'AccountInitialisedEvent' as const, address: _address, secret_id: _secret_id };
}

function loadTupleAccountInitialisedEvent(source: TupleReader) {
    const _address = source.readAddress();
    const _secret_id = source.readCell();
    return { $$type: 'AccountInitialisedEvent' as const, address: _address, secret_id: _secret_id };
}

function loadGetterTupleAccountInitialisedEvent(source: TupleReader) {
    const _address = source.readAddress();
    const _secret_id = source.readCell();
    return { $$type: 'AccountInitialisedEvent' as const, address: _address, secret_id: _secret_id };
}

function storeTupleAccountInitialisedEvent(source: AccountInitialisedEvent) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.address);
    builder.writeCell(source.secret_id);
    return builder.build();
}

function dictValueParserAccountInitialisedEvent(): DictionaryValue<AccountInitialisedEvent> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAccountInitialisedEvent(src)).endCell());
        },
        parse: (src) => {
            return loadAccountInitialisedEvent(src.loadRef().beginParse());
        }
    }
}

export type ProfitReceivedEvent = {
    $$type: 'ProfitReceivedEvent';
    address: Address;
    amount: bigint;
    secret_id: Cell;
}

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
    if (sc_0.loadUint(32) !== 11323905) { throw Error('Invalid prefix'); }
    const _address = sc_0.loadAddress();
    const _amount = sc_0.loadIntBig(257);
    const _secret_id = sc_0.loadRef();
    return { $$type: 'ProfitReceivedEvent' as const, address: _address, amount: _amount, secret_id: _secret_id };
}

function loadTupleProfitReceivedEvent(source: TupleReader) {
    const _address = source.readAddress();
    const _amount = source.readBigNumber();
    const _secret_id = source.readCell();
    return { $$type: 'ProfitReceivedEvent' as const, address: _address, amount: _amount, secret_id: _secret_id };
}

function loadGetterTupleProfitReceivedEvent(source: TupleReader) {
    const _address = source.readAddress();
    const _amount = source.readBigNumber();
    const _secret_id = source.readCell();
    return { $$type: 'ProfitReceivedEvent' as const, address: _address, amount: _amount, secret_id: _secret_id };
}

function storeTupleProfitReceivedEvent(source: ProfitReceivedEvent) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.address);
    builder.writeNumber(source.amount);
    builder.writeCell(source.secret_id);
    return builder.build();
}

function dictValueParserProfitReceivedEvent(): DictionaryValue<ProfitReceivedEvent> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeProfitReceivedEvent(src)).endCell());
        },
        parse: (src) => {
            return loadProfitReceivedEvent(src.loadRef().beginParse());
        }
    }
}

export type Profit = {
    $$type: 'Profit';
    amount: bigint;
}

export function storeProfit(src: Profit) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2039625306, 32);
        b_0.storeUint(src.amount, 128);
    };
}

export function loadProfit(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2039625306) { throw Error('Invalid prefix'); }
    const _amount = sc_0.loadUintBig(128);
    return { $$type: 'Profit' as const, amount: _amount };
}

function loadTupleProfit(source: TupleReader) {
    const _amount = source.readBigNumber();
    return { $$type: 'Profit' as const, amount: _amount };
}

function loadGetterTupleProfit(source: TupleReader) {
    const _amount = source.readBigNumber();
    return { $$type: 'Profit' as const, amount: _amount };
}

function storeTupleProfit(source: Profit) {
    const builder = new TupleBuilder();
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

export type AuctionDeleted = {
    $$type: 'AuctionDeleted';
    refund: boolean;
}

export function storeAuctionDeleted(src: AuctionDeleted) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2581037814, 32);
        b_0.storeBit(src.refund);
    };
}

export function loadAuctionDeleted(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2581037814) { throw Error('Invalid prefix'); }
    const _refund = sc_0.loadBit();
    return { $$type: 'AuctionDeleted' as const, refund: _refund };
}

function loadTupleAuctionDeleted(source: TupleReader) {
    const _refund = source.readBoolean();
    return { $$type: 'AuctionDeleted' as const, refund: _refund };
}

function loadGetterTupleAuctionDeleted(source: TupleReader) {
    const _refund = source.readBoolean();
    return { $$type: 'AuctionDeleted' as const, refund: _refund };
}

function storeTupleAuctionDeleted(source: AuctionDeleted) {
    const builder = new TupleBuilder();
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

export type AccountInitialise = {
    $$type: 'AccountInitialise';
    referree: Address | null;
    service_comission: bigint;
    referral_comission: bigint;
    max_allowance: bigint;
    secret_id: Cell;
}

export function storeAccountInitialise(src: AccountInitialise) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2387891835, 32);
        b_0.storeAddress(src.referree);
        b_0.storeUint(src.service_comission, 16);
        b_0.storeUint(src.referral_comission, 16);
        b_0.storeUint(src.max_allowance, 16);
        b_0.storeRef(src.secret_id);
    };
}

export function loadAccountInitialise(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2387891835) { throw Error('Invalid prefix'); }
    const _referree = sc_0.loadMaybeAddress();
    const _service_comission = sc_0.loadUintBig(16);
    const _referral_comission = sc_0.loadUintBig(16);
    const _max_allowance = sc_0.loadUintBig(16);
    const _secret_id = sc_0.loadRef();
    return { $$type: 'AccountInitialise' as const, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, max_allowance: _max_allowance, secret_id: _secret_id };
}

function loadTupleAccountInitialise(source: TupleReader) {
    const _referree = source.readAddressOpt();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _max_allowance = source.readBigNumber();
    const _secret_id = source.readCell();
    return { $$type: 'AccountInitialise' as const, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, max_allowance: _max_allowance, secret_id: _secret_id };
}

function loadGetterTupleAccountInitialise(source: TupleReader) {
    const _referree = source.readAddressOpt();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _max_allowance = source.readBigNumber();
    const _secret_id = source.readCell();
    return { $$type: 'AccountInitialise' as const, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, max_allowance: _max_allowance, secret_id: _secret_id };
}

function storeTupleAccountInitialise(source: AccountInitialise) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.referree);
    builder.writeNumber(source.service_comission);
    builder.writeNumber(source.referral_comission);
    builder.writeNumber(source.max_allowance);
    builder.writeCell(source.secret_id);
    return builder.build();
}

function dictValueParserAccountInitialise(): DictionaryValue<AccountInitialise> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAccountInitialise(src)).endCell());
        },
        parse: (src) => {
            return loadAccountInitialise(src.loadRef().beginParse());
        }
    }
}

export type CreateBasicAuction = {
    $$type: 'CreateBasicAuction';
    name: string;
    description: string;
    minimal_amount: bigint;
    ends_at: bigint;
    secret_id: Cell;
    type: string;
}

export function storeCreateBasicAuction(src: CreateBasicAuction) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1155575886, 32);
        b_0.storeStringRefTail(src.name);
        b_0.storeStringRefTail(src.description);
        b_0.storeInt(src.minimal_amount, 257);
        b_0.storeUint(src.ends_at, 64);
        const b_1 = new Builder();
        b_1.storeRef(src.secret_id);
        b_1.storeStringRefTail(src.type);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadCreateBasicAuction(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1155575886) { throw Error('Invalid prefix'); }
    const _name = sc_0.loadStringRefTail();
    const _description = sc_0.loadStringRefTail();
    const _minimal_amount = sc_0.loadIntBig(257);
    const _ends_at = sc_0.loadUintBig(64);
    const sc_1 = sc_0.loadRef().beginParse();
    const _secret_id = sc_1.loadRef();
    const _type = sc_1.loadStringRefTail();
    return { $$type: 'CreateBasicAuction' as const, name: _name, description: _description, minimal_amount: _minimal_amount, ends_at: _ends_at, secret_id: _secret_id, type: _type };
}

function loadTupleCreateBasicAuction(source: TupleReader) {
    const _name = source.readString();
    const _description = source.readString();
    const _minimal_amount = source.readBigNumber();
    const _ends_at = source.readBigNumber();
    const _secret_id = source.readCell();
    const _type = source.readString();
    return { $$type: 'CreateBasicAuction' as const, name: _name, description: _description, minimal_amount: _minimal_amount, ends_at: _ends_at, secret_id: _secret_id, type: _type };
}

function loadGetterTupleCreateBasicAuction(source: TupleReader) {
    const _name = source.readString();
    const _description = source.readString();
    const _minimal_amount = source.readBigNumber();
    const _ends_at = source.readBigNumber();
    const _secret_id = source.readCell();
    const _type = source.readString();
    return { $$type: 'CreateBasicAuction' as const, name: _name, description: _description, minimal_amount: _minimal_amount, ends_at: _ends_at, secret_id: _secret_id, type: _type };
}

function storeTupleCreateBasicAuction(source: CreateBasicAuction) {
    const builder = new TupleBuilder();
    builder.writeString(source.name);
    builder.writeString(source.description);
    builder.writeNumber(source.minimal_amount);
    builder.writeNumber(source.ends_at);
    builder.writeCell(source.secret_id);
    builder.writeString(source.type);
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

export type Winner = {
    $$type: 'Winner';
    address: Address;
    amount: bigint;
    secret_id: Cell;
}

export function storeWinner(src: Winner) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.address);
        b_0.storeUint(src.amount, 128);
        b_0.storeRef(src.secret_id);
    };
}

export function loadWinner(slice: Slice) {
    const sc_0 = slice;
    const _address = sc_0.loadAddress();
    const _amount = sc_0.loadUintBig(128);
    const _secret_id = sc_0.loadRef();
    return { $$type: 'Winner' as const, address: _address, amount: _amount, secret_id: _secret_id };
}

function loadTupleWinner(source: TupleReader) {
    const _address = source.readAddress();
    const _amount = source.readBigNumber();
    const _secret_id = source.readCell();
    return { $$type: 'Winner' as const, address: _address, amount: _amount, secret_id: _secret_id };
}

function loadGetterTupleWinner(source: TupleReader) {
    const _address = source.readAddress();
    const _amount = source.readBigNumber();
    const _secret_id = source.readCell();
    return { $$type: 'Winner' as const, address: _address, amount: _amount, secret_id: _secret_id };
}

function storeTupleWinner(source: Winner) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.address);
    builder.writeNumber(source.amount);
    builder.writeCell(source.secret_id);
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

export type BasicAuctionInit = {
    $$type: 'BasicAuctionInit';
    owner_account: Address;
    collector: Address;
    ends_at: bigint;
    name: string;
}

export function storeBasicAuctionInit(src: BasicAuctionInit) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner_account);
        b_0.storeAddress(src.collector);
        b_0.storeInt(src.ends_at, 257);
        b_0.storeStringRefTail(src.name);
    };
}

export function loadBasicAuctionInit(slice: Slice) {
    const sc_0 = slice;
    const _owner_account = sc_0.loadAddress();
    const _collector = sc_0.loadAddress();
    const _ends_at = sc_0.loadIntBig(257);
    const _name = sc_0.loadStringRefTail();
    return { $$type: 'BasicAuctionInit' as const, owner_account: _owner_account, collector: _collector, ends_at: _ends_at, name: _name };
}

function loadTupleBasicAuctionInit(source: TupleReader) {
    const _owner_account = source.readAddress();
    const _collector = source.readAddress();
    const _ends_at = source.readBigNumber();
    const _name = source.readString();
    return { $$type: 'BasicAuctionInit' as const, owner_account: _owner_account, collector: _collector, ends_at: _ends_at, name: _name };
}

function loadGetterTupleBasicAuctionInit(source: TupleReader) {
    const _owner_account = source.readAddress();
    const _collector = source.readAddress();
    const _ends_at = source.readBigNumber();
    const _name = source.readString();
    return { $$type: 'BasicAuctionInit' as const, owner_account: _owner_account, collector: _collector, ends_at: _ends_at, name: _name };
}

function storeTupleBasicAuctionInit(source: BasicAuctionInit) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner_account);
    builder.writeAddress(source.collector);
    builder.writeNumber(source.ends_at);
    builder.writeString(source.name);
    return builder.build();
}

function dictValueParserBasicAuctionInit(): DictionaryValue<BasicAuctionInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBasicAuctionInit(src)).endCell());
        },
        parse: (src) => {
            return loadBasicAuctionInit(src.loadRef().beginParse());
        }
    }
}

export type BasicAuctionData = {
    $$type: 'BasicAuctionData';
    owner: Address | null;
    collector: Address;
    type: string;
    name: string;
    description: string;
    owner_account: Address;
    owner_secret_id: Cell;
    minimal_amount: bigint;
    ends_at: bigint;
    ended: boolean;
    refund: boolean;
    balance: bigint | null;
    minimal_raise: bigint;
    winner: Winner | null;
}

export function storeBasicAuctionData(src: BasicAuctionData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.collector);
        b_0.storeStringRefTail(src.type);
        b_0.storeStringRefTail(src.name);
        const b_1 = new Builder();
        b_1.storeStringRefTail(src.description);
        b_1.storeAddress(src.owner_account);
        b_1.storeRef(src.owner_secret_id);
        b_1.storeInt(src.minimal_amount, 257);
        b_1.storeInt(src.ends_at, 257);
        b_1.storeBit(src.ended);
        b_1.storeBit(src.refund);
        const b_2 = new Builder();
        if (src.balance !== null && src.balance !== undefined) { b_2.storeBit(true).storeInt(src.balance, 257); } else { b_2.storeBit(false); }
        b_2.storeInt(src.minimal_raise, 257);
        if (src.winner !== null && src.winner !== undefined) { b_2.storeBit(true); b_2.store(storeWinner(src.winner)); } else { b_2.storeBit(false); }
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadBasicAuctionData(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadMaybeAddress();
    const _collector = sc_0.loadAddress();
    const _type = sc_0.loadStringRefTail();
    const _name = sc_0.loadStringRefTail();
    const sc_1 = sc_0.loadRef().beginParse();
    const _description = sc_1.loadStringRefTail();
    const _owner_account = sc_1.loadAddress();
    const _owner_secret_id = sc_1.loadRef();
    const _minimal_amount = sc_1.loadIntBig(257);
    const _ends_at = sc_1.loadIntBig(257);
    const _ended = sc_1.loadBit();
    const _refund = sc_1.loadBit();
    const sc_2 = sc_1.loadRef().beginParse();
    const _balance = sc_2.loadBit() ? sc_2.loadIntBig(257) : null;
    const _minimal_raise = sc_2.loadIntBig(257);
    const _winner = sc_2.loadBit() ? loadWinner(sc_2) : null;
    return { $$type: 'BasicAuctionData' as const, owner: _owner, collector: _collector, type: _type, name: _name, description: _description, owner_account: _owner_account, owner_secret_id: _owner_secret_id, minimal_amount: _minimal_amount, ends_at: _ends_at, ended: _ended, refund: _refund, balance: _balance, minimal_raise: _minimal_raise, winner: _winner };
}

function loadTupleBasicAuctionData(source: TupleReader) {
    const _owner = source.readAddressOpt();
    const _collector = source.readAddress();
    const _type = source.readString();
    const _name = source.readString();
    const _description = source.readString();
    const _owner_account = source.readAddress();
    const _owner_secret_id = source.readCell();
    const _minimal_amount = source.readBigNumber();
    const _ends_at = source.readBigNumber();
    const _ended = source.readBoolean();
    const _refund = source.readBoolean();
    const _balance = source.readBigNumberOpt();
    const _minimal_raise = source.readBigNumber();
    const _winner_p = source.readTupleOpt();
    const _winner = _winner_p ? loadTupleWinner(_winner_p) : null;
    return { $$type: 'BasicAuctionData' as const, owner: _owner, collector: _collector, type: _type, name: _name, description: _description, owner_account: _owner_account, owner_secret_id: _owner_secret_id, minimal_amount: _minimal_amount, ends_at: _ends_at, ended: _ended, refund: _refund, balance: _balance, minimal_raise: _minimal_raise, winner: _winner };
}

function loadGetterTupleBasicAuctionData(source: TupleReader) {
    const _owner = source.readAddressOpt();
    const _collector = source.readAddress();
    const _type = source.readString();
    const _name = source.readString();
    const _description = source.readString();
    const _owner_account = source.readAddress();
    const _owner_secret_id = source.readCell();
    const _minimal_amount = source.readBigNumber();
    const _ends_at = source.readBigNumber();
    const _ended = source.readBoolean();
    const _refund = source.readBoolean();
    const _balance = source.readBigNumberOpt();
    const _minimal_raise = source.readBigNumber();
    const _winner_p = source.readTupleOpt();
    const _winner = _winner_p ? loadTupleWinner(_winner_p) : null;
    return { $$type: 'BasicAuctionData' as const, owner: _owner, collector: _collector, type: _type, name: _name, description: _description, owner_account: _owner_account, owner_secret_id: _owner_secret_id, minimal_amount: _minimal_amount, ends_at: _ends_at, ended: _ended, refund: _refund, balance: _balance, minimal_raise: _minimal_raise, winner: _winner };
}

function storeTupleBasicAuctionData(source: BasicAuctionData) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeAddress(source.collector);
    builder.writeString(source.type);
    builder.writeString(source.name);
    builder.writeString(source.description);
    builder.writeAddress(source.owner_account);
    builder.writeCell(source.owner_secret_id);
    builder.writeNumber(source.minimal_amount);
    builder.writeNumber(source.ends_at);
    builder.writeBoolean(source.ended);
    builder.writeBoolean(source.refund);
    builder.writeNumber(source.balance);
    builder.writeNumber(source.minimal_raise);
    if (source.winner !== null && source.winner !== undefined) {
        builder.writeTuple(storeTupleWinner(source.winner));
    } else {
        builder.writeTuple(null);
    }
    return builder.build();
}

function dictValueParserBasicAuctionData(): DictionaryValue<BasicAuctionData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBasicAuctionData(src)).endCell());
        },
        parse: (src) => {
            return loadBasicAuctionData(src.loadRef().beginParse());
        }
    }
}

export type BasicAuction$Data = {
    $$type: 'BasicAuction$Data';
    owner: Address | null;
    collector: Address;
    owner_account: Address;
    name: string;
    ends_at: bigint;
    description: string;
    owner_secret_id: Cell;
    minimal_amount: bigint;
    ended: boolean;
    refund: boolean;
    type: string;
    minimal_raise: bigint;
    winner: Winner | null;
    initialised: boolean;
}

export function storeBasicAuction$Data(src: BasicAuction$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.collector);
        b_0.storeAddress(src.owner_account);
        b_0.storeStringRefTail(src.name);
        const b_1 = new Builder();
        b_1.storeInt(src.ends_at, 257);
        b_1.storeStringRefTail(src.description);
        b_1.storeRef(src.owner_secret_id);
        b_1.storeInt(src.minimal_amount, 257);
        b_1.storeBit(src.ended);
        b_1.storeBit(src.refund);
        b_1.storeStringRefTail(src.type);
        b_1.storeInt(src.minimal_raise, 257);
        const b_2 = new Builder();
        if (src.winner !== null && src.winner !== undefined) { b_2.storeBit(true); b_2.store(storeWinner(src.winner)); } else { b_2.storeBit(false); }
        b_2.storeBit(src.initialised);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadBasicAuction$Data(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadMaybeAddress();
    const _collector = sc_0.loadAddress();
    const _owner_account = sc_0.loadAddress();
    const _name = sc_0.loadStringRefTail();
    const sc_1 = sc_0.loadRef().beginParse();
    const _ends_at = sc_1.loadIntBig(257);
    const _description = sc_1.loadStringRefTail();
    const _owner_secret_id = sc_1.loadRef();
    const _minimal_amount = sc_1.loadIntBig(257);
    const _ended = sc_1.loadBit();
    const _refund = sc_1.loadBit();
    const _type = sc_1.loadStringRefTail();
    const _minimal_raise = sc_1.loadIntBig(257);
    const sc_2 = sc_1.loadRef().beginParse();
    const _winner = sc_2.loadBit() ? loadWinner(sc_2) : null;
    const _initialised = sc_2.loadBit();
    return { $$type: 'BasicAuction$Data' as const, owner: _owner, collector: _collector, owner_account: _owner_account, name: _name, ends_at: _ends_at, description: _description, owner_secret_id: _owner_secret_id, minimal_amount: _minimal_amount, ended: _ended, refund: _refund, type: _type, minimal_raise: _minimal_raise, winner: _winner, initialised: _initialised };
}

function loadTupleBasicAuction$Data(source: TupleReader) {
    const _owner = source.readAddressOpt();
    const _collector = source.readAddress();
    const _owner_account = source.readAddress();
    const _name = source.readString();
    const _ends_at = source.readBigNumber();
    const _description = source.readString();
    const _owner_secret_id = source.readCell();
    const _minimal_amount = source.readBigNumber();
    const _ended = source.readBoolean();
    const _refund = source.readBoolean();
    const _type = source.readString();
    const _minimal_raise = source.readBigNumber();
    const _winner_p = source.readTupleOpt();
    const _winner = _winner_p ? loadTupleWinner(_winner_p) : null;
    const _initialised = source.readBoolean();
    return { $$type: 'BasicAuction$Data' as const, owner: _owner, collector: _collector, owner_account: _owner_account, name: _name, ends_at: _ends_at, description: _description, owner_secret_id: _owner_secret_id, minimal_amount: _minimal_amount, ended: _ended, refund: _refund, type: _type, minimal_raise: _minimal_raise, winner: _winner, initialised: _initialised };
}

function loadGetterTupleBasicAuction$Data(source: TupleReader) {
    const _owner = source.readAddressOpt();
    const _collector = source.readAddress();
    const _owner_account = source.readAddress();
    const _name = source.readString();
    const _ends_at = source.readBigNumber();
    const _description = source.readString();
    const _owner_secret_id = source.readCell();
    const _minimal_amount = source.readBigNumber();
    const _ended = source.readBoolean();
    const _refund = source.readBoolean();
    const _type = source.readString();
    const _minimal_raise = source.readBigNumber();
    const _winner_p = source.readTupleOpt();
    const _winner = _winner_p ? loadTupleWinner(_winner_p) : null;
    const _initialised = source.readBoolean();
    return { $$type: 'BasicAuction$Data' as const, owner: _owner, collector: _collector, owner_account: _owner_account, name: _name, ends_at: _ends_at, description: _description, owner_secret_id: _owner_secret_id, minimal_amount: _minimal_amount, ended: _ended, refund: _refund, type: _type, minimal_raise: _minimal_raise, winner: _winner, initialised: _initialised };
}

function storeTupleBasicAuction$Data(source: BasicAuction$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeAddress(source.collector);
    builder.writeAddress(source.owner_account);
    builder.writeString(source.name);
    builder.writeNumber(source.ends_at);
    builder.writeString(source.description);
    builder.writeCell(source.owner_secret_id);
    builder.writeNumber(source.minimal_amount);
    builder.writeBoolean(source.ended);
    builder.writeBoolean(source.refund);
    builder.writeString(source.type);
    builder.writeNumber(source.minimal_raise);
    if (source.winner !== null && source.winner !== undefined) {
        builder.writeTuple(storeTupleWinner(source.winner));
    } else {
        builder.writeTuple(null);
    }
    builder.writeBoolean(source.initialised);
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

export type AuctionOutbiddedEvent = {
    $$type: 'AuctionOutbiddedEvent';
    address: Address;
    owner_secret_id: Cell;
    old_winner_secret_id: Cell;
    new_winner_secret_id: Cell;
    amount: bigint;
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

export function loadAuctionOutbiddedEvent(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 11184641) { throw Error('Invalid prefix'); }
    const _address = sc_0.loadAddress();
    const _owner_secret_id = sc_0.loadRef();
    const _old_winner_secret_id = sc_0.loadRef();
    const _new_winner_secret_id = sc_0.loadRef();
    const _amount = sc_0.loadIntBig(257);
    return { $$type: 'AuctionOutbiddedEvent' as const, address: _address, owner_secret_id: _owner_secret_id, old_winner_secret_id: _old_winner_secret_id, new_winner_secret_id: _new_winner_secret_id, amount: _amount };
}

function loadTupleAuctionOutbiddedEvent(source: TupleReader) {
    const _address = source.readAddress();
    const _owner_secret_id = source.readCell();
    const _old_winner_secret_id = source.readCell();
    const _new_winner_secret_id = source.readCell();
    const _amount = source.readBigNumber();
    return { $$type: 'AuctionOutbiddedEvent' as const, address: _address, owner_secret_id: _owner_secret_id, old_winner_secret_id: _old_winner_secret_id, new_winner_secret_id: _new_winner_secret_id, amount: _amount };
}

function loadGetterTupleAuctionOutbiddedEvent(source: TupleReader) {
    const _address = source.readAddress();
    const _owner_secret_id = source.readCell();
    const _old_winner_secret_id = source.readCell();
    const _new_winner_secret_id = source.readCell();
    const _amount = source.readBigNumber();
    return { $$type: 'AuctionOutbiddedEvent' as const, address: _address, owner_secret_id: _owner_secret_id, old_winner_secret_id: _old_winner_secret_id, new_winner_secret_id: _new_winner_secret_id, amount: _amount };
}

function storeTupleAuctionOutbiddedEvent(source: AuctionOutbiddedEvent) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.address);
    builder.writeCell(source.owner_secret_id);
    builder.writeCell(source.old_winner_secret_id);
    builder.writeCell(source.new_winner_secret_id);
    builder.writeNumber(source.amount);
    return builder.build();
}

function dictValueParserAuctionOutbiddedEvent(): DictionaryValue<AuctionOutbiddedEvent> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAuctionOutbiddedEvent(src)).endCell());
        },
        parse: (src) => {
            return loadAuctionOutbiddedEvent(src.loadRef().beginParse());
        }
    }
}

export type AuctionResolvedEvent = {
    $$type: 'AuctionResolvedEvent';
    address: Address;
    owner_secret_id: Cell;
    winner_secret_id: Cell | null;
}

export function storeAuctionResolvedEvent(src: AuctionResolvedEvent) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(11184642, 32);
        b_0.storeAddress(src.address);
        b_0.storeRef(src.owner_secret_id);
        if (src.winner_secret_id !== null && src.winner_secret_id !== undefined) { b_0.storeBit(true).storeRef(src.winner_secret_id); } else { b_0.storeBit(false); }
    };
}

export function loadAuctionResolvedEvent(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 11184642) { throw Error('Invalid prefix'); }
    const _address = sc_0.loadAddress();
    const _owner_secret_id = sc_0.loadRef();
    const _winner_secret_id = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'AuctionResolvedEvent' as const, address: _address, owner_secret_id: _owner_secret_id, winner_secret_id: _winner_secret_id };
}

function loadTupleAuctionResolvedEvent(source: TupleReader) {
    const _address = source.readAddress();
    const _owner_secret_id = source.readCell();
    const _winner_secret_id = source.readCellOpt();
    return { $$type: 'AuctionResolvedEvent' as const, address: _address, owner_secret_id: _owner_secret_id, winner_secret_id: _winner_secret_id };
}

function loadGetterTupleAuctionResolvedEvent(source: TupleReader) {
    const _address = source.readAddress();
    const _owner_secret_id = source.readCell();
    const _winner_secret_id = source.readCellOpt();
    return { $$type: 'AuctionResolvedEvent' as const, address: _address, owner_secret_id: _owner_secret_id, winner_secret_id: _winner_secret_id };
}

function storeTupleAuctionResolvedEvent(source: AuctionResolvedEvent) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.address);
    builder.writeCell(source.owner_secret_id);
    builder.writeCell(source.winner_secret_id);
    return builder.build();
}

function dictValueParserAuctionResolvedEvent(): DictionaryValue<AuctionResolvedEvent> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAuctionResolvedEvent(src)).endCell());
        },
        parse: (src) => {
            return loadAuctionResolvedEvent(src.loadRef().beginParse());
        }
    }
}

export type AuctionCreatedEvent = {
    $$type: 'AuctionCreatedEvent';
    name: string;
    address: Address;
    owner_secret_id: Cell;
    ends_at: bigint;
}

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
    if (sc_0.loadUint(32) !== 11184643) { throw Error('Invalid prefix'); }
    const _name = sc_0.loadStringRefTail();
    const _address = sc_0.loadAddress();
    const _owner_secret_id = sc_0.loadRef();
    const _ends_at = sc_0.loadIntBig(257);
    return { $$type: 'AuctionCreatedEvent' as const, name: _name, address: _address, owner_secret_id: _owner_secret_id, ends_at: _ends_at };
}

function loadTupleAuctionCreatedEvent(source: TupleReader) {
    const _name = source.readString();
    const _address = source.readAddress();
    const _owner_secret_id = source.readCell();
    const _ends_at = source.readBigNumber();
    return { $$type: 'AuctionCreatedEvent' as const, name: _name, address: _address, owner_secret_id: _owner_secret_id, ends_at: _ends_at };
}

function loadGetterTupleAuctionCreatedEvent(source: TupleReader) {
    const _name = source.readString();
    const _address = source.readAddress();
    const _owner_secret_id = source.readCell();
    const _ends_at = source.readBigNumber();
    return { $$type: 'AuctionCreatedEvent' as const, name: _name, address: _address, owner_secret_id: _owner_secret_id, ends_at: _ends_at };
}

function storeTupleAuctionCreatedEvent(source: AuctionCreatedEvent) {
    const builder = new TupleBuilder();
    builder.writeString(source.name);
    builder.writeAddress(source.address);
    builder.writeCell(source.owner_secret_id);
    builder.writeNumber(source.ends_at);
    return builder.build();
}

function dictValueParserAuctionCreatedEvent(): DictionaryValue<AuctionCreatedEvent> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAuctionCreatedEvent(src)).endCell());
        },
        parse: (src) => {
            return loadAuctionCreatedEvent(src.loadRef().beginParse());
        }
    }
}

export type Bid = {
    $$type: 'Bid';
    secret_id: Cell;
}

export function storeBid(src: Bid) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3882037785, 32);
        b_0.storeRef(src.secret_id);
    };
}

export function loadBid(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3882037785) { throw Error('Invalid prefix'); }
    const _secret_id = sc_0.loadRef();
    return { $$type: 'Bid' as const, secret_id: _secret_id };
}

function loadTupleBid(source: TupleReader) {
    const _secret_id = source.readCell();
    return { $$type: 'Bid' as const, secret_id: _secret_id };
}

function loadGetterTupleBid(source: TupleReader) {
    const _secret_id = source.readCell();
    return { $$type: 'Bid' as const, secret_id: _secret_id };
}

function storeTupleBid(source: Bid) {
    const builder = new TupleBuilder();
    builder.writeCell(source.secret_id);
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

export type BasicAuctionInitialise = {
    $$type: 'BasicAuctionInitialise';
    description: string;
    owner: Address;
    owner_secret_id: Cell;
    minimal_amount: bigint;
    type: string;
}

export function storeBasicAuctionInitialise(src: BasicAuctionInitialise) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3068979468, 32);
        b_0.storeStringRefTail(src.description);
        b_0.storeAddress(src.owner);
        b_0.storeRef(src.owner_secret_id);
        b_0.storeInt(src.minimal_amount, 257);
        b_0.storeStringRefTail(src.type);
    };
}

export function loadBasicAuctionInitialise(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3068979468) { throw Error('Invalid prefix'); }
    const _description = sc_0.loadStringRefTail();
    const _owner = sc_0.loadAddress();
    const _owner_secret_id = sc_0.loadRef();
    const _minimal_amount = sc_0.loadIntBig(257);
    const _type = sc_0.loadStringRefTail();
    return { $$type: 'BasicAuctionInitialise' as const, description: _description, owner: _owner, owner_secret_id: _owner_secret_id, minimal_amount: _minimal_amount, type: _type };
}

function loadTupleBasicAuctionInitialise(source: TupleReader) {
    const _description = source.readString();
    const _owner = source.readAddress();
    const _owner_secret_id = source.readCell();
    const _minimal_amount = source.readBigNumber();
    const _type = source.readString();
    return { $$type: 'BasicAuctionInitialise' as const, description: _description, owner: _owner, owner_secret_id: _owner_secret_id, minimal_amount: _minimal_amount, type: _type };
}

function loadGetterTupleBasicAuctionInitialise(source: TupleReader) {
    const _description = source.readString();
    const _owner = source.readAddress();
    const _owner_secret_id = source.readCell();
    const _minimal_amount = source.readBigNumber();
    const _type = source.readString();
    return { $$type: 'BasicAuctionInitialise' as const, description: _description, owner: _owner, owner_secret_id: _owner_secret_id, minimal_amount: _minimal_amount, type: _type };
}

function storeTupleBasicAuctionInitialise(source: BasicAuctionInitialise) {
    const builder = new TupleBuilder();
    builder.writeString(source.description);
    builder.writeAddress(source.owner);
    builder.writeCell(source.owner_secret_id);
    builder.writeNumber(source.minimal_amount);
    builder.writeString(source.type);
    return builder.build();
}

function dictValueParserBasicAuctionInitialise(): DictionaryValue<BasicAuctionInitialise> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBasicAuctionInitialise(src)).endCell());
        },
        parse: (src) => {
            return loadBasicAuctionInitialise(src.loadRef().beginParse());
        }
    }
}

export type Controller$Data = {
    $$type: 'Controller$Data';
    owner1: Address;
    owner2: Address;
    service_comission: bigint;
    referral_comission: bigint;
}

export function storeController$Data(src: Controller$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner1);
        b_0.storeAddress(src.owner2);
        b_0.storeUint(src.service_comission, 16);
        b_0.storeUint(src.referral_comission, 16);
    };
}

export function loadController$Data(slice: Slice) {
    const sc_0 = slice;
    const _owner1 = sc_0.loadAddress();
    const _owner2 = sc_0.loadAddress();
    const _service_comission = sc_0.loadUintBig(16);
    const _referral_comission = sc_0.loadUintBig(16);
    return { $$type: 'Controller$Data' as const, owner1: _owner1, owner2: _owner2, service_comission: _service_comission, referral_comission: _referral_comission };
}

function loadTupleController$Data(source: TupleReader) {
    const _owner1 = source.readAddress();
    const _owner2 = source.readAddress();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    return { $$type: 'Controller$Data' as const, owner1: _owner1, owner2: _owner2, service_comission: _service_comission, referral_comission: _referral_comission };
}

function loadGetterTupleController$Data(source: TupleReader) {
    const _owner1 = source.readAddress();
    const _owner2 = source.readAddress();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    return { $$type: 'Controller$Data' as const, owner1: _owner1, owner2: _owner2, service_comission: _service_comission, referral_comission: _referral_comission };
}

function storeTupleController$Data(source: Controller$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner1);
    builder.writeAddress(source.owner2);
    builder.writeNumber(source.service_comission);
    builder.writeNumber(source.referral_comission);
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

 type BasicAuction_init_args = {
    $$type: 'BasicAuction_init_args';
    data: BasicAuctionInit;
}

function initBasicAuction_init_args(src: BasicAuction_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.store(storeBasicAuctionInit(src.data));
    };
}

async function BasicAuction_init(data: BasicAuctionInit) {
    const __code = Cell.fromHex('b5ee9c724102140100057f000114ff00f4a413f4bcf2c80b01020120020c020148030a04e2d001d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018eaafa40fa40810101d700d401d014433004d155026d8b0882103b9aca0070708b08706d7088109d109b5560e30d0f925f0fe0702ed74920c21f95310ed31f0fde218210b6ece90cbae302218210164a11f1ba0d0e040501a25b3234343409d401d001fa40d4810101d700d401d01514433035f84252b0c705f2e0c82e8e1810ce5f0e206ef2d0808010c8cb05ce70cf0b6ec98042fb00e03c1d10ac109b108a1079481745164444db3c1204fe8ee75b3df8422c206ef2d08021c70592307f9452b0c705e2f2e0ce03b3922b6e9170e2f2e0d17f83067070c801821099d782f658cb1fca00c92c597013c8cf8580ca00cf8440ce01fa02806acf40f400c901fb0010bd10ac109b108a1079106810571046443512db3ce0218210e7633219bae3023f208210ec533ec0bae3021206080902ba10235f030cd4013123b3f2e0d0f8235280bcf2e0cbf8416f2430325316bef2e0c92e6eb3913ee30d40dd126f0320206ef2d0806f233031a7058064a90482101dcd650001b60910bd10ac109b108a10791068105710461035401403db3c071200fc0e206ef2d0806f235331bcf2e0c921a7058064a90482101dcd650001b6095220a05240bcf2e0ca705a6d027fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb00f82854639024444013c855408208aaaa015006cb1f5004cf1612cccccc810101cf00c9c88258c000000000000000000000000101cb67ccc970fb00022e303d23b3f2e0d0f8235280b9f2e0d210bd551adb3cdb3c101201d6c0000ec1211eb08edcf84253c0216e925b7092c705e292307f9452a0c705e2f2e0cef8285469712ac855308208aaaa035005cb1fc85004cf16c95003cc01cf16cc810101cf00c9c88258c000000000000000000000000101cb67ccc970fb0010bd551adb3ce05f0ef2c082120375a10ec5da89a1a400031d55f481f481020203ae01a803a028866009a2aa04db1611042077359400e0e11610e0dae110213a2136aac1c61bb678d9dd0d0e0b0062f8276f108b562617369638546eb05469e0546c905612015616015615015612015610511e105d1b106a1910485e334550130396f2ed44d0d200018eaafa40fa40810101d700d401d014433004d155026d8b0882103b9aca0070708b08706d7088109d109b5560e30d0ed70d1ff2e082308210ec533ec0bae3025f0ef2c0820d0e0f000000b220d70b01c30093fa40019472d7216de201fa40fa40d401d001d401d0810101d700d401d001d4810101d700d200d200d401d001810101d700d430d0d2000199fa40d37fd455206f03916de201d2003010ae10ad10ac10ab6c1e022a24b3f2e0d0f8235290b9f2e0d2f800550cdb3cdb3c101201ec357f216e8e6c34f828276dc855208208aaaa025004cb1f58cf16cc216eb3957f01ca00cc947032ca00e2c9c88258c000000000000000000000000101cb67ccc970fb007f8100a0707fc801821099d782f658cb1fca00c92e59027fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb00e30e04051100ec21206ef2d0806f2332f8285420a3c855208208aaaa025004cb1f58cf16cc216eb3957f01ca00cc947032ca00e2c9c88258c000000000000000000000000101cb67ccc970fb008100a07002c80182107992365a58cb1fcb7fc9544e33027fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb0004010ec87f01ca0055d01300f050ed206e95307001cb0192cf16e2500bcf165009cf16c85008cf16c95007cc05c8810101cf00c85005cf16c95004cc12cc810101cf00ca0012ca00c85003cf16c958cc12810101cf00c8246eb38e157f01ca0004206ef2d0806f2310365acf1612cb7fcc9634705004ca00e212ca00c958ccc901ccc9ed5421a34574');
    const builder = beginCell();
    builder.storeUint(0, 1);
    initBasicAuction_init_args({ $$type: 'BasicAuction_init_args', data })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export const BasicAuction_errors = {
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

export const BasicAuction_errors_backward = {
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

const BasicAuction_types: ABIType[] = [
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
    {"name":"CreateAccount","header":878580077,"fields":[{"name":"secret_id","type":{"kind":"simple","type":"cell","optional":false}},{"name":"referree","type":{"kind":"simple","type":"address","optional":true}}]},
    {"name":"AccountCreated","header":3905897037,"fields":[]},
    {"name":"ConfigureService","header":1770454153,"fields":[{"name":"service_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"referral_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
    {"name":"ConfigureAccount","header":2001958088,"fields":[{"name":"address","type":{"kind":"simple","type":"address","optional":false}},{"name":"service_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"referral_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"max_allowance","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
    {"name":"CleanInitialiser","header":2553827134,"fields":[{"name":"address","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"RequestInitialisation","header":3393990837,"fields":[]},
    {"name":"CollectMoneys","header":707278593,"fields":[]},
    {"name":"AuctionConfig","header":null,"fields":[{"name":"name","type":{"kind":"simple","type":"string","optional":false}},{"name":"description","type":{"kind":"simple","type":"string","optional":false}},{"name":"address","type":{"kind":"simple","type":"address","optional":false}},{"name":"type","type":{"kind":"simple","type":"string","optional":false}},{"name":"ends_at","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"minimal_amount","type":{"kind":"simple","type":"uint","optional":false,"format":128}},{"name":"ended","type":{"kind":"simple","type":"bool","optional":false}},{"name":"refund","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"AccountInit","header":null,"fields":[{"name":"collector","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"AccountData","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"version","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"referree","type":{"kind":"simple","type":"address","optional":true}},{"name":"service_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"referral_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"max_allowance","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"allowance","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"initialised","type":{"kind":"simple","type":"bool","optional":false}},{"name":"secret_id","type":{"kind":"simple","type":"cell","optional":false}},{"name":"balance","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"auctions","type":{"kind":"dict","key":"address","value":"AuctionConfig","valueFormat":"ref"}}]},
    {"name":"Account$Data","header":null,"fields":[{"name":"collector","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"referree","type":{"kind":"simple","type":"address","optional":true}},{"name":"service_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"referral_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"auctions","type":{"kind":"dict","key":"address","value":"AuctionConfig","valueFormat":"ref"}},{"name":"max_allowance","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"allowance","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"initialised","type":{"kind":"simple","type":"bool","optional":false}},{"name":"secret_id","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"AccountDelete","header":1792346535,"fields":[]},
    {"name":"ReferralCommission","header":3733998990,"fields":[]},
    {"name":"Collect","header":1729135813,"fields":[]},
    {"name":"AccountInitialisedEvent","header":11323904,"fields":[{"name":"address","type":{"kind":"simple","type":"address","optional":false}},{"name":"secret_id","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"ProfitReceivedEvent","header":11323905,"fields":[{"name":"address","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"secret_id","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Profit","header":2039625306,"fields":[{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":128}}]},
    {"name":"AuctionDeleted","header":2581037814,"fields":[{"name":"refund","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"AccountInitialise","header":2387891835,"fields":[{"name":"referree","type":{"kind":"simple","type":"address","optional":true}},{"name":"service_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"referral_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"max_allowance","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"secret_id","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"CreateBasicAuction","header":1155575886,"fields":[{"name":"name","type":{"kind":"simple","type":"string","optional":false}},{"name":"description","type":{"kind":"simple","type":"string","optional":false}},{"name":"minimal_amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"ends_at","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"secret_id","type":{"kind":"simple","type":"cell","optional":false}},{"name":"type","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"CleanUp","header":2848052031,"fields":[]},
    {"name":"ServiceComission","header":265023355,"fields":[]},
    {"name":"Winner","header":null,"fields":[{"name":"address","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":128}},{"name":"secret_id","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"BasicAuctionInit","header":null,"fields":[{"name":"owner_account","type":{"kind":"simple","type":"address","optional":false}},{"name":"collector","type":{"kind":"simple","type":"address","optional":false}},{"name":"ends_at","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"name","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"BasicAuctionData","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":true}},{"name":"collector","type":{"kind":"simple","type":"address","optional":false}},{"name":"type","type":{"kind":"simple","type":"string","optional":false}},{"name":"name","type":{"kind":"simple","type":"string","optional":false}},{"name":"description","type":{"kind":"simple","type":"string","optional":false}},{"name":"owner_account","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner_secret_id","type":{"kind":"simple","type":"cell","optional":false}},{"name":"minimal_amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"ends_at","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"ended","type":{"kind":"simple","type":"bool","optional":false}},{"name":"refund","type":{"kind":"simple","type":"bool","optional":false}},{"name":"balance","type":{"kind":"simple","type":"int","optional":true,"format":257}},{"name":"minimal_raise","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"winner","type":{"kind":"simple","type":"Winner","optional":true}}]},
    {"name":"BasicAuction$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":true}},{"name":"collector","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner_account","type":{"kind":"simple","type":"address","optional":false}},{"name":"name","type":{"kind":"simple","type":"string","optional":false}},{"name":"ends_at","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"description","type":{"kind":"simple","type":"string","optional":false}},{"name":"owner_secret_id","type":{"kind":"simple","type":"cell","optional":false}},{"name":"minimal_amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"ended","type":{"kind":"simple","type":"bool","optional":false}},{"name":"refund","type":{"kind":"simple","type":"bool","optional":false}},{"name":"type","type":{"kind":"simple","type":"string","optional":false}},{"name":"minimal_raise","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"winner","type":{"kind":"simple","type":"Winner","optional":true}},{"name":"initialised","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"AuctionOutbiddedEvent","header":11184641,"fields":[{"name":"address","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner_secret_id","type":{"kind":"simple","type":"cell","optional":false}},{"name":"old_winner_secret_id","type":{"kind":"simple","type":"cell","optional":false}},{"name":"new_winner_secret_id","type":{"kind":"simple","type":"cell","optional":false}},{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"AuctionResolvedEvent","header":11184642,"fields":[{"name":"address","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner_secret_id","type":{"kind":"simple","type":"cell","optional":false}},{"name":"winner_secret_id","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"AuctionCreatedEvent","header":11184643,"fields":[{"name":"name","type":{"kind":"simple","type":"string","optional":false}},{"name":"address","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner_secret_id","type":{"kind":"simple","type":"cell","optional":false}},{"name":"ends_at","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"Bid","header":3882037785,"fields":[{"name":"secret_id","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Resolve","header":3964878528,"fields":[]},
    {"name":"Delete","header":373953009,"fields":[]},
    {"name":"BasicAuctionInitialise","header":3068979468,"fields":[{"name":"description","type":{"kind":"simple","type":"string","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner_secret_id","type":{"kind":"simple","type":"cell","optional":false}},{"name":"minimal_amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"type","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"Controller$Data","header":null,"fields":[{"name":"owner1","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner2","type":{"kind":"simple","type":"address","optional":false}},{"name":"service_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"referral_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
]

const BasicAuction_opcodes = {
    "ChangeOwner": 2174598809,
    "ChangeOwnerOk": 846932810,
    "CreateAccount": 878580077,
    "AccountCreated": 3905897037,
    "ConfigureService": 1770454153,
    "ConfigureAccount": 2001958088,
    "CleanInitialiser": 2553827134,
    "RequestInitialisation": 3393990837,
    "CollectMoneys": 707278593,
    "AccountDelete": 1792346535,
    "ReferralCommission": 3733998990,
    "Collect": 1729135813,
    "AccountInitialisedEvent": 11323904,
    "ProfitReceivedEvent": 11323905,
    "Profit": 2039625306,
    "AuctionDeleted": 2581037814,
    "AccountInitialise": 2387891835,
    "CreateBasicAuction": 1155575886,
    "CleanUp": 2848052031,
    "ServiceComission": 265023355,
    "AuctionOutbiddedEvent": 11184641,
    "AuctionResolvedEvent": 11184642,
    "AuctionCreatedEvent": 11184643,
    "Bid": 3882037785,
    "Resolve": 3964878528,
    "Delete": 373953009,
    "BasicAuctionInitialise": 3068979468,
}

const BasicAuction_getters: ABIGetter[] = [
    {"name":"data","methodId":100194,"arguments":[],"returnType":{"kind":"simple","type":"BasicAuctionData","optional":false}},
]

export const BasicAuction_getterMapping: { [key: string]: string } = {
    'data': 'getData',
}

const BasicAuction_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"BasicAuctionInitialise"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Delete"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Bid"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Resolve"}},
    {"receiver":"external","message":{"kind":"typed","type":"Resolve"}},
    {"receiver":"internal","message":{"kind":"empty"}},
]


export class BasicAuction implements Contract {
    
    public static readonly ERRORS_UNAUTHORISED = 201n;
    public static readonly ERRORS_BAD_AUCTION_TOO_SHORT = 202n;
    public static readonly ERRORS_BAD_AUCTION_TOO_LONG = 203n;
    public static readonly ERRORS_ACCOUNT_NOT_EXIST = 204n;
    public static readonly ERRORS_ACCOUNT_NOT_INITIALISED = 206n;
    public static readonly ERRORS_ACCOUNT_INITIALISED = 207n;
    public static readonly ERRORS_AUCTION_ADDRESS_MISMATCH = 205n;
    public static readonly ERRORS_AUCTION_ALREADY_EXISTS = 209n;
    public static readonly ERRORS_AUCTION_NOT_FOUND = 210n;
    public static readonly ERRORS_NOT_ENOUGH_ALLOWANCE = 208n;
    public static readonly MINIMAL_AUCTION_TIMESPAN = 18000n;
    public static readonly MAXIMAL_AUCTION_TIMESPAN = 2592000n;
    public static readonly storageReserve = 0n;
    public static readonly ERRORS_BID_IS_TOO_SMALL = 201n;
    public static readonly ERRORS_BID_RAISE_IS_TOO_SMALL = 202n;
    public static readonly ERRORS_FINISHED = 203n;
    public static readonly ERRORS_NOT_ALLOWED = 206n;
    public static readonly ERRORS_OWNER_BID_NOT_ALLOWED = 207n;
    public static readonly ERRORS_ENDED = 208n;
    public static readonly ERRORS_HAS_WINNER = 209n;
    public static readonly ERRORS_UNFINISHED = 210n;
    public static readonly MINIMAL_RAISE = 500000000n;
    public static readonly VERSION = 1n;
    public static readonly ERRORS_BAD_CONFIGURATION = 202n;
    public static readonly NOT_ENOUGH_FUNDS_TO_CREATE_ACCOUNT = 203n;
    public static readonly NOTHING_TO_COLLECT = 204n;
    public static readonly REGISTRATION_FEE = 100000000n;
    public static readonly COLLECT_THRESHOLD = 100000000n;
    public static readonly DEFAULT_ALLOWANCE = 10n;
    public static readonly errors = BasicAuction_errors_backward;
    public static readonly opcodes = BasicAuction_opcodes;
    
    static async init(data: BasicAuctionInit) {
        return await BasicAuction_init(data);
    }
    
    static async fromInit(data: BasicAuctionInit) {
        const __gen_init = await BasicAuction_init(data);
        const address = contractAddress(0, __gen_init);
        return new BasicAuction(address, __gen_init);
    }
    
    static fromAddress(address: Address) {
        return new BasicAuction(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  BasicAuction_types,
        getters: BasicAuction_getters,
        receivers: BasicAuction_receivers,
        errors: BasicAuction_errors,
    };
    
    constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: BasicAuctionInitialise | Delete | Bid | Resolve | null) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'BasicAuctionInitialise') {
            body = beginCell().store(storeBasicAuctionInitialise(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Delete') {
            body = beginCell().store(storeDelete(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Bid') {
            body = beginCell().store(storeBid(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Resolve') {
            body = beginCell().store(storeResolve(message)).endCell();
        }
        if (message === null) {
            body = new Cell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async sendExternal(provider: ContractProvider, message: Resolve) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Resolve') {
            body = beginCell().store(storeResolve(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.external(body);
        
    }
    
    async getData(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('data', builder.build())).stack;
        const result = loadGetterTupleBasicAuctionData(source);
        return result;
    }
    
}