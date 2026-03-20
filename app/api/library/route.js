import { getSql } from '../../../lib/db';

const DEFAULT_USER_ID = 'current-user';

async function ensureTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS saved_shapes (
      id UUID PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      tags JSONB NOT NULL DEFAULT '[]'::jsonb,
      tuning_id TEXT NOT NULL,
      markers JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function GET() {
  try {
    const sql = getSql();
    await ensureTable(sql);
    const rows = await sql`
      SELECT id, user_id AS "userId", name, category, tags, tuning_id AS "tuningId", markers, created_at AS "createdAt"
      FROM saved_shapes
      WHERE user_id = ${DEFAULT_USER_ID}
      ORDER BY created_at DESC
    `;
    return Response.json({ items: rows });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const sql = getSql();
    await ensureTable(sql);

    await sql`
      INSERT INTO saved_shapes (id, user_id, name, category, tags, tuning_id, markers)
      VALUES (
        ${body.id},
        ${DEFAULT_USER_ID},
        ${body.name},
        ${body.category},
        ${JSON.stringify(body.tags ?? [])}::jsonb,
        ${body.tuningId},
        ${JSON.stringify(body.markers ?? [])}::jsonb
      )
    `;

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
