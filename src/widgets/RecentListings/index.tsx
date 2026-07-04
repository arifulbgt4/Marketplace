"use client";
import { FC, useEffect, useState } from "react";
import { Box, Container, Grid, Typography, Skeleton } from "@mui/material";

import Listing from "src/widgets/Listing";
import { getFeaturedListings } from "src/server/listing";

import { RecentListingsProps } from "./Types";

const RecentListings: FC<RecentListingsProps> = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getFeaturedListings();
        setListings(data.slice(0, 6));
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <Box>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h3">Recent Properties</Typography>
          </Grid>

          <Grid item container xs={12} spacing={4}>
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Skeleton variant="rounded" height={300} />
                  </Grid>
                ))
              : listings.map((data) => (
                  <Grid item xs={12} md={4} key={data.id}>
                    <Listing
                      id={data.id}
                      slug={data.slug}
                      image={data.images[0] || ""}
                      title={data.title}
                      address={data.address}
                      price={data.price}
                      rating={data._count.reviews > 0 ? 4.5 : undefined}
                      description={data.description}
                    />
                  </Grid>
                ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RecentListings;
