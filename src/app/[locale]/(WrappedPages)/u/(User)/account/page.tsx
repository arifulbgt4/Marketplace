import { Grid } from "@mui/material";

import OwnerBasicInfo from "src/widgets/OwnerBasicInfo";
import OwnerListings from "src/widgets/OwnerListings";
import OwnerReview from "src/widgets/OwnerReview";

export default function Account() {
  return (
    <Grid container columnSpacing={10} rowSpacing={3}>
      <Grid item md={4} xs={12}>
        Owner Profile
      </Grid>
      <Grid item container xs={8} rowSpacing={5}>
        <Grid item xs={12}>
          about
        </Grid>
        <Grid item xs={12}>
          <OwnerBasicInfo />
        </Grid>
        <Grid item xs={12}>
          <OwnerListings />
        </Grid>
        <Grid item xs={12}>
          <OwnerReview />
        </Grid>
      </Grid>
    </Grid>
  );
}
