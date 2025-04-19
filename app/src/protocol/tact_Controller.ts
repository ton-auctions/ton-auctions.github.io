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

export type AuctionConfig = {
    $$type: 'AuctionConfig';
    id: bigint;
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
        b_0.storeInt(src.id, 257);
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
    const _id = sc_0.loadIntBig(257);
    const _name = sc_0.loadStringRefTail();
    const _description = sc_0.loadStringRefTail();
    const _address = sc_0.loadAddress();
    const _type = sc_0.loadStringRefTail();
    const _ends_at = sc_0.loadUintBig(64);
    const _minimal_amount = sc_0.loadUintBig(128);
    const _ended = sc_0.loadBit();
    const _refund = sc_0.loadBit();
    return { $$type: 'AuctionConfig' as const, id: _id, name: _name, description: _description, address: _address, type: _type, ends_at: _ends_at, minimal_amount: _minimal_amount, ended: _ended, refund: _refund };
}

function loadTupleAuctionConfig(source: TupleReader) {
    const _id = source.readBigNumber();
    const _name = source.readString();
    const _description = source.readString();
    const _address = source.readAddress();
    const _type = source.readString();
    const _ends_at = source.readBigNumber();
    const _minimal_amount = source.readBigNumber();
    const _ended = source.readBoolean();
    const _refund = source.readBoolean();
    return { $$type: 'AuctionConfig' as const, id: _id, name: _name, description: _description, address: _address, type: _type, ends_at: _ends_at, minimal_amount: _minimal_amount, ended: _ended, refund: _refund };
}

function loadGetterTupleAuctionConfig(source: TupleReader) {
    const _id = source.readBigNumber();
    const _name = source.readString();
    const _description = source.readString();
    const _address = source.readAddress();
    const _type = source.readString();
    const _ends_at = source.readBigNumber();
    const _minimal_amount = source.readBigNumber();
    const _ended = source.readBoolean();
    const _refund = source.readBoolean();
    return { $$type: 'AuctionConfig' as const, id: _id, name: _name, description: _description, address: _address, type: _type, ends_at: _ends_at, minimal_amount: _minimal_amount, ended: _ended, refund: _refund };
}

function storeTupleAuctionConfig(source: AuctionConfig) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.id);
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

export type AccountData = {
    $$type: 'AccountData';
    collector: Address;
    version: bigint;
    balance: bigint | null;
    owner: Address;
    referree: Address | null;
    service_comission: bigint;
    referral_comission: bigint;
    auctions: Dictionary<bigint, AuctionConfig>;
    max_allowance: bigint;
    allowance: bigint;
    initialised: boolean;
    secret_id: Cell;
}

export function storeAccountData(src: AccountData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.collector);
        b_0.storeInt(src.version, 257);
        if (src.balance !== null && src.balance !== undefined) { b_0.storeBit(true).storeInt(src.balance, 257); } else { b_0.storeBit(false); }
        const b_1 = new Builder();
        b_1.storeAddress(src.owner);
        b_1.storeAddress(src.referree);
        b_1.storeUint(src.service_comission, 16);
        b_1.storeUint(src.referral_comission, 16);
        b_1.storeDict(src.auctions, Dictionary.Keys.BigInt(257), dictValueParserAuctionConfig());
        b_1.storeInt(src.max_allowance, 257);
        const b_2 = new Builder();
        b_2.storeInt(src.allowance, 257);
        b_2.storeBit(src.initialised);
        b_2.storeRef(src.secret_id);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadAccountData(slice: Slice) {
    const sc_0 = slice;
    const _collector = sc_0.loadAddress();
    const _version = sc_0.loadIntBig(257);
    const _balance = sc_0.loadBit() ? sc_0.loadIntBig(257) : null;
    const sc_1 = sc_0.loadRef().beginParse();
    const _owner = sc_1.loadAddress();
    const _referree = sc_1.loadMaybeAddress();
    const _service_comission = sc_1.loadUintBig(16);
    const _referral_comission = sc_1.loadUintBig(16);
    const _auctions = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserAuctionConfig(), sc_1);
    const _max_allowance = sc_1.loadIntBig(257);
    const sc_2 = sc_1.loadRef().beginParse();
    const _allowance = sc_2.loadIntBig(257);
    const _initialised = sc_2.loadBit();
    const _secret_id = sc_2.loadRef();
    return { $$type: 'AccountData' as const, collector: _collector, version: _version, balance: _balance, owner: _owner, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, auctions: _auctions, max_allowance: _max_allowance, allowance: _allowance, initialised: _initialised, secret_id: _secret_id };
}

function loadTupleAccountData(source: TupleReader) {
    const _collector = source.readAddress();
    const _version = source.readBigNumber();
    const _balance = source.readBigNumberOpt();
    const _owner = source.readAddress();
    const _referree = source.readAddressOpt();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _auctions = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserAuctionConfig(), source.readCellOpt());
    const _max_allowance = source.readBigNumber();
    const _allowance = source.readBigNumber();
    const _initialised = source.readBoolean();
    const _secret_id = source.readCell();
    return { $$type: 'AccountData' as const, collector: _collector, version: _version, balance: _balance, owner: _owner, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, auctions: _auctions, max_allowance: _max_allowance, allowance: _allowance, initialised: _initialised, secret_id: _secret_id };
}

