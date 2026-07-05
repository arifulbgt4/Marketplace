"use client";
import { FC, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Grid, Container, Typography, Skeleton } from "@mui/material";

import Listing from "src/widgets/Listing";
import { getFeaturedListings } from "src/server/listing";

import { FeaturedListingsProps } from "./Types";

const FeaturedListings: FC<FeaturedListingsProps> = () => {
  const t = useTranslations();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getFeaturedListings();
        setListings(data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  if (loading) {
    return (
      <Container>
        <Grid spacing={5} container justifyContent="center">
          {Array.from({ length: 8 }).map((_, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={2.4}
              xxl={2}
              key={index}
            >
              <Skeleton variant="rounded" height={300} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (listings.length === 0) {
    return (
      <Container>
        <Typography textAlign="center" py={4} color="text.secondary">
          No listings found
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Grid spacing={5} container justifyContent="center">
        {listings.map((listing) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2.4}
            xxl={2}
            key={listing.id}
          >
            <Listing
              id={listing.id}
              address={listing.address}
              slug={listing.slug}
              image={listing.images[0] || ""}
              title={listing.title}
              description={listing.description}
              rating={listing._count.reviews > 0 ? 4.5 : undefined}
              price={Number(listing.price)}
              type={listing.type}
              bedrooms={listing.bedrooms}
              bathrooms={listing.bathrooms}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FeaturedListings;
