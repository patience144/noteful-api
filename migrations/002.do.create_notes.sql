CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  note_name TEXT NOT NULL,
  note_content TEXT NOT NULL,
  date_modified TIMESTAMPTZ DEFAULT now() NOT NULL,
  folder_id TEXT REFERENCES folders(id) ON DELETE CASCADE
);