function loadGetterTupleAccountData(source: TupleReader) {
    const _collector = source.readAddress();
    const _version = source.readBigNumber();
    const _balance = source.readBigNumberOpt();
    const _owner = source.readAddress();
    const _referree = source.readAddressOpt();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _auctions = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserAuctionConfig(), source.readCellOpt());
    const _max_allowance = source.readBigNumber();
    const _allowance = source.readBigNumber();
    const _initialised = source.readBoolean();
    const _secret_id = source.readCell();
    return { $$type: 'AccountData' as const, collector: _collector, version: _version, balance: _balance, owner: _owner, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, auctions: _auctions, max_allowance: _max_allowance, allowance: _allowance, initialised: _initialised, secret_id: _secret_id };
}

function storeTupleAccountData(source: AccountData) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.collector);
    builder.writeNumber(source.version);
    builder.writeNumber(source.balance);
    builder.writeAddress(source.owner);
    builder.writeAddress(source.referree);
    builder.writeNumber(source.service_comission);
    builder.writeNumber(source.referral_comission);
    builder.writeCell(source.auctions.size > 0 ? beginCell().storeDictDirect(source.auctions, Dictionary.Keys.BigInt(257), dictValueParserAuctionConfig()).endCell() : null);
    builder.writeNumber(source.max_allowance);
    builder.writeNumber(source.allowance);
    builder.writeBoolean(source.initialised);
    builder.writeCell(source.secret_id);
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
    data: AccountData;
}

export function storeAccount$Data(src: Account$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.store(storeAccountData(src.data));
    };
}

export function loadAccount$Data(slice: Slice) {
    const sc_0 = slice;
    const _data = loadAccountData(sc_0);
    return { $$type: 'Account$Data' as const, data: _data };
}

function loadTupleAccount$Data(source: TupleReader) {
    const _data = loadTupleAccountData(source);
    return { $$type: 'Account$Data' as const, data: _data };
}

function loadGetterTupleAccount$Data(source: TupleReader) {
    const _data = loadGetterTupleAccountData(source);
    return { $$type: 'Account$Data' as const, data: _data };
}

function storeTupleAccount$Data(source: Account$Data) {
    const builder = new TupleBuilder();
    builder.writeTuple(storeTupleAccountData(source.data));
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

export type BasicAuctionData = {
    $$type: 'BasicAuctionData';
    id: bigint;
    name: string;
    description: string;
    owner: Address;
    owner_account: Address;
    owner_secret_id: Cell;
    collector: Address;
    type: string;
    minimal_amount: bigint;
    ended: boolean;
    refund: boolean;
    ends_at: bigint;
    balance: bigint | null;
    minimal_raise: bigint;
    winner: Winner | null;
}

export function storeBasicAuctionData(src: BasicAuctionData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.id, 257);
        b_0.storeStringRefTail(src.name);
        b_0.storeStringRefTail(src.description);
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.owner_account);
        const b_1 = new Builder();
        b_1.storeRef(src.owner_secret_id);
        b_1.storeAddress(src.collector);
        b_1.storeStringRefTail(src.type);
        b_1.storeInt(src.minimal_amount, 257);
        b_1.storeBit(src.ended);
        b_1.storeBit(src.refund);
        b_1.storeInt(src.ends_at, 257);
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
    const _id = sc_0.loadIntBig(257);
    const _name = sc_0.loadStringRefTail();
    const _description = sc_0.loadStringRefTail();
    const _owner = sc_0.loadAddress();
    const _owner_account = sc_0.loadAddress();
    const sc_1 = sc_0.loadRef().beginParse();
    const _owner_secret_id = sc_1.loadRef();
    const _collector = sc_1.loadAddress();
    const _type = sc_1.loadStringRefTail();
    const _minimal_amount = sc_1.loadIntBig(257);
    const _ended = sc_1.loadBit();
    const _refund = sc_1.loadBit();
    const _ends_at = sc_1.loadIntBig(257);
    const sc_2 = sc_1.loadRef().beginParse();
    const _balance = sc_2.loadBit() ? sc_2.loadIntBig(257) : null;
    const _minimal_raise = sc_2.loadIntBig(257);
    const _winner = sc_2.loadBit() ? loadWinner(sc_2) : null;
    return { $$type: 'BasicAuctionData' as const, id: _id, name: _name, description: _description, owner: _owner, owner_account: _owner_account, owner_secret_id: _owner_secret_id, collector: _collector, type: _type, minimal_amount: _minimal_amount, ended: _ended, refund: _refund, ends_at: _ends_at, balance: _balance, minimal_raise: _minimal_raise, winner: _winner };
}

function loadTupleBasicAuctionData(source: TupleReader) {
    const _id = source.readBigNumber();
    const _name = source.readString();
    const _description = source.readString();
    const _owner = source.readAddress();
    const _owner_account = source.readAddress();
    const _owner_secret_id = source.readCell();
    const _collector = source.readAddress();
    const _type = source.readString();
    const _minimal_amount = source.readBigNumber();
    const _ended = source.readBoolean();
    const _refund = source.readBoolean();
    const _ends_at = source.readBigNumber();
    const _balance = source.readBigNumberOpt();
    const _minimal_raise = source.readBigNumber();
    const _winner_p = source.readTupleOpt();
    const _winner = _winner_p ? loadTupleWinner(_winner_p) : null;
    return { $$type: 'BasicAuctionData' as const, id: _id, name: _name, description: _description, owner: _owner, owner_account: _owner_account, owner_secret_id: _owner_secret_id, collector: _collector, type: _type, minimal_amount: _minimal_amount, ended: _ended, refund: _refund, ends_at: _ends_at, balance: _balance, minimal_raise: _minimal_raise, winner: _winner };
}

