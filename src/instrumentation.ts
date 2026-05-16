export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { validateEnv } = await import('@/lib/env');
    validateEnv();
    const { initSentryServer } = await import('@/lib/sentry');
    initSentryServer();
  }
}

export async function onRequestError(...args: unknown[]) {
  if (!process.env.SENTRY_DSN) return;
  const Sentry = await import('@sentry/nextjs');
  // @ts-expect-error - signature transmise telle quelle au capteur Sentry
  Sentry.captureRequestError?.(...args);
}
