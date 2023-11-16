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

const unsplashPhotos = [
  {
    src: "https://source.unsplash.com/8gVv6nxq6gY/1080x800",
    width: 1080,
    height: 800,
  },
  {
    src: "https://source.unsplash.com/Dhmn6ete6g8/1080x1620",
    width: 1080,
    height: 1620,
  },
  {
    src: "https://source.unsplash.com/RkBTPqPEGDo/1080x720",
    width: 1080,
    height: 720,
  },
  {
    src: "https://source.unsplash.com/Yizrl9N_eDA/1080x721",
    width: 1080,
    height: 721,
  },
  {
    src: "https://source.unsplash.com/KG3TyFi0iTU/1080x1620",
    width: 1080,
    height: 1620,
  },
  {
    src: "https://source.unsplash.com/Jztmx9yqjBw/1080x607",
    width: 1080,
    height: 607,
  },
  {
    src: "https://source.unsplash.com/-heLWtuAN3c/1080x608",
    width: 1080,
    height: 608,
  },
  {
    src: "https://source.unsplash.com/ALrCdq-ui_Q/1080x720",
    width: 1080,
    height: 720,
  },
  {
    src: "https://source.unsplash.com/1azAjl8FTnU/1080x1549",
    width: 1080,
    height: 1549,
  },
  {
    src: "https://source.unsplash.com/xOigCUcFdA8/1080x720",
    width: 1080,
    height: 720,
  },
  {
    src: "https://source.unsplash.com/twukN12EN7c/1080x694",
    width: 1080,
    height: 694,
  },
  {
    src: "https://source.unsplash.com/9UjEyzA6pP4/1080x1620",
    width: 1080,
    height: 1620,
  },
  {
    src: "https://source.unsplash.com/sEXGgun3ZiE/1080x720",
    width: 1080,
    height: 720,
  },
  {
    src: "https://source.unsplash.com/S-cdwrx-YuQ/1080x1440",
    width: 1080,
    height: 1440,
  },
  {
    src: "https://source.unsplash.com/q-motCAvPBM/1080x1620",
    width: 1080,
    height: 1620,
  },
  {
    src: "https://source.unsplash.com/Xn4L310ztMU/1080x810",
    width: 1080,
    height: 810,
  },
  {
    src: "https://source.unsplash.com/iMchCC-3_fE/1080x610",
    width: 1080,
    height: 610,
  },
  {
    src: "https://source.unsplash.com/X48pUOPKf7A/1080x160",
    width: 1080,
    height: 160,
  },
  {
    src: "https://source.unsplash.com/GbLS6YVXj0U/1080x810",
    width: 1080,
    height: 810,
  },
  {
    src: "https://source.unsplash.com/9CRd1J1rEOM/1080x720",
    width: 1080,
    height: 720,
  },
  {
    src: "https://source.unsplash.com/xKhtkhc9HbQ/1080x1440",
    width: 1080,
    height: 1440,
  },
];

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
            <Album photos={unsplashPhotos} />
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
