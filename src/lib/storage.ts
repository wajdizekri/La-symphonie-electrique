/**
 * Stockage de fichiers — abstrait le local (dev) vs Vercel Blob (prod serverless).
 *
 * ⚠️ SCAFFOLD : pas encore branché dans actions.ts. Le faire lors de la migration
 * (remplacer le bloc writeFile/mkdir de saveRequestImages par saveUpload()).
 *
 * Prod (Vercel) : nécessite la variable BLOB_READ_WRITE_TOKEN (auto sur Vercel
 * si l'intégration Blob est activée).
 * Local : écrit dans public/uploads/ comme avant.
 */
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

/**
 * Enregistre un fichier et renvoie son URL publique.
 * @param folder ex: "requests"
 */
export async function saveUpload(file: File, folder: string, ext: string): Promise<string> {
  const filename = `${randomUUID()}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());

  if (useBlob) {
    const blob = await put(`${folder}/${filename}`, buf, {
      access: 'public',
      contentType: file.type,
    });
    return blob.url; // URL absolue Vercel Blob
  }

  // Fallback local (dev / VPS avec disque)
  const dir = path.join(process.cwd(), 'public', 'uploads', folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buf);
  return `/uploads/${folder}/${filename}`;
}
