import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { ClientCreateSchema, ClientUpdateSchema, formatZodError } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const parsed = ClientCreateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }
    const { name, email, phone, address } = parsed.data;

    const result = db.prepare(
      'INSERT INTO clients (name, email, phone, address) VALUES (?, ?, ?, ?)'
    ).run(name, email || null, phone || null, address || null);

    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const parsed = ClientUpdateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }
    const { id, name, email, phone, address } = parsed.data;

    db.prepare('UPDATE clients SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?')
      .run(name, email || null, phone || null, address || null, id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
