'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { ProjectUpdateSchema, ClientUpdateSchema, ReviewSubmitSchema, formatZodError } from '@/lib/validators';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { rateLimit } from '@/lib/rate-limit';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

/** IP du client à partir des headers (Server Actions n'ont pas d'objet Request). */
async function actionClientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return h.get('x-real-ip') ?? 'unknown';
}

/** Honeypot : champ caché que seuls les bots remplissent. */
function isBot(formData: FormData): boolean {
  const trap = formData.get('website');
  return typeof trap === 'string' && trap.trim().length > 0;
}

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_FILES_PER_REQUEST = 5;

async function saveRequestImages(files: File[]): Promise<{ urls: string[]; error?: string }> {
  if (files.length === 0) return { urls: [] };
  if (files.length > MAX_FILES_PER_REQUEST) {
    return { urls: [], error: `Maximum ${MAX_FILES_PER_REQUEST} photos par demande.` };
  }

  const dir = path.join(process.cwd(), 'public', 'uploads', 'requests');
  await mkdir(dir, { recursive: true });

  const urls: string[] = [];
  for (const file of files) {
    if (file.size === 0) continue; // empty slot
    if (file.size > MAX_FILE_BYTES) {
      return { urls: [], error: `"${file.name}" dépasse 5 Mo.` };
    }
    if (!ALLOWED_MIME.has(file.type)) {
      return { urls: [], error: `"${file.name}" : seuls JPEG, PNG et WebP sont acceptés.` };
    }
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    const filename = `${randomUUID()}.${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, filename), buf);
    urls.push(`/uploads/requests/${filename}`);
  }
  return { urls };
}

const RequestSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Le téléphone doit contenir au moins 10 chiffres"),
  serviceType: z.string(),
  description: z.string().min(10, "Veuillez décrire votre projet avec plus de détails")
});

export async function submitRequest(formData: FormData) {
  // Anti-spam : honeypot + rate limit (5 demandes / heure / IP)
  if (isBot(formData)) {
    return { success: true }; // on fait croire au bot que c'est passé
  }
  const ip = await actionClientIp();
  const rl = rateLimit(`request:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.ok) {
    return { success: false, error: `Trop de demandes envoyées. Réessayez dans ${Math.ceil(rl.retryAfter / 60)} min.` };
  }

  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    serviceType: formData.get('serviceType') as string,
    description: formData.get('description') as string,
  };

  const validated = RequestSchema.safeParse(rawData);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  const { name, email, phone, serviceType, description } = validated.data;

  // Save uploaded images (max 5, JPEG/PNG/WebP, ≤5MB each).
  const rawFiles = formData.getAll('images').filter((v): v is File => v instanceof File);
  const uploaded = await saveRequestImages(rawFiles);
  if (uploaded.error) {
    return { success: false, error: uploaded.error };
  }
  const imagesJson = uploaded.urls.length > 0 ? JSON.stringify(uploaded.urls) : null;

  try {
    let client = db.prepare('SELECT id FROM clients WHERE email = ?').get(email) as { id: number } | undefined;

    if (!client) {
      const result = db.prepare('INSERT INTO clients (name, email, phone) VALUES (?, ?, ?)').run(name, email, phone);
      client = { id: result.lastInsertRowid as number };
    }

    db.prepare('INSERT INTO requests (client_id, service_type, description, images) VALUES (?, ?, ?, ?)').run(
      client.id,
      serviceType,
      description,
      imagesJson
    );

    revalidatePath('/admin/requests');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to submit request:', error);
    return { success: false, error: 'Une erreur est survenue lors de l\'envoi de votre demande.' };
  }
}

export async function submitReview(formData: FormData) {
  if (isBot(formData)) {
    return { success: true };
  }
  const ip = await actionClientIp();
  const rl = rateLimit(`review:${ip}`, 3, 60 * 60 * 1000);
  if (!rl.ok) {
    return { success: false, error: `Trop d'avis envoyés. Réessayez dans ${Math.ceil(rl.retryAfter / 60)} min.` };
  }

  const raw = {
    name: String(formData.get('name') ?? ''),
    rating: Number(formData.get('rating') ?? 0),
    comment: String(formData.get('comment') ?? ''),
  };
  const parsed = ReviewSubmitSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: formatZodError(parsed.error) };
  }
  const { name, rating, comment } = parsed.data;

  try {
    db.prepare(
      "INSERT INTO reviews (name, rating, comment, status) VALUES (?, ?, ?, 'pending')"
    ).run(name, rating, comment);
    revalidatePath('/admin/reviews');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to submit review:', error);
    return { success: false, error: 'Une erreur est survenue. Réessayez.' };
  }
}