function loadGetterTupleBasicAuctionData(source: TupleReader) {
    const _id = source.readBigNumber();
    const _name = source.readString();
    const _description = source.readString();
    const _owner = source.readAddress();
    const _owner_account = source.readAddress();
    const _owner_secret_id = source.readCell();
    const _collector = source.readAddress();
    const _type = source.readString();
    const _minimal_amount = source.readBigNumber();
    const _ended = source.readBoolean();
    const _refund = source.readBoolean();
    const _ends_at = source.readBigNumber();
    const _balance = source.readBigNumberOpt();
    const _minimal_raise = source.readBigNumber();
    const _winner_p = source.readTupleOpt();
    const _winner = _winner_p ? loadTupleWinner(_winner_p) : null;
    return { $$type: 'BasicAuctionData' as const, id: _id, name: _name, description: _description, owner: _owner, owner_account: _owner_account, owner_secret_id: _owner_secret_id, collector: _collector, type: _type, minimal_amount: _minimal_amount, ended: _ended, refund: _refund, ends_at: _ends_at, balance: _balance, minimal_raise: _minimal_raise, winner: _winner };
}

function storeTupleBasicAuctionData(source: BasicAuctionData) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.id);
    builder.writeString(source.name);
    builder.writeString(source.description);
    builder.writeAddress(source.owner);
    builder.writeAddress(source.owner_account);
    builder.writeCell(source.owner_secret_id);
    builder.writeAddress(source.collector);
    builder.writeString(source.type);
    builder.writeNumber(source.minimal_amount);
    builder.writeBoolean(source.ended);
    builder.writeBoolean(source.refund);
    builder.writeNumber(source.ends_at);
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
    data: BasicAuctionData;
}

export function storeBasicAuction$Data(src: BasicAuction$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.store(storeBasicAuctionData(src.data));
    };
}

export function loadBasicAuction$Data(slice: Slice) {
    const sc_0 = slice;
    const _data = loadBasicAuctionData(sc_0);
    return { $$type: 'BasicAuction$Data' as const, data: _data };
}

function loadTupleBasicAuction$Data(source: TupleReader) {
    const _data = loadTupleBasicAuctionData(source);
    return { $$type: 'BasicAuction$Data' as const, data: _data };
}

function loadGetterTupleBasicAuction$Data(source: TupleReader) {
    const _data = loadGetterTupleBasicAuctionData(source);
    return { $$type: 'BasicAuction$Data' as const, data: _data };
}

function storeTupleBasicAuction$Data(source: BasicAuction$Data) {
    const builder = new TupleBuilder();
    builder.writeTuple(storeTupleBasicAuctionData(source.data));
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

export type AccountConfig = {
    $$type: 'AccountConfig';
    referree: Address | null;
    service_comission: bigint;
    referral_comission: bigint;
    max_allowance: bigint;
    secret_id: Cell;
}

export function storeAccountConfig(src: AccountConfig) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.referree);
        b_0.storeUint(src.service_comission, 16);
        b_0.storeUint(src.referral_comission, 16);
        b_0.storeUint(src.max_allowance, 16);
        b_0.storeRef(src.secret_id);
    };
}

export function loadAccountConfig(slice: Slice) {
    const sc_0 = slice;
    const _referree = sc_0.loadMaybeAddress();
    const _service_comission = sc_0.loadUintBig(16);
    const _referral_comission = sc_0.loadUintBig(16);
    const _max_allowance = sc_0.loadUintBig(16);
    const _secret_id = sc_0.loadRef();
    return { $$type: 'AccountConfig' as const, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, max_allowance: _max_allowance, secret_id: _secret_id };
}

function loadTupleAccountConfig(source: TupleReader) {
    const _referree = source.readAddressOpt();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _max_allowance = source.readBigNumber();
    const _secret_id = source.readCell();
    return { $$type: 'AccountConfig' as const, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, max_allowance: _max_allowance, secret_id: _secret_id };
}

function loadGetterTupleAccountConfig(source: TupleReader) {
    const _referree = source.readAddressOpt();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _max_allowance = source.readBigNumber();
    const _secret_id = source.readCell();
    return { $$type: 'AccountConfig' as const, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, max_allowance: _max_allowance, secret_id: _secret_id };
}

function storeTupleAccountConfig(source: AccountConfig) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.referree);
    builder.writeNumber(source.service_comission);
    builder.writeNumber(source.referral_comission);
    builder.writeNumber(source.max_allowance);
    builder.writeCell(source.secret_id);
    return builder.build();
}

function dictValueParserAccountConfig(): DictionaryValue<AccountConfig> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAccountConfig(src)).endCell());
        },
        parse: (src) => {
            return loadAccountConfig(src.loadRef().beginParse());
        }
    }
}

export type Controller$Data = {
    $$type: 'Controller$Data';
    owner1: Address;
    owner2: Address;
    service_comission: bigint;
    referral_comission: bigint;
    initialisers: Dictionary<Address, AccountConfig>;
}

export function storeController$Data(src: Controller$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner1);
        b_0.storeAddress(src.owner2);
        b_0.storeUint(src.service_comission, 16);
        b_0.storeUint(src.referral_comission, 16);
        b_0.storeDict(src.initialisers, Dictionary.Keys.Address(), dictValueParserAccountConfig());
    };
}

export function loadController$Data(slice: Slice) {
    const sc_0 = slice;
    const _owner1 = sc_0.loadAddress();
    const _owner2 = sc_0.loadAddress();
    const _service_comission = sc_0.loadUintBig(16);
    const _referral_comission = sc_0.loadUintBig(16);
    const _initialisers = Dictionary.load(Dictionary.Keys.Address(), dictValueParserAccountConfig(), sc_0);
    return { $$type: 'Controller$Data' as const, owner1: _owner1, owner2: _owner2, service_comission: _service_comission, referral_comission: _referral_comission, initialisers: _initialisers };
}

