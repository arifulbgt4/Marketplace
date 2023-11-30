export interface OwnListingProps {
  data: {
    id: number;
    image: string;
    title: string;
    description: string;
    rating: number;
    slug: string;
    address: string;
  }[];
}
