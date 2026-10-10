-- Items. Timestamps are epoch ms; ids are ULIDs, so they sort by creation time.

CREATE TABLE items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'hidden')),
  created_at INTEGER NOT NULL
);

CREATE INDEX items_by_recent ON items (status, created_at DESC, id DESC);
