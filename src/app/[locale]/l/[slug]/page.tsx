import { Box, Container, Grid, Hidden } from "@mui/material";

import ListingContents from "src/widgets/ListingContents";
import ListingRatings from "src/widgets/ListingRatings";
import { Album } from "src/widgets/Album";
import ListingReviews from "src/widgets/ListingReviews";
import ListingHeader from "src/widgets/ListingHeader";
import ListingLocation from "src/widgets/ListingLocation";
import BookingForm from "src/forms/BookingForm";
import ListingReport from "src/widgets/ListingReport";
import Host from "src/widgets/Host";

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
          <Hidden mdUp>
            <Grid item xs={12}>
              <Host
                src="https://thumbs.dreastime.com/b/unknown-male-avatar-profile-image-businessman-vector-unknown-male-avatar-profile-image-businessman-vector-profile-179373829.jpg"
                rating={4.9}
                review={12}
                name="Jhon Doue"
              />
            </Grid>
          </Hidden>
          <Grid item container xs={12} columnSpacing={8.7}>
            <Grid container item xs={12} md={8}>
              <Grid item xs={12}>
                <ListingContents />
              </Grid>
              <Grid item xs={12}>
                <ListingLocation address="2118 Thornridge Cir. Syracuse, Connecticut 35624" />
              </Grid>
            </Grid>
            <Hidden mdDown>
              <Grid
                item
                container
                rowSpacing={1}
                xs={4}
                sx={{
                  height: "fit-content",
                  position: "sticky",
                  top: 70,
                }}
              >
                <Grid item xs={12}>
                  <BookingForm />
                </Grid>
                <Grid item xs={12}>
                  <ListingReport />
                </Grid>
                <Grid item xs={12}>
                  <Host
                    src="https://thumbs.dreastime.com/b/unknown-male-avatar-profile-image-businessman-vector-unknown-male-avatar-profile-image-businessman-vector-profile-179373829.jpg"
                    rating={4.9}
                    review={12}
                    name="Jhon Doue"
                  />
                </Grid>
              </Grid>
            </Hidden>
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
