import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

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
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Electrician",
              "name": "La Symphonie Électrique",
              "image": "/hero.png",
              "description": "Expert Électricien, Fibre Optique et Mobilité Électrique.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "FR",
                "addressRegion": "Auvergne-Rhône-Alpes",
                "addressLocality": "Cluses",
                "postalCode": "74300"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "46.0608",
                "longitude": "6.5790"
              },
              "areaServed": {
                "@type": "AdministrativeArea",
                "name": "Vallée de l'Arve, Haute-Savoie"
              },
              "sameAs": [
                "https://www.facebook.com/profile.php?id=61575041172022"
              ],
              "url": "https://lasymphonieelectrique.fr",
              "telephone": "+3308841662",
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                  "opens": "00:00",
                  "closes": "23:59"
                }
              ]
            })
          }}
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
