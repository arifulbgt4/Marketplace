"use client";
import { FC } from "react";

import { ListSearchFiltersProps } from "./Types";
import FilterCheckbox from "src/widgets/FilterCheckbox";
import { Form as FinalForm } from "react-final-form";
import { checkbox } from "src/global/staticData";

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
          </form>
        );
      }}
    />
  );
};

export default ListSearchFilters;
