import { notFound } from "next/navigation";
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
import { getListingBySlug } from "src/server/listing";

interface Props {
  params: Promise<{ slug: string }>;
}

const ListingDetailsPage = async ({ params }: Props) => {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);

  if (!listing) {
    notFound();
  }

  const photos = listing.images.map((src) => ({
    src,
    width: 1080,
    height: 800,
  }));

  return (
    <Box pt={5}>
      <Container maxWidth="lg">
        <Grid container rowSpacing={5}>
          <Grid item xs={12}>
            <ListingHeader
              title={listing.title}
              rating={
                listing._count.reviews > 0
                  ? listing.reviews.reduce((acc, r) => acc + r.rating, 0) /
                    listing.reviews.length
                  : 0
              }
              review={listing._count.reviews}
              creator={listing.user.name}
              address={listing.address}
            />
          </Grid>
          <Grid item xs={12}>
            <Album
              photos={
                photos.length > 0
                  ? photos
                  : [{ src: "", width: 1080, height: 800 }]
              }
            />
          </Grid>
          <Hidden mdUp>
            <Grid item xs={12}>
              <Host
                src={listing.user.image || ""}
                rating={4.9}
                review={listing._count.reviews}
                name={listing.user.name}
              />
            </Grid>
          </Hidden>
          <Grid item container xs={12} columnSpacing={8.7}>
            <Grid container item xs={12} md={8}>
              <Grid item xs={12}>
                <ListingContents
                  description={listing.description}
                  bedrooms={listing.bedrooms}
                  bathrooms={listing.bathrooms}
                  area={listing.area}
                  maxGuests={listing.maxGuests}
                  amenities={listing.amenities}
                />
              </Grid>
              <Grid item xs={12}>
                <ListingLocation address={listing.address} />
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
                  <BookingForm
                    listingId={listing.id}
                    price={Number(listing.price)}
                    maxGuests={listing.maxGuests}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ListingReport />
                </Grid>
                <Grid item xs={12}>
                  <Host
                    src={listing.user.image || ""}
                    rating={4.9}
                    review={listing._count.reviews}
                    name={listing.user.name}
                  />
                </Grid>
              </Grid>
            </Hidden>
          </Grid>
          {listing._count.reviews > 0 && (
            <Grid item xs={12}>
              <ListingRatings
                avaragerating={
                  listing.reviews.reduce((acc, r) => acc + r.rating, 0) /
                  listing.reviews.length
                }
                review={listing._count.reviews}
                rating={{
                  cleanliness:
                    listing.reviews.reduce(
                      (acc, r) => acc + (r.cleanliness || 0),
                      0,
                    ) / listing.reviews.length,
                  communication:
                    listing.reviews.reduce(
                      (acc, r) => acc + (r.communication || 0),
                      0,
                    ) / listing.reviews.length,
                  checkIn:
                    listing.reviews.reduce(
                      (acc, r) => acc + (r.checkIn || 0),
                      0,
                    ) / listing.reviews.length,
                  accuracy:
                    listing.reviews.reduce(
                      (acc, r) => acc + (r.accuracy || 0),
                      0,
                    ) / listing.reviews.length,
                  location:
                    listing.reviews.reduce(
                      (acc, r) => acc + (r.location || 0),
                      0,
                    ) / listing.reviews.length,
                  value:
                    listing.reviews.reduce(
                      (acc, r) => acc + (r.value || 0),
                      0,
                    ) / listing.reviews.length,
                }}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <ListingReviews listingId={listing.id} reviews={listing.reviews} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ListingDetailsPage;
