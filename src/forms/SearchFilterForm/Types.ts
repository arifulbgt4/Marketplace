export interface SearchFilterFormProps {
  size?: string;
  onClose?: () => void;
}

export enum FIELDS {
  "keyword" = "keyword",
  "location" = "location",
}
