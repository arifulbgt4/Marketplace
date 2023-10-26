import { FC } from "react";
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
} from "@mui/material";
import { Checkbox } from "src/components/Input";
import { Form as FinalForm } from "react-final-form";
import { checkbox } from "src/global/staticData/index";

import { FilterCheckboxFormProps } from "./Types";

const FilterCheckboxForm: FC<FilterCheckboxFormProps> = () => {
  const onSubmitForm = async () => {};
  return (
    <FinalForm
      onSubmit={onSubmitForm}
      render={({ handleSubmit, values, errors, submitting }) => {
        console.log(values);
        return (
          <form onSubmit={handleSubmit}>
            <Grid container rowGap={2}>
              {checkbox.map((data) => {
                const { label, value } = data;
                return (
                  <Grid item xs={6}>
                    <FormControl component="fieldset" variant="standard">
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox name={value} />}
                          label={label}
                        />
                      </FormGroup>
                    </FormControl>
                  </Grid>
                );
              })}
            </Grid>
          </form>
        );
      }}
    />
  );
};

export default FilterCheckboxForm;
