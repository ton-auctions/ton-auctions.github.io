CREATE TABLE IF NOT EXISTS ton_indexer (
    network TEXT,
    opcode TEXT,
    last_seen_lt BIGINT NOT NULL,

    PRIMARY KEY (network, opcode)
) WITHOUT ROWID;
