import initSqlJs from 'sql.js/dist/sql-wasm.js'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import { get, set } from 'idb-keyval'

// Real SQLite, compiled to WebAssembly, running entirely in the browser.
// The in-memory database is serialized to IndexedDB so progress survives reloads.

const IDB_KEY = 'lingua-sqlite-db'

let dbPromise = null

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS lesson_progress (
    lesson_id   TEXT PRIMARY KEY,
    completed   INTEGER NOT NULL DEFAULT 0,
    last_viewed TEXT
  );

  CREATE TABLE IF NOT EXISTS quiz_results (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    topic_id  TEXT NOT NULL,
    score     INTEGER NOT NULL,
    total     INTEGER NOT NULL,
    taken_at  TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT
  );
`

async function createDatabase() {
  const SQL = await initSqlJs({ locateFile: () => wasmUrl })

  const saved = await get(IDB_KEY)
  const db = saved ? new SQL.Database(new Uint8Array(saved)) : new SQL.Database()

  db.run(SCHEMA)
  return db
}

/** Lazily initialise the singleton database. */
export function getDB() {
  if (!dbPromise) dbPromise = createDatabase()
  return dbPromise
}

/** Persist the current database image to IndexedDB. */
export async function persist() {
  const db = await getDB()
  await set(IDB_KEY, db.export())
}

/** Run a query and return rows as plain objects. */
export async function query(sql, params = []) {
  const db = await getDB()
  const stmt = db.prepare(sql)
  stmt.bind(params)
  const rows = []
  while (stmt.step()) rows.push(stmt.getAsObject())
  stmt.free()
  return rows
}

/** Run a write statement, then persist. */
export async function execute(sql, params = []) {
  const db = await getDB()
  db.run(sql, params)
  await persist()
}