export async function updateReviewStatus(id: number, status: string) {
  try {
    db.prepare('UPDATE reviews SET status = ? WHERE id = ?').run(status, id);
    revalidatePath('/');
    revalidatePath('/admin/reviews');
    return { success: true };
  } catch (error) {
    console.error('Failed to update review status:', error);
    return { success: false };
  }
}

export async function updateProject(formData: FormData) {
  const raw = {
    id: Number(formData.get('id')),
    title: String(formData.get('title') ?? ''),
    description: String(formData.get('description') ?? ''),
    status: String(formData.get('status') ?? ''),
    start_date: String(formData.get('start_date') ?? ''),
    end_date: String(formData.get('end_date') ?? ''),
    internal_notes: String(formData.get('internal_notes') ?? ''),
  };

  const parsed = ProjectUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: formatZodError(parsed.error) };
  }

  const { id, title, description, status, start_date, end_date, internal_notes } = parsed.data;

  try {
    db.prepare(
      `UPDATE projects
       SET title = ?, description = ?, status = ?, start_date = ?, end_date = ?, internal_notes = ?
       WHERE id = ?`
    ).run(
      title,
      description || null,
      status,
      start_date || null,
      end_date || null,
      internal_notes || null,
      id
    );

    revalidatePath(`/admin/projects/${id}`);
    revalidatePath('/admin/projects');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update project:', error);
    return { success: false, error: error.message };
  }
}

export async function updateClient(formData: FormData) {
  const raw = {
    id: Number(formData.get('id')),
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    address: String(formData.get('address') ?? ''),
  };

  const parsed = ClientUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: formatZodError(parsed.error) };
  }
  const { id, name, email, phone, address } = parsed.data;

  try {
    db.prepare('UPDATE clients SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?')
      .run(name, email || null, phone || null, address || null, id);
    revalidatePath(`/admin/clients/${id}`);
    revalidatePath('/admin/clients');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update client:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteClient(id: number) {
  if (!Number.isFinite(id) || id <= 0) {
    return { success: false, error: 'ID client invalide.' };
  }
  try {
    const tx = db.transaction(() => {
      db.prepare(
        'DELETE FROM payments WHERE project_id IN (SELECT id FROM projects WHERE client_id = ?)'
      ).run(id);
      db.prepare('DELETE FROM projects WHERE client_id = ?').run(id);
      db.prepare('DELETE FROM requests WHERE client_id = ?').run(id);
      db.prepare('DELETE FROM interventions WHERE client_id = ?').run(id);
      db.prepare('DELETE FROM clients WHERE id = ?').run(id);
    });
    tx();
    revalidatePath('/admin/clients');
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/requests');
    revalidatePath('/admin/projects');
    revalidatePath('/admin/payments');
  } catch (error: any) {
    console.error('Failed to delete client:', error);
    return { success: false, error: error.message };
  }
  redirect('/admin/clients');
}

export async function deletePayment(id: number) {
  if (!Number.isFinite(id) || id <= 0) {
    return { success: false, error: 'ID paiement invalide.' };
  }
  try {
    db.prepare('DELETE FROM payments WHERE id = ?').run(id);
    revalidatePath('/admin/payments');
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/projects');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete payment:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteProject(id: number) {
  if (!Number.isFinite(id) || id <= 0) {
    return { success: false, error: 'ID projet invalide.' };
  }
  try {
    const tx = db.transaction(() => {
      db.prepare('DELETE FROM payments WHERE project_id = ?').run(id);
      db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    });
    tx();
    revalidatePath('/admin/projects');
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/payments');
  } catch (error: any) {
    console.error('Failed to delete project:', error);
    return { success: false, error: error.message };
  }
  redirect('/admin/projects');
}

export async function deleteReview(id: number) {
  try {
    db.prepare('DELETE FROM reviews WHERE id = ?').run(id);
    revalidatePath('/');
    revalidatePath('/admin/reviews');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete review:', error);
    return { success: false };
  }
}
