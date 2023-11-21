import { FC } from "react";
import { Form as FinalForm } from "react-final-form";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import { Button, Grid, Typography } from "@mui/material";

import { Select, TextField } from "src/components/Input";

import { ReportFormProps } from "./Types";

const ReportForm: FC<ReportFormProps> = ({ handleClose }) => {
  const onSubmitForm = async () => {};
  return (
    <FinalForm
      onSubmit={onSubmitForm}
      render={({ handleSubmit, values, errors, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5">Report</Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Select
                    size="small"
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
              <Grid item xs={12} container justifyContent="space-between">
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" onClick={handleClose}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        );
      }}
    />
  );
};

export default ReportForm;
