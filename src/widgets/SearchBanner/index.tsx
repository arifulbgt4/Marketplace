import { FC } from "react";
import { Typography, Box, Stack, Container } from "@mui/material";

import SearchFilterForm from "src/forms/SearchFilterForm";

import { SearchBannerProps } from "./Types";

const BANNER_BG =
  "https://images.unsplash.com/photo-1500964757637-c85e8a162699?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=925&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcwMDAyMTMzMg&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1920";

const SearchBanner: FC<SearchBannerProps> = () => {
  return (
    <Stack
      component="div"
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${BANNER_BG})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      gap={3}
      direction="column"
      justifyContent={{ xs: "flex-end", md: "center" }}
      bgcolor="red"
    >
      <Box textAlign="center">
        <Typography variant="h1" color="common.white">
          Find Home Together
        </Typography>
      </Box>
      <Stack>
        <Typography
          variant="h3"
          pb={4}
          color="common.white"
          sx={{ opacity: 0.8 }}
          textAlign="center"
        >
          25,000 rooms amd houses available now on Dream House
        </Typography>
        {/* <Box p={1.5} bgcolor="background.paper" borderRadius={{ md: 2 }}> */}
        <Container maxWidth="md">
          <SearchFilterForm />
        </Container>
        {/* </Box> */}
      </Stack>
    </Stack>
  );
};

export default SearchBanner;