function loadTupleController$Data(source: TupleReader) {
    const _owner1 = source.readAddress();
    const _owner2 = source.readAddress();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _initialisers = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserAccountConfig(), source.readCellOpt());
    return { $$type: 'Controller$Data' as const, owner1: _owner1, owner2: _owner2, service_comission: _service_comission, referral_comission: _referral_comission, initialisers: _initialisers };
}

function loadGetterTupleController$Data(source: TupleReader) {
    const _owner1 = source.readAddress();
    const _owner2 = source.readAddress();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _initialisers = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserAccountConfig(), source.readCellOpt());
    return { $$type: 'Controller$Data' as const, owner1: _owner1, owner2: _owner2, service_comission: _service_comission, referral_comission: _referral_comission, initialisers: _initialisers };
}

function storeTupleController$Data(source: Controller$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner1);
    builder.writeAddress(source.owner2);
    builder.writeNumber(source.service_comission);
    builder.writeNumber(source.referral_comission);
    builder.writeCell(source.initialisers.size > 0 ? beginCell().storeDictDirect(source.initialisers, Dictionary.Keys.Address(), dictValueParserAccountConfig()).endCell() : null);
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

export type Initialise = {
    $$type: 'Initialise';
    referree: Address | null;
    service_comission: bigint;
    referral_comission: bigint;
    max_allowance: bigint;
    secret_id: Cell;
}

export function storeInitialise(src: Initialise) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1549873035, 32);
        b_0.storeAddress(src.referree);
        b_0.storeUint(src.service_comission, 16);
        b_0.storeUint(src.referral_comission, 16);
        b_0.storeUint(src.max_allowance, 16);
        b_0.storeRef(src.secret_id);
    };
}

export function loadInitialise(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1549873035) { throw Error('Invalid prefix'); }
    const _referree = sc_0.loadMaybeAddress();
    const _service_comission = sc_0.loadUintBig(16);
    const _referral_comission = sc_0.loadUintBig(16);
    const _max_allowance = sc_0.loadUintBig(16);
    const _secret_id = sc_0.loadRef();
    return { $$type: 'Initialise' as const, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, max_allowance: _max_allowance, secret_id: _secret_id };
}

function loadTupleInitialise(source: TupleReader) {
    const _referree = source.readAddressOpt();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _max_allowance = source.readBigNumber();
    const _secret_id = source.readCell();
    return { $$type: 'Initialise' as const, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, max_allowance: _max_allowance, secret_id: _secret_id };
}

function loadGetterTupleInitialise(source: TupleReader) {
    const _referree = source.readAddressOpt();
    const _service_comission = source.readBigNumber();
    const _referral_comission = source.readBigNumber();
    const _max_allowance = source.readBigNumber();
    const _secret_id = source.readCell();
    return { $$type: 'Initialise' as const, referree: _referree, service_comission: _service_comission, referral_comission: _referral_comission, max_allowance: _max_allowance, secret_id: _secret_id };
}

function storeTupleInitialise(source: Initialise) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.referree);
    builder.writeNumber(source.service_comission);
    builder.writeNumber(source.referral_comission);
    builder.writeNumber(source.max_allowance);
    builder.writeCell(source.secret_id);
    return builder.build();
}

function dictValueParserInitialise(): DictionaryValue<Initialise> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeInitialise(src)).endCell());
        },
        parse: (src) => {
            return loadInitialise(src.loadRef().beginParse());
        }
    }
}

export type CreateBasicAuction = {
    $$type: 'CreateBasicAuction';
    id: bigint;
    name: string;
    description: string;
    minimal_amount: bigint;
    ends_at: bigint;
    secret_id: Cell;
}

export function storeCreateBasicAuction(src: CreateBasicAuction) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3152143941, 32);
        b_0.storeUint(src.id, 64);
        b_0.storeStringRefTail(src.name);
        b_0.storeStringRefTail(src.description);
        b_0.storeInt(src.minimal_amount, 257);
        b_0.storeUint(src.ends_at, 64);
        b_0.storeRef(src.secret_id);
    };
}

export function loadCreateBasicAuction(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3152143941) { throw Error('Invalid prefix'); }
    const _id = sc_0.loadUintBig(64);
    const _name = sc_0.loadStringRefTail();
    const _description = sc_0.loadStringRefTail();
    const _minimal_amount = sc_0.loadIntBig(257);
    const _ends_at = sc_0.loadUintBig(64);
    const _secret_id = sc_0.loadRef();
    return { $$type: 'CreateBasicAuction' as const, id: _id, name: _name, description: _description, minimal_amount: _minimal_amount, ends_at: _ends_at, secret_id: _secret_id };
}

function loadTupleCreateBasicAuction(source: TupleReader) {
    const _id = source.readBigNumber();
    const _name = source.readString();
    const _description = source.readString();
    const _minimal_amount = source.readBigNumber();
    const _ends_at = source.readBigNumber();
    const _secret_id = source.readCell();
    return { $$type: 'CreateBasicAuction' as const, id: _id, name: _name, description: _description, minimal_amount: _minimal_amount, ends_at: _ends_at, secret_id: _secret_id };
}

function loadGetterTupleCreateBasicAuction(source: TupleReader) {
    const _id = source.readBigNumber();
    const _name = source.readString();
    const _description = source.readString();
    const _minimal_amount = source.readBigNumber();
    const _ends_at = source.readBigNumber();
    const _secret_id = source.readCell();
    return { $$type: 'CreateBasicAuction' as const, id: _id, name: _name, description: _description, minimal_amount: _minimal_amount, ends_at: _ends_at, secret_id: _secret_id };
}

