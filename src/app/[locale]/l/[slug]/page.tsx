import { Box, Container, Grid } from "@mui/material";

import ListingContents from "src/widgets/ListingContents";
import ListingRatings from "src/widgets/ListingRatings";
import { Album } from "src/widgets/Album";
import ListingReviews from "src/widgets/ListingReviews";
import ListingHeader from "src/widgets/ListingHeader";
import ListingLocation from "src/widgets/ListingLocation";
import BookingForm from "src/forms/BookingForm";

const ListingDetailsPage = () => {
  return (
    <Box pt={5}>
      <Container maxWidth="lg">
        <Grid container rowSpacing={5}>
          <Grid item xs={12}>
            <ListingHeader
              title="Bungalow 15 : Calm:Serene:Soulful"
              rating={4.92}
              review={12}
              creator="Superhost"
              address="2118 Thornridge Cir. Syracuse, Connecticut 35624"
            />
          </Grid>
          <Grid item xs={12}>
            <Album />
          </Grid>
          <Grid item container xs={12} columnSpacing={8.7} pb={5}>
            <Grid container item xs={8}>
              <Grid item xs={12}>
                <ListingContents />
              </Grid>
              <Grid item xs={12}>
                <ListingLocation address="2118 Thornridge Cir. Syracuse, Connecticut 35624" />
              </Grid>
            </Grid>
            <Grid
              item
              container
              xs={4}
              sx={{
                height: "fit-content",
                position: "sticky",
                top: 80,
              }}
            >
              <Grid item xs={12}>
                <BookingForm />
              </Grid>
              <Grid item xs={12}>
                sellerMiniProfile
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <ListingRatings
              avaragerating={4.93}
              review={12}
              rating={{
                cleanliness: 4,
                communication: 5,
                checkIn: 2,
                accuracy: 8,
                location: 9,
                value: 7,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <ListingReviews />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ListingDetailsPage;
