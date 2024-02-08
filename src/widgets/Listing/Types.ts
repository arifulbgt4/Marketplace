export interface ListingProps {
  id: number;
  name?: string;
  isMark?: boolean;
  isGrid?: boolean;
  slug: string;
  image: string;
  title: string;
  price?: number;
  description?: string;
  rating?: number;
  address: string;
  services?: {
    bed?: string;
    bath?: string;
    area?: string;
    apartment?: string;
  };
}
