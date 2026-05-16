import twilio from 'twilio';

const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;

const client = sid && token ? twilio(sid, token) : null;

// Accepts an already-E.164 international number ("+33...", "+216...") as-is,
// or falls back to French formatting if the caller used a local "06..." format.
export function normalizePhoneFR(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (trimmed.startsWith('+')) {
    const digits = trimmed.slice(1).replace(/\D/g, '');
    if (digits.length >= 8 && digits.length <= 15) return '+' + digits;
    return null;
  }
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('33')) return '+' + digits;
  if (digits.length === 10 && digits.startsWith('0')) return '+33' + digits.slice(1);
  if (digits.length === 9) return '+33' + digits;
  return null;
}

export async function sendSms(to: string, body: string): Promise<{ ok: boolean; error?: string }> {
  if (!client || !fromNumber) {
    return { ok: false, error: 'SMS provider not configured (TWILIO_* env missing)' };
  }
  const phone = normalizePhoneFR(to);
  if (!phone) {
    return { ok: false, error: `Invalid phone number: ${to}` };
  }
  try {
    await client.messages.create({ body, from: fromNumber, to: phone });
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}
