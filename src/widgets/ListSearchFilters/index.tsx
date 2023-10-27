"use client";
import { FC } from "react";

import FilterCheckbox from "src/widgets/FilterCheckbox";
import { Form as FinalForm } from "react-final-form";
import { checkbox, checkbox2 } from "src/global/staticData";

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
          </form>
        );
      }}
    />
  );
};

export default ListSearchFilters;
