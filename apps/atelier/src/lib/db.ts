import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

// SQLite file lives in <project>/data (gitignored). Override with DATA_DIR.
const dataDir = process.env.DATA_DIR ?? path.resolve(process.cwd(), 'data');
mkdirSync(dataDir, { recursive: true });

export const db = new Database(path.join(dataDir, 'atelier.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    read INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );
`);

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  read: number;
  created_at: string;
}

export function insertMessage(name: string, email: string, message: string): void {
  db.prepare('INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)').run(
    name,
    email,
    message,
  );
}

export function listMessages(): ContactMessage[] {
  return db
    .prepare('SELECT * FROM contact_messages ORDER BY id DESC LIMIT 500')
    .all() as ContactMessage[];
}

export function setMessageRead(id: number, read: boolean): boolean {
  const res = db
    .prepare('UPDATE contact_messages SET read = ? WHERE id = ?')
    .run(read ? 1 : 0, id);
  return res.changes > 0;
}

export function deleteMessage(id: number): boolean {
  const res = db.prepare('DELETE FROM contact_messages WHERE id = ?').run(id);
  return res.changes > 0;
}
