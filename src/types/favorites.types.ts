export interface Favorites {
  id: string;
  userId: string;
  establishmentId: string;
  addedAt: string;
  establishment: FavoriteEstablishment;
}

export interface FavoriteEstablishment {
  name: string;
  address: string;
  logo: string;
  banner: string;
  rating: string;
}
