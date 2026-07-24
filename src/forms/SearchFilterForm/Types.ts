export interface SearchFilterFormProps {
  size?: "small" | "medium";
  onClose?: () => void;
}

export enum FIELDS {
  query = "query",
  minPrice = "minPrice",
  sort = "sort",
}
