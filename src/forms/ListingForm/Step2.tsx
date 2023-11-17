import { FC } from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { Bed, CheckCircle, CheckCircleOutline } from "@mui/icons-material";

import { CheckboxGroup } from "src/components/Input";
import { Amenities } from "src/widgets/ListingContents";
import { amenities } from "src/global/staticData";

import { Step2Props } from "./Types";

const Step2: FC<Step2Props> = () => {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
        <CheckboxGroup
          name="aminities"
          spacing={3}
          item={2}
          options={amenities}
          renderLabel={() => <Typography variant="h5">Amenities</Typography>}
          renderCheckbox={({ label, value, checked, data }) => (
            <>
              <Box position="absolute" right={5} top={5}>
                {!checked ? <CheckCircleOutline /> : <CheckCircle />}
              </Box>
              <Amenities label={label} value={value} data={data} />
            </>
          )}
        />
      </Grid>
    </Grid>
  );
};

export default Step2;
