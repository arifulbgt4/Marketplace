import { FC } from "react";

import { ListSearchFiltersProps } from "./Types";
import FilterCheckbox from "src/widgets/FilterCheckbox";

const ListSearchFilters: FC<ListSearchFiltersProps> = () => {
  return <FilterCheckbox title="property type" />;
};

export default ListSearchFilters;
