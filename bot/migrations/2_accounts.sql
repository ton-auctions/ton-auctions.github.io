CREATE TABLE IF NOT EXISTS accounts (
    addr TEXT,
    user_id_hash TEXT,

    FOREIGN KEY (user_id_hash) 
        REFERENCES users (user_id_hash),

    PRIMARY KEY (addr, user_id_hash)
) WITHOUT ROWID;