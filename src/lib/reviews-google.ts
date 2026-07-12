/**
 * Vrais avis Google de la fiche LA SYMPHONIE ÉLECTRIQUE (Thyez) — 5/5 chacun.
 * Ils sont dans le code (et non en base) pour rester affichés quoi qu'il arrive :
 * la base de prod est régénérée à chaque build, les avis qui y sont insérés disparaissent.
 * Servent d'affichage par défaut si aucun avis approuvé n'est disponible en base.
 */
export type GoogleReview = { id: number; name: string; rating: number; comment: string };

export const googleReviews: GoogleReview[] = [
  { id: -1, name: 'Claudine Sauce', rating: 5, comment: "Merci pour l'installation rapide et les conseils. Très professionnel je recommande les yeux fermés !" },
  { id: -2, name: 'ION ERDIC', rating: 5, comment: 'Très réactif, travail soigné et de qualité. À garder dans les contacts.' },
  { id: -3, name: 'Orianne Aymard', rating: 5, comment: "Jaber est intervenu à deux reprises dans deux logements différents pour permettre l'accès à la fibre, alors que les techniciens Orange n'avaient pas réussi à résoudre le problème. À chaque fois, il a été très efficace et a su trouver des solutions là où d'autres bloquaient. Son travail est soigné, rapide et vraiment professionnel. En plus de ses compétences techniques, Jaber est très sympathique, ponctuel et agréable dans les échanges. Je le recommande vivement !" },
  { id: -4, name: 'Itidel Smati', rating: 5, comment: "Jaber fait preuve d'un grand professionnalisme et d'un réel sérieux. Son travail est soigné, transparent et de qualité. Je le recommande sans hésitation. Bonne continuation." },
  { id: -5, name: 'Selima Kadri', rating: 5, comment: 'Jaber est super professionnel, je ne peux que vous le recommander les yeux fermés. Travail de qualité, réalisé avec honnêteté. Bonne continuation pour la suite.' },
  { id: -6, name: 'Guillaume Chappaz', rating: 5, comment: 'Jaber est un super professionnel, disponible et juste dans ses devis et interventions.' },
  { id: -7, name: 'Benjamin Lazzari', rating: 5, comment: "Excellente expérience avec La Symphonie Électrique et son dirigeant Jaber. Professionnel, réactif et à l'écoute du client. Le travail est soigné, réalisé dans les délais et avec de très bons conseils tout au long du projet. On sent un vrai savoir-faire et une passion pour le métier. Je recommande vivement cette société pour tous vos travaux électriques." },
  { id: -8, name: 'michel Angelo', rating: 5, comment: 'Je le recommande vivement, très compétent et toujours disponible.' },
];
