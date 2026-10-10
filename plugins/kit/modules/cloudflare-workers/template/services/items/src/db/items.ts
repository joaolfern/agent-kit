import type { Item, Page } from '{{contractPackage}}'
import { decodeCursor, encodeCursor } from './cursor'

type ItemRow = {
  id: string
  name: string
  description: string
  created_at: number
}

export class InvalidCursorError extends Error {}

function toItem(row: ItemRow): Item {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    createdAt: new Date(row.created_at).toISOString(),
  }
}

function readCursor(cursor: string | undefined) {
  if (!cursor) return null
  const values = decodeCursor(cursor)
  const [createdAt, id] = values ?? []
  if (typeof createdAt !== 'number' || typeof id !== 'string') {
    throw new InvalidCursorError()
  }
  return { createdAt, id }
}

export async function listItems(
  db: D1Database,
  { cursor, limit }: { cursor?: string; limit: number }
): Promise<Page<Item>> {
  const after = readCursor(cursor)
  const rows = await db
    .prepare(
      `SELECT id, name, description, created_at FROM items
       WHERE status = 'published'
         AND (?1 IS NULL OR created_at < ?1 OR (created_at = ?1 AND id < ?2))
       ORDER BY created_at DESC, id DESC
       LIMIT ?3`
    )
    .bind(after?.createdAt ?? null, after?.id ?? null, limit + 1)
    .all<ItemRow>()
  const total = await countItems(db)

  const page = rows.results.slice(0, limit)
  const last = page.at(-1)
  const hasMore = rows.results.length > limit
  return {
    items: page.map(toItem),
    nextCursor:
      hasMore && last ? encodeCursor([last.created_at, last.id]) : null,
    total,
  }
}

export async function getItem(db: D1Database, id: string) {
  const row = await db
    .prepare(
      `SELECT id, name, description, created_at FROM items WHERE id = ? AND status = 'published'`
    )
    .bind(id)
    .first<ItemRow>()
  return row ? toItem(row) : null
}

export async function insertItem(
  db: D1Database,
  item: { id: string; name: string; description: string; createdAt: number }
) {
  await db
    .prepare(
      'INSERT INTO items (id, name, description, created_at) VALUES (?, ?, ?, ?)'
    )
    .bind(item.id, item.name, item.description, item.createdAt)
    .run()
}

export async function countItems(db: D1Database) {
  return (
    (await db
      .prepare(`SELECT COUNT(*) AS total FROM items WHERE status = 'published'`)
      .first<number>('total')) ?? 0
  )
}
