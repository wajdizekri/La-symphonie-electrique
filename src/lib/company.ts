/**
 * Coordonnées légales et de contact de l'entreprise.
 * À renseigner via .env (NEXT_PUBLIC_* pour les valeurs affichées côté client).
 * Les valeurs par défaut sont des PLACEHOLDERS — à remplacer avant mise en prod.
 */

export const company = {
  name: 'La Symphonie Électrique',
  owner: process.env.NEXT_PUBLIC_COMPANY_OWNER || '',
  legalForm: process.env.NEXT_PUBLIC_COMPANY_LEGAL_FORM || 'Entrepreneur Individuel',
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'contact@lasymphonieelectrique.fr',
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '',
  phoneHref: (process.env.NEXT_PUBLIC_COMPANY_PHONE || '').replace(/[^\d+]/g, ''),
  // Numéro WhatsApp au format international sans + ni espaces (ex: 33612345678).
  // Fallback : dérivé du téléphone si non précisé.
  whatsapp:
    (process.env.NEXT_PUBLIC_COMPANY_WHATSAPP || process.env.NEXT_PUBLIC_COMPANY_PHONE || '')
      .replace(/[^\d]/g, ''),
  address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || '74300 Cluses, Haute-Savoie',
  city: process.env.NEXT_PUBLIC_COMPANY_CITY || 'Cluses',
  postalCode: process.env.NEXT_PUBLIC_COMPANY_POSTAL || '74300',
  siret: process.env.NEXT_PUBLIC_COMPANY_SIRET || '',
  ape: process.env.NEXT_PUBLIC_COMPANY_APE || '',
  tva: process.env.NEXT_PUBLIC_COMPANY_TVA || '',
  insuranceDecennale: process.env.NEXT_PUBLIC_COMPANY_DECENNALE || 'Assurance Décennale',
  insuranceRcPro: process.env.NEXT_PUBLIC_COMPANY_RCPRO || 'RC Pro',
  facebook: process.env.NEXT_PUBLIC_COMPANY_FACEBOOK || 'https://www.facebook.com/profile.php?id=61575041172022',
};

/** N'affiche une ligne que si la valeur est renseignée (évite "SIRET : " vide). */
export function labeled(label: string, value: string): string | null {
  return value ? `${label} : ${value}` : null;
}
