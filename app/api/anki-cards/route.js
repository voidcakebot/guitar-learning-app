import { getSql } from '../../../lib/db';

const DEFAULT_USER_ID = 'current-user';

async function ensureTables(sql) {
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
    await ensureTables(sql);
    const rows = await sql`
      SELECT
        c.id,
        c.user_id AS "userId",
        c.source_shape_id AS "sourceShapeId",
        c.front,
        c.back,
        c.created_at AS "createdAt",
        s.tuning_id AS "tuningId",
        s.markers
      FROM anki_cards c
      LEFT JOIN saved_shapes s ON s.id = c.source_shape_id
      WHERE c.user_id = ${DEFAULT_USER_ID}
      ORDER BY c.created_at DESC
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
    await ensureTables(sql);

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

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });

    const sql = getSql();
    await ensureTables(sql);
    await sql`
      DELETE FROM anki_cards
      WHERE id = ${id} AND user_id = ${DEFAULT_USER_ID}
    `;

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
