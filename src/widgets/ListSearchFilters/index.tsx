"use client";
import { FC } from "react";
import { Form as FinalForm } from "react-final-form";

import FilterCheckbox from "src/widgets/FilterCheckbox";
import {
  checkbox,
  checkbox2,
  radio,
  radio2,
  radio3,
} from "src/global/staticData";
import FilterRadio from "src/widgets/FilterRadio";

import { ListSearchFiltersProps } from "./Types";

const ListSearchFilters: FC<ListSearchFiltersProps> = () => {
  const onSubmitForm = async () => {};

  return (
    <FinalForm
      onSubmit={onSubmitForm}
      render={({ handleSubmit, values, errors, submitting }) => {
        console.log(values);
        return (
          <form onSubmit={handleSubmit}>
            <FilterCheckbox title="property type" checkbox={checkbox} />
            <FilterCheckbox title="Must-haves" checkbox={checkbox2} />
            <FilterRadio title="Furnishing" radio={radio} />
            <FilterRadio title="Availability" radio={radio2} />
            <FilterRadio title="Added to site" radio={radio3} />
          </form>
        );
      }}
    />
  );
};

export default ListSearchFilters;
