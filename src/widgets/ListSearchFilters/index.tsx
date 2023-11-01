"use client";
import { FC } from "react";
import { Form as FinalForm } from "react-final-form";
import { Box, Divider } from "@mui/material";

import FilterCheckbox from "src/widgets/FilterCheckbox";
import {
  checkbox,
  checkbox2,
  radio,
  radio2,
  radio3,
} from "src/global/staticData";
import FilterRadio from "src/widgets/FilterRadio";
import SelectSearchFilter from "src/widgets/SelectSearchFilter";
import AutocompleteSearchFilter from "src/widgets/AutocompleteSearchFilter";
import SearchFilterButtons from "src/widgets/SearchFilterButtons";
import RangeFilter from "src/widgets/RangeFilter";

import { ListSearchFiltersProps } from "./Types";

const ListSearchFilters: FC<ListSearchFiltersProps> = ({
  onCloseMobileDrawer,
}) => {
  const onSubmitForm = async () => {};

  return (
    <Box p={{ xs: 1, md: 0 }} py={{ md: 5 }}>
      <FinalForm
        initialValues={{ priceRange: [16, 81] }}
        onSubmit={onSubmitForm}
        render={({ handleSubmit, values, errors, submitting }) => {
          return (
            <form onSubmit={handleSubmit}>
              <SearchFilterButtons onCloseMobileDrawer={onCloseMobileDrawer} />
              <SelectSearchFilter />
              <Divider sx={{ py: 2 }} />
              <RangeFilter title="Price" />
              <Divider />
              <AutocompleteSearchFilter />
              <Divider />
              <FilterCheckbox title="property type" checkbox={checkbox} />
              <Divider />
              <FilterCheckbox title="Must-haves" checkbox={checkbox2} />
              <Divider />
              <FilterRadio title="Furnishing" radio={radio} />
              <Divider />
              <FilterRadio title="Availability" radio={radio2} />
              <Divider />
              <FilterRadio title="Added to site" radio={radio3} />
            </form>
          );
        }}
      />
    </Box>
  );
};

export default ListSearchFilters;
