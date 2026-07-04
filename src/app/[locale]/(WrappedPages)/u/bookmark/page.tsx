"use client";
import { useState, useEffect } from "react";
import { Grid, Typography, Skeleton } from "@mui/material";

import BookmarkItemGroup from "src/widgets/BookmarkItemGroup";
import { getUserBookmarks } from "src/server/bookmark";

const BookmarkPage = () => {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const data = await getUserBookmarks();
        setBookmarks(data);
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  return (
    <Grid container rowSpacing={4}>
      <Grid item xs={12}>
        <Typography variant="h3" color={(theme) => theme.palette.text.primary}>
          Bookmarks
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {loading ? (
          <Skeleton variant="rounded" height={200} />
        ) : (
          <BookmarkItemGroup listings={bookmarks} />
        )}
      </Grid>
    </Grid>
  );
};

export default BookmarkPage;
