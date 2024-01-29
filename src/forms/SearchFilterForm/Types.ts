export interface SearchFilterFormProps {
  size?: string;
  onClose?: () => void;
}

export interface SearchLocationProps {
  size?: string;
}

interface StructuredFormatting {
  name: string;
  place_formatted: string;
}
export interface PlaceType {
  id: string;
  geometry: {
    coordinates: number[];
  };
  properties: StructuredFormatting;
}

export enum FIELDS {
  "keyword" = "keyword",
  "location" = "location",
}
