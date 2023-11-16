import { FC } from "react";
import { Form as FinalForm } from "react-final-form";
import { Select, TextField } from "src/components/Input";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { Grid } from "@mui/material";

const ReportForm: FC<ReportFormProps> = () => {
  const onSubmitForm = async () => {};
  return (
    <FinalForm
      onSubmit={onSubmitForm}
      render={({ handleSubmit, values, errors, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Select
                    name="report"
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    label="reson"
                  >
                    <MenuItem value={1}>
                      Listings in the wrong category
                    </MenuItem>
                    <MenuItem value={2}>Duplicate posts</MenuItem>
                    <MenuItem value={3}>Prohibited items</MenuItem>
                    <MenuItem value={4}>Counterfeits</MenuItem>
                    <MenuItem value={5}>
                      Listings containing irrelevant keywords
                    </MenuItem>
                    <MenuItem value={6}>Offensive content</MenuItem>
                    <MenuItem value={7}>Suspicious activity</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  name="message"
                  label="Message"
                  placeholder="Message"
                />
              </Grid>
            </Grid>
          </form>
        );
      }}
    />
  );
};

export default ReportForm;
