import { Box, Container, Grid } from "@mui/material";

import ListingContents from "src/widgets/ListingContents";
import ListingRatings from "src/widgets/ListingRatings";
import { Album } from "src/widgets/Album";
import Reviews from "src/widgets/Reviews";
import ListingHeader from "src/widgets/ListingHeader";
import ListingLocation from "src/widgets/ListingLocation";
import ListingBooking from "src/widgets/ListingBooking";

const albumImg = [
  "https://source.unsplash.com/8gVv6nxq6gY",
  "https://source.unsplash.com/Dhmn6ete6g8",
  "https://source.unsplash.com/RkBTPqPEGDo",
  "https://source.unsplash.com/Yizrl9N_eDA",
  "https://source.unsplash.com/KG3TyFi0iTU",
  "https://source.unsplash.com/8gVv6nxq6gY",
];

const ListingDetailsPage = () => {
  return (
    <Box pt={5}>
      <Container>
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
            <Album albumImg={albumImg} />
          </Grid>
          <Grid item container xs={12} columnSpacing={8.7} pb={5}>
            <Grid container item xs={9}>
              <Grid item xs={12}>
                <ListingContents />
              </Grid>
              <Grid item xs={12}>
                <ListingLocation address="2118 Thornridge Cir. Syracuse, Connecticut 35624" />
              </Grid>
            </Grid>
            <Grid item container xs={3}>
              <Grid item xs={12}>
                <ListingBooking />
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
            <Reviews />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ListingDetailsPage;
