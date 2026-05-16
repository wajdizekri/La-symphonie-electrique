/**
 * Init Sentry — no-op tant que SENTRY_DSN n'est pas défini.
 * Met SENTRY_DSN (serveur) et NEXT_PUBLIC_SENTRY_DSN (client) dans les env Vercel
 * pour activer le monitoring d'erreurs en prod.
 */
import * as Sentry from '@sentry/nextjs';

export function initSentryServer() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    environment: process.env.NODE_ENV,
    enabled: process.env.NODE_ENV === 'production',
  });
}
