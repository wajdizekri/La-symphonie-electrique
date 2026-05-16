/**
 * Validation des variables d'environnement.
 * Appelée au démarrage via instrumentation.ts — bloque le boot si la config
 * est invalide ou dangereuse en production.
 */

const WEAK_SECRETS = new Set([
  'symphonie_electrique_secret_key_2024',
  'votre_secret_tres_securise_123456',
  'changeme',
  'secret',
]);

export function validateEnv() {
  const isProd = process.env.NODE_ENV === 'production';
  const errors: string[] = [];
  const warnings: string[] = [];

  // JWT_SECRET — obligatoire partout, fort en prod
  const jwt = process.env.JWT_SECRET;
  if (!jwt) {
    errors.push('JWT_SECRET manquant.');
  } else if (isProd) {
    if (WEAK_SECRETS.has(jwt)) {
      errors.push('JWT_SECRET utilise une valeur par défaut faible — interdit en production. Générez-en un : openssl rand -base64 48');
    } else if (jwt.length < 32) {
      errors.push('JWT_SECRET trop court en production (min 32 caractères).');
    }
  }

  // Base URL
  if (isProd && !process.env.NEXT_PUBLIC_BASE_URL) {
    warnings.push('NEXT_PUBLIC_BASE_URL non défini — les liens email/Stripe pointeront vers localhost.');
  }

  // Intégrations — warning seulement (dégradent gracieusement)
  if (isProd) {
    if (!process.env.STRIPE_SECRET_KEY) warnings.push('STRIPE_SECRET_KEY absent — paiements désactivés.');
    else if (process.env.STRIPE_SECRET_KEY.startsWith('sk_test_')) warnings.push('STRIPE_SECRET_KEY en mode TEST — aucun paiement réel ne sera encaissé.');
    if (!process.env.STRIPE_WEBHOOK_SECRET) warnings.push('STRIPE_WEBHOOK_SECRET absent — les paiements ne seront jamais confirmés.');
    if (!process.env.RESEND_API_KEY) warnings.push('RESEND_API_KEY absent — emails désactivés.');
    if (!process.env.TWILIO_ACCOUNT_SID) warnings.push('TWILIO_ACCOUNT_SID absent — SMS désactivés.');
  }

  for (const w of warnings) console.warn(`⚠️  [env] ${w}`);

  if (errors.length > 0) {
    console.error('❌ Configuration invalide :');
    for (const e of errors) console.error(`   - ${e}`);
    throw new Error(`Démarrage refusé : ${errors.length} erreur(s) de configuration. Voir ci-dessus.`);
  }
}
