CREATE TABLE IF NOT EXISTS messages (
    
    msg_hash TEXT NOT NULL PRIMARY KEY,
    network TEXT,
    opcode TEXT,
    created_lt BIGINT NOT NULL,
    body_raw TEXT NOT NULL,
    reserved_for_sending_at INTEGER,
    notification_sent_at INTEGER,
    reserve_count INTEGER NOT NULL
);
