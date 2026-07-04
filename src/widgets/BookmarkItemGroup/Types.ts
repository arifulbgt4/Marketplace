interface BookmarkListingData {
  id: string;
  slug: string;
  title: string;
  images: string[];
  address: string;
  price: number;
}

export interface BookmarkItemGroupProps {
  listings: BookmarkListingData[];
}