function storeTupleCreateBasicAuction(source: CreateBasicAuction) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.id);
    builder.writeString(source.name);
    builder.writeString(source.description);
    builder.writeNumber(source.minimal_amount);
    builder.writeNumber(source.ends_at);
    builder.writeCell(source.secret_id);
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
    address: Address;
    owner_secret_id: Cell;
}

export function storeAuctionCreatedEvent(src: AuctionCreatedEvent) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(11184643, 32);
        b_0.storeAddress(src.address);
        b_0.storeRef(src.owner_secret_id);
    };
}

export function loadAuctionCreatedEvent(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 11184643) { throw Error('Invalid prefix'); }
    const _address = sc_0.loadAddress();
    const _owner_secret_id = sc_0.loadRef();
    return { $$type: 'AuctionCreatedEvent' as const, address: _address, owner_secret_id: _owner_secret_id };
}

function loadTupleAuctionCreatedEvent(source: TupleReader) {
    const _address = source.readAddress();
    const _owner_secret_id = source.readCell();
    return { $$type: 'AuctionCreatedEvent' as const, address: _address, owner_secret_id: _owner_secret_id };
}

function loadGetterTupleAuctionCreatedEvent(source: TupleReader) {
    const _address = source.readAddress();
    const _owner_secret_id = source.readCell();
    return { $$type: 'AuctionCreatedEvent' as const, address: _address, owner_secret_id: _owner_secret_id };
}

function storeTupleAuctionCreatedEvent(source: AuctionCreatedEvent) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.address);
    builder.writeCell(source.owner_secret_id);
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

 type Controller_init_args = {
    $$type: 'Controller_init_args';
    owner1: Address;
    owner2: Address;
    service_comission: bigint;
    referral_comission: bigint;
    initialisers: Dictionary<Address, AccountConfig>;
}

function initController_init_args(src: Controller_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner1);
        b_0.storeAddress(src.owner2);
        b_0.storeUint(src.service_comission, 16);
        b_0.storeUint(src.referral_comission, 16);
        b_0.storeDict(src.initialisers, Dictionary.Keys.Address(), dictValueParserAccountConfig());
    };
}

