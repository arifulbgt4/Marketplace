import { FC } from "react";
import { Grid } from "@mui/material";

import { bookMarkData } from "src/global/staticData";
import BookmarkItem from "../BookmarkItem";

import { BookmarkItemGroupProps } from "./Types";

const BookmarkItemGroup: FC<BookmarkItemGroupProps> = () => {
  return (
    <Grid container spacing={4}>
      {bookMarkData.map((data) => {
        const { id, title, subheader, bedroom, bathroom, rent } = data;
        return (
          <Grid key={id} item xs={12} sm={6}>
            <BookmarkItem
              id={id}
              title={title}
              subheader={subheader}
              bedroom={bedroom}
              bathroom={bathroom}
              rent={rent}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default BookmarkItemGroup;
