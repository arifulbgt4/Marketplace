export interface OwnListingProps {
  data: {
    id: string;
    images: string[];
    title: string;
    description?: string;
    slug: string;
    address: string;
    price: number;
    status: string;
    _count?: { reviews: number };
  }[];
}
