export interface ListingProps {
  id: string;
  name?: string;
  isMark?: boolean;
  isGrid?: boolean;
  slug: string;
  image: string;
  title: string;
  price?: number;
  type?: string;
  description?: string;
  rating?: number;
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  services?: {
    bed?: string;
    bath?: string;
    area?: string;
    apartment?: string;
  };
}
