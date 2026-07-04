interface ReviewAuthor {
  id: string;
  name: string;
  image: string | null;
}

interface ReviewData {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  author: ReviewAuthor;
}

export interface ListingReviewsProps {
  listingId: string;
  reviews: ReviewData[];
}
