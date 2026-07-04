interface ListingData {
  id: string;
  slug: string;
  title: string;
  description?: string;
  images: string[];
  address: string;
  price: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  _count?: { reviews: number };
}

export interface UserListingsProps {
  listings: ListingData[];
}
