import { FC } from "react";
import { Grid, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import Listing from "src/widgets/Listing";
import { ownListingData } from "src/global/staticData";

import { OwnListingProps } from "./Types";

const OwnListing: FC<OwnListingProps> = () => {
  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          placeholder="Search"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} container spacing={5}>
        {ownListingData.map((data) => {
          const {
            id,
            image,
            title,
            price,
            description,
            rating,
            slug,
            address,
          } = data;
          return (
            <Grid item xs={12} md={6} key={id}>
              <Listing
                id={id}
                slug={slug}
                image={image}
                title={title}
                price={price}
                description={description}
                rating={rating}
                address={address}
              />
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default OwnListing;
