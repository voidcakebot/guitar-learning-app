import { getSql } from '../../../lib/db';

const DEFAULT_USER_ID = 'current-user';

async function ensureTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS anki_cards (
      id UUID PRIMARY KEY,
      user_id TEXT NOT NULL,
      source_shape_id UUID,
      front TEXT NOT NULL,
      back TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function GET() {
  try {
    const sql = getSql();
    await ensureTable(sql);
    const rows = await sql`
      SELECT id, user_id AS "userId", source_shape_id AS "sourceShapeId", front, back, created_at AS "createdAt"
      FROM anki_cards
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
      INSERT INTO anki_cards (id, user_id, source_shape_id, front, back)
      VALUES (
        ${body.id},
        ${DEFAULT_USER_ID},
        ${body.sourceShapeId || null},
        ${body.front},
        ${body.back}
      )
    `;

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