async function Controller_init(owner1: Address, owner2: Address, service_comission: bigint, referral_comission: bigint, initialisers: Dictionary<Address, AccountConfig>) {
    const __code = Cell.fromHex('b5ee9c724102440100121a000114ff00f4a413f4bcf2c80b01020162023c04c4d001d072d721d200d200fa4021103450666f04f86102f862ed44d0fa40fa40d30fd30ff40455406c1506925f06e07025d74920c21f953105d31f06de2182106986fc89bae302218210775374c8bae30221821098384f3ebae302218210345e116dba03040506008e5f0402d30fd30f5932f8425330c70592307f945240c705e2f2e0c920c2fff2e0ca21c2fff2e0ca5301a0812710bbf2e0ca4014c855405054cf1658cf16cb0f12cb0ff400c9ed5401b85b04fa40d30fd30fd30f553034f8425370c70592307f945260c705e2f2e0c921c2fff2e0ca20c2fff2e0ca5ca0812710bbf2e0ca22441402c855308210775374c85005cb1f5003cf16cb0fcb0fcb0fc9104610351024706ddb3c5f053a00885b04fa400131f8425340c705917f945330c705e2f2e0c90681010bf45930058010c8cb05ce70cf0b6ec98042fb004034c855405054cf1658cf16cb0f12cb0ff400c9ed5404ece30236208210ca4c30b5ba8f603034f8422581010b2259f40a6fa131b38e8d3040346df842017f6ddb3c5f05e081010b260259f40b6fa192306ddf206e92306d8e1fd020d70b01c30093fa40019472d7216de201d30fd30fd30fd455406c156f05e2206ef2d0806f2555305503e0208210e8cf424dba073a393b04f45b04d420d70b01c30093fa40019472d7216de21232f8416f24306c12821005f5e100bef2e0cb71f8286d6d70206d5311708810ab109a108910ab88c855b1db3cc95c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d02981010b2259f40a6fa1310809353600000114ff00f4a413f4bcf2c80b0a0201620b3204bed001d072d721d200d200fa4021103450666f04f86102f862ed44d0db3c6c1c0d8e9c0b8020d7217021d749c21f9430d31f01de8210bbe1e645bae3025f0de0702cd74920c21f95310cd31f0dde2182105c612f8bbae302218210775374c8ba330c0d0f01eed33f0131238101012259f40c6fa131b3925f0de0238101012259f40d6fa192306ddf206e92306d8e22d0810101d700d401d001d401d001fa40d401d001d33fd37fd200d20055806c196f09e2206ef2d0806f2910585f08f84201c705b3925f0de05003810101f45a3002a4109b5518c855b0db3cc9ed543501ec10245f0434395b0520d70b01c30093fa40019472d7216de201d30fd30fd30fd4554035f8425290c705f2e0c909b3f2e0ce287f7082089896806f00c801308210e8cf424d01cb1fc92c59027fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb00f82826c8598208acca005003cb1f01cf16ccc90e015ec88258c000000000000000000000000101cb67ccc970fb00109b108a1079106810471036450302c855b0db3cc9ed543504b48ebb5b343409fa40d30fd30fd30f553034f84252c0c705f2e0c9f82813c705f2e0cc522ca115a0109b108a10791068105710454034c855b0db3cc9ed54e02182101fcbffc6bae302218210a9c1d33fbae302218210bbe1e645ba3510121501ce5b0bd33fd20059322cf2e0ce248101012259f40c6fa131f2e0d2248101012259f40d6fa192306ddf206e92306d8e22d0810101d700d401d001d401d001fa40d401d001d33fd37fd200d20055806c196f09e2206ef2d0806f295bf84224c705f2e0cd7f8101010a11019ac855805089810101cf00c85007cf16c95006ccc85005cf16c95004cc58cf16c858cf16c901cccb3fcb7fca00ca00c91035206e953059f45a30944133f415e202a4109b5518c855b0db3cc9ed5435028010235f033a29f2e0cef8425360c70592307f945290c705e2f2e0c97a6d23810101f4856fa520911295316d326d01e2908ae85b33109b5518c855b0db3cc9ed541335019e206e92306d8e22d0810101d700d401d001d401d001fa40d401d001d33fd37fd200d20055806c196f09e2206ef2d0806f2921b3925f09e30d810101250259f4786fa5209402d4305895316d326d01e2140092810101295571c855805089810101cf00c85007cf16c95006ccc85005cf16c95004cc58cf16c858cf16c901cccb3fcb7fca00ca00c9103412206e953059f45a30944133f415e202a55902f68ef75b0bd33fd401d001d401d001810101d700d33fd45550365610f2e0cef84252d0c705f2e0c9f823814650a05210bcf2e0caf8238208278d00a05210b9f2e0cb26c200f2e0d0288101012659f40c6fa131b3f2e0d18b5626173696386df828706d70702b518b516b0656164516561a515d51500445551113e021162903fe10bd10ac109b108a090748185055040388c80f0e11100e0d0c11100c0b0a11100a0908111008070611100605041110040302111002011110c855e0db3cc901ccc95c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d08b5626173696382706105743144977701725270114ff00f4a413f4bcf2c80b1802012019210201481a1f04b0d001d072d721d200d200fa4021103450666f04f86102f862ed44d0d401d0db3c6c1f6c1f1110935f0f30e0702fd74920c21f96310fd31f1110de218210164a11f1bae302218210e7633219bae3025710208210ec533ec0ba221b1c1e01ea5b3ef84253a0c70592307f945270c705e2f2e0ce03b3922d6e9170e2f2e0d17f8306702e70c85982101fcbffc65003cb1fcb3fca00c92b597013c8cf8580ca00cf8440ce01fa02806acf40f400c901fb0010ce10bd10ac109b108a107910681057104644554313c855e0c855e0db3cc901ccc9ed542502d85f030dd4013123b3f2e0d0f8235220bcf2e0cbf8416f2430325316bef2e0c956106eb3925710e30d40ff126f0320206ef2d0806f233031a7058064a90482101dcd650001b60910ce10bd10ac109b108a1079106810571046103510244300c855e0c855e0db3cc901ccc9ed541d2500fe1110206ef2d0806f235331bcf2e0c921a7058064a90482101dcd650001b6095220a05240bcf2e0ca705a6d027fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb00f8285463b024444013c855408208aaaa015006cb1f5004cf1612cccccc810101cf00c9c88258c000000000000000000000000101cb67ccc970fb0002f08f23303e23b3f2e0d0f8235220b9f2e0d210ce551bdb3cc855e0c855e0db3cc901ccc9ed54e03c5f08343435c00003c12113b08e3df8425133c7059330317f9358c705e2f2e0cef82801c8598208aaaa035003cb1f01cf16ccc9c88258c000000000000000000000000101cb67ccc970fb00e05f03f2c08223250225a10ec5da89a1a803a1b678d83ed83fb678d9ff22200026547edc547edc547edc547edc53dcf8276f1059038af2ed44d0d401d0db3c6c1f6c1f0fd70d1ff2e082308210ec533ec0ba8f2124b3f2e0d0f8235230b9f2e0d2f800550ddb3cc855e0c855e0db3cc901ccc9ed54e05f0ff2c08222232500b6810101d700d401d001d401d001fa40fa40d401d0d4fa40d401d001810101d700d200d200810101d700d430d0d2000195810101d700926d01e2810101d700d200019bfa40d37fd455206c136f0392306de210af10ae10ad10ac10ab01f6357f256e8e7134f828296dc855208208aaaa025004cb1f58cf16cc216eb3957f01ca00cc947032ca00e2c9c88258c000000000000000000000000101cb67ccc970fb007f8100a07056107fc85982101fcbffc65003cb1fcb3fca00c92d59027fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb00e30e04052400fc25206ef2d0806f2332f8285420c3c855208208aaaa025004cb1f58cf16cc216eb3957f01ca00cc947032ca00e2c9c88258c000000000000000000000000101cb67ccc970fb008100a056107003c8598210a9ee5a8d5003cb1f810101cf00cb7fc9544d33027fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb000401de50ef810101cf00c8500dcf16c9500cccc8500bcf16c9500acc5008cf165006cf1604c8cc5003cf16c858cf16c901cc810101cf0012ca0012ca0012810101cf00c8236eb39a7f01ca0013810101cf009633705003ca00e213810101cf00236eb39633705003ca00e30dc958ccc901cc26002a7f01ca0003206ef2d0806f2310355acf1612cb7fcc01fe7010241023557081010109c855805089810101cf00c85007cf16c95006ccc85005cf16c95004cc58cf16c858cf16c901cccb3fcb7fca00ca00c910374170206e953059f45a30944133f415e28040705a7f50726d55305f41f90001f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f9040003c8cf8580ca0012cc280148cccf884008cbff01fa028069cf40cf8634f400c901fb00a5109b5518c855b0db3cc9ed543503f88210a9ee5a8dbae3023d208210de904d8eba8ee6165f0650675f0502f2e0cef8416f2443305230fa40fa0071d721fa00fa00306c6170f83a01ab005202b9925f03e0216e8e32327001206ef2d0806f00c801308210de904d8e01cb1fc94130027fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb00e30de0202a2e2f01f25b0b810101d700d37f59322cf2e0ce248101012259f40c6fa131f2e0d2f8416f2430325033b608258101012359f40d6fa192306ddf206e92306d8e22d0810101d700d401d001d401d001fa40d401d001d33fd37fd200d20055806c196f09e2206ef2d0806f2931524bc705f2e0cd537ea8812710a904706f002b01e4c8013082100fcbef7b01cb1fc912561659027fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb00537da8812710a90456106eb38e32705611206ef2d0806f00c801308210de904d8e01cb1fc94130027fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb009130e27f8101010b2c01fcc855805089810101cf00c85007cf16c95006ccc85005cf16c95004cc58cf16c858cf16c901cccb3fcb7fca00ca00c9164330206e953059f45a30944133f415e201a4f82854140d12c855208208acca015004cb1f58cf16810101cf00ccc9c88258c000000000000000000000000101cb67ccc970fb00109b108a107910682d0122105710461035504403c855b0db3cc9ed5435005831706f00c8013082100fcbef7b01cb1fc94330027fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb0002a28210671084c5ba8e2f175f076c52f2e0cef8425210c705f2e0c9830601706d027fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb00e02082106ad509a7bae302c0000cc1211cb0e3025f0cf2c082303101885b3af8425260c705f2e0c97026708100a06d40037fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb00109b108a107910681057104610354403c855b0db3cc9ed54350184f84253a0c70592307f945270c705e2f2e0c92a925f0ce06f00c801308210ca4c30b501cb1fc910ac109b108a10791068105710461035443012f842017f6ddb3c5f0c3a021ba10ec5da89a1b678d839b678d9993334008efa40810101d700d2000195810101d700926d01e2d401d0fa4020d70b01c30093fa40019472d7216de201d30fd30ff404810101d700d430d0810101d700d200d430109c109b109a0022547ba8547a98547a9853a9f8276f10558000a450cbcf1619810101cf00276eb39a7f01ca0017810101cf009637705007ca00e2c85006cf165004206e95307001cb0192cf16e212cb0fcb0ff40012810101cf0002c8810101cf0014ca0012ccc901ccc901cc03fc8e8e5f0540346df842017f6ddb3c5f05e05475846e955b5358a070de102681010b7a5007c855405054206e95307001cb0192cf16e212cb0fcb0f12cb0fccc910394940206e953059f45930944133f413e28040705a7f50926d55305f41f90001f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f9040003c8893a37380001600066cf16ca0012cccccf884008cbff01fa028069cf40cf8634f400c901fb004034c855405054cf1658cf16cb0f12cb0ff400c9ed540162c8554082105c612f8b5006cb1f5004206e95307001cb0192cf16e212cb0fcb0fcb0fccc910354430f842017f6ddb3c5f053a00a06d6d226eb3995b206ef2d0806f22019132e21024700304804250231036552212c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00007c8e223034f842500581010bf459304430c855405054cf1658cf16cb0f12cb0ff400c9ed54e0365f042182100fcbef7bba915be001c00001c121b0dcf2c0820201203d3f012fbd53bf6a2687d207d206987e987fa022aa0360aed9e3628c3e0002710201204042012fb8e73ed44d0fa40fa40d30fd30ff40455406c15db3c6c51841000222012fbaaa2ed44d0fa40fa40d30fd30ff40455406c15db3c6c51843000221283d0c68');
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
    {"name":"CreateAccount","header":878580077,"fields":[{"name":"secret_id","type":{"kind":"simple","type":"cell","optional":false}},{"name":"referree","type":{"kind":"simple","type":"address","optional":true}}]},
    {"name":"AccountCreated","header":3905897037,"fields":[]},
    {"name":"ConfigureService","header":1770454153,"fields":[{"name":"service_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"referral_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
    {"name":"ConfigureAccount","header":2001958088,"fields":[{"name":"address","type":{"kind":"simple","type":"address","optional":false}},{"name":"service_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"referral_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"max_allowance","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
    {"name":"CleanInitialiser","header":2553827134,"fields":[{"name":"address","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"RequestInitialisation","header":3393990837,"fields":[]},
    {"name":"ServiceComission","header":265023355,"fields":[]},
    {"name":"AuctionConfig","header":null,"fields":[{"name":"id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"name","type":{"kind":"simple","type":"string","optional":false}},{"name":"description","type":{"kind":"simple","type":"string","optional":false}},{"name":"address","type":{"kind":"simple","type":"address","optional":false}},{"name":"type","type":{"kind":"simple","type":"string","optional":false}},{"name":"ends_at","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"minimal_amount","type":{"kind":"simple","type":"uint","optional":false,"format":128}},{"name":"ended","type":{"kind":"simple","type":"bool","optional":false}},{"name":"refund","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"AccountData","header":null,"fields":[{"name":"collector","type":{"kind":"simple","type":"address","optional":false}},{"name":"version","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"balance","type":{"kind":"simple","type":"int","optional":true,"format":257}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"referree","type":{"kind":"simple","type":"address","optional":true}},{"name":"service_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"referral_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"auctions","type":{"kind":"dict","key":"int","value":"AuctionConfig","valueFormat":"ref"}},{"name":"max_allowance","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"allowance","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"initialised","type":{"kind":"simple","type":"bool","optional":false}},{"name":"secret_id","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Account$Data","header":null,"fields":[{"name":"data","type":{"kind":"simple","type":"AccountData","optional":false}}]},
    {"name":"Winner","header":null,"fields":[{"name":"address","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":128}},{"name":"secret_id","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"BasicAuctionData","header":null,"fields":[{"name":"id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"name","type":{"kind":"simple","type":"string","optional":false}},{"name":"description","type":{"kind":"simple","type":"string","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner_account","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner_secret_id","type":{"kind":"simple","type":"cell","optional":false}},{"name":"collector","type":{"kind":"simple","type":"address","optional":false}},{"name":"type","type":{"kind":"simple","type":"string","optional":false}},{"name":"minimal_amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"ended","type":{"kind":"simple","type":"bool","optional":false}},{"name":"refund","type":{"kind":"simple","type":"bool","optional":false}},{"name":"ends_at","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"balance","type":{"kind":"simple","type":"int","optional":true,"format":257}},{"name":"minimal_raise","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"winner","type":{"kind":"simple","type":"Winner","optional":true}}]},
    {"name":"BasicAuction$Data","header":null,"fields":[{"name":"data","type":{"kind":"simple","type":"BasicAuctionData","optional":false}}]},
    {"name":"AccountConfig","header":null,"fields":[{"name":"referree","type":{"kind":"simple","type":"address","optional":true}},{"name":"service_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"referral_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"max_allowance","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"secret_id","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Controller$Data","header":null,"fields":[{"name":"owner1","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner2","type":{"kind":"simple","type":"address","optional":false}},{"name":"service_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"referral_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"initialisers","type":{"kind":"dict","key":"address","value":"AccountConfig","valueFormat":"ref"}}]},
    {"name":"AccountDelete","header":1792346535,"fields":[]},
    {"name":"ReferralCommission","header":3733998990,"fields":[]},
    {"name":"Collect","header":1729135813,"fields":[]},
    {"name":"AccountInitialisedEvent","header":11323904,"fields":[{"name":"address","type":{"kind":"simple","type":"address","optional":false}},{"name":"secret_id","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"ProfitReceivedEvent","header":11323905,"fields":[{"name":"address","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"secret_id","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Profit","header":2850970253,"fields":[{"name":"id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":128}}]},
    {"name":"AuctionDeleted","header":533462982,"fields":[{"name":"id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"refund","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"Initialise","header":1549873035,"fields":[{"name":"referree","type":{"kind":"simple","type":"address","optional":true}},{"name":"service_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"referral_comission","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"max_allowance","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"secret_id","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"CreateBasicAuction","header":3152143941,"fields":[{"name":"id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"name","type":{"kind":"simple","type":"string","optional":false}},{"name":"description","type":{"kind":"simple","type":"string","optional":false}},{"name":"minimal_amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"ends_at","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"secret_id","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"CleanUp","header":2848052031,"fields":[]},
    {"name":"AuctionOutbiddedEvent","header":11184641,"fields":[{"name":"address","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner_secret_id","type":{"kind":"simple","type":"cell","optional":false}},{"name":"old_winner_secret_id","type":{"kind":"simple","type":"cell","optional":false}},{"name":"new_winner_secret_id","type":{"kind":"simple","type":"cell","optional":false}},{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"AuctionResolvedEvent","header":11184642,"fields":[{"name":"address","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner_secret_id","type":{"kind":"simple","type":"cell","optional":false}},{"name":"winner_secret_id","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"AuctionCreatedEvent","header":11184643,"fields":[{"name":"address","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner_secret_id","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Bid","header":3882037785,"fields":[{"name":"secret_id","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Resolve","header":3964878528,"fields":[]},
    {"name":"Delete","header":373953009,"fields":[]},
]

const Controller_opcodes = {
    "ChangeOwner": 2174598809,
    "ChangeOwnerOk": 846932810,
    "CreateAccount": 878580077,
    "AccountCreated": 3905897037,
    "ConfigureService": 1770454153,
    "ConfigureAccount": 2001958088,
    "CleanInitialiser": 2553827134,
    "RequestInitialisation": 3393990837,
    "ServiceComission": 265023355,
    "AccountDelete": 1792346535,
    "ReferralCommission": 3733998990,
    "Collect": 1729135813,
    "AccountInitialisedEvent": 11323904,
    "ProfitReceivedEvent": 11323905,
    "Profit": 2850970253,
    "AuctionDeleted": 533462982,
    "Initialise": 1549873035,
    "CreateBasicAuction": 3152143941,
    "CleanUp": 2848052031,
    "AuctionOutbiddedEvent": 11184641,
    "AuctionResolvedEvent": 11184642,
    "AuctionCreatedEvent": 11184643,
    "Bid": 3882037785,
    "Resolve": 3964878528,
    "Delete": 373953009,
}

const Controller_getters: ABIGetter[] = [
    {"name":"serviceComission","methodId":102003,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"referralComission","methodId":125602,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"version","methodId":76407,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
]

export const Controller_getterMapping: { [key: string]: string } = {
    'serviceComission': 'getServiceComission',
    'referralComission': 'getReferralComission',
    'version': 'getVersion',
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
    public static readonly REGISTRATION_FEE = 100000000n;
    public static readonly DEFAULT_ALLOWANCE = 10n;
    public static readonly errors = Controller_errors_backward;
    public static readonly opcodes = Controller_opcodes;
    
    static async init(owner1: Address, owner2: Address, service_comission: bigint, referral_comission: bigint, initialisers: Dictionary<Address, AccountConfig>) {
        return await Controller_init(owner1, owner2, service_comission, referral_comission, initialisers);
    }
    
    static async fromInit(owner1: Address, owner2: Address, service_comission: bigint, referral_comission: bigint, initialisers: Dictionary<Address, AccountConfig>) {
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
    
    async getVersion(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('version', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
}