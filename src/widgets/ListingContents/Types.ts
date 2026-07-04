import { CheckboxGroupOptions } from "src/global/types";

export interface ListingContentsProps {
  description?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  maxGuests?: number | null;
  amenities?: string[];
}

export interface OfferProps {
  amenities?: string[];
}

export interface AmenitiesProps extends CheckboxGroupOptions {}
