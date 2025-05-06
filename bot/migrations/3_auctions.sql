CREATE TABLE IF NOT EXISTS auctions (
    addr TEXT PRIMARY KEY,
    name TEXT,
    user_id_hash TEXT NOT NULL,
    ends_at INTEGER NOT NULL,
    processed TINYINT NOT NULL,
    deleted TINYINT NOT NULL,
    won TINYINT NOT NULL,
    winner_id_hash TEXT
) WITHOUT ROWID;
