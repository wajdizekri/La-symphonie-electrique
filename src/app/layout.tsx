import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { company } from "@/lib/company";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://lasymphonieelectrique.fr';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "La Symphonie Électrique | Expert Électricien & Nouvelles Technologies",
    template: "%s | La Symphonie Électrique",
  },
  description: "Solutions électriques durables, fibre optique, mobilité électrique et VMC. Votre expert de confiance pour des installations aux normes NF C 15-100.",
  keywords: ["électricien", "fibre optique", "bornes de recharge", "VMC", "dépannage électrique", "IRVE", "NF C 15-100", "Symphonie Électrique"],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: 'La Symphonie Électrique',
    title: 'La Symphonie Électrique | Expert Électricien',
    description: 'Électricité, fibre optique, bornes IRVE et VMC. Installations aux normes NF C 15-100, garantie décennale, intervention 24/7.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Symphonie Électrique',
    description: 'Expert électricien, fibre optique, mobilité électrique et VMC.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "Electrician",
  "name": company.name,
  "image": "/hero.png",
  "description": "Expert Électricien, Fibre Optique, IRVE, VMC et Portail Automatique.",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "FR",
    "addressRegion": "Auvergne-Rhône-Alpes",
    "addressLocality": company.city,
    "postalCode": company.postalCode,
  },
  "geo": { "@type": "GeoCoordinates", "latitude": "46.0608", "longitude": "6.5790" },
  "areaServed": { "@type": "AdministrativeArea", "name": "Vallée de l'Arve, Haute-Savoie" },
  "sameAs": [company.facebook],
  "url": SITE_URL,
  ...(company.phoneHref ? { telephone: company.phoneHref } : {}),
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
