import db from '@/lib/db';
import HomeContent from './HomeContent';

export default function Home() {
  const reviews = db.prepare(
    "SELECT id, name, rating, comment FROM reviews WHERE status = 'approved' ORDER BY created_at DESC LIMIT 6"
  ).all() as { id: number; name: string; rating: number; comment: string }[];

  return <HomeContent reviews={reviews} />;
}
