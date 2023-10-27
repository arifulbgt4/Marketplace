import { Box, Container, Grid } from "@mui/material";

import ListingContents from "src/widgets/ListingDetailsContent";
import ListingDetailsBanner from "src/widgets/ListingDetailsBanner";
import ListingBooking from "src/widgets/ListingBooking";
import ListingRatings from "src/widgets/ListingRatings";
import { Album } from "src/widgets/Album";

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
    <Box>
      <Container>
        <Grid container columnSpacing={5}>
          <Grid item xs={12}>
            <Album albumImg={albumImg} />
          </Grid>
          <Grid container item xs={9}>
            <Grid item xs={12}>
              <ListingContents />
            </Grid>
            Listing Map
          </Grid>
          <Grid item container xs={3}>
            <Grid item xs={12}>
              <ListingBooking />
            </Grid>
            <Grid item xs={12}>
              sellerMiniProfile
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
            Review components
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ListingDetailsPage;
