import { FC } from "react";
import { Typography, Box, Paper, Stack } from "@mui/material";

import SearchFilterForm from "src/forms/SearchFilterForm";

import { SearchBannerProps } from "./Types";

const bannaerimg =
  "https://scontent.fdac151-1.fna.fbcdn.net/v/t1.15752-9/384820780_347011921016699_8313359896565317700_n.png?_nc_cat=108&ccb=1-7&_nc_sid=ae9488&_nc_eui2=AeEsLQgGhu08CR-DeUfDtMCe5CjaR2Hn_ezkKNpHYef97N935-sm0XaD9SVIEYXyWpTvjQrW4un2e_UAfpl4a086&_nc_ohc=4FHVr7aI6sYAX-n0HLO&_nc_ht=scontent.fdac151-1.fna&oh=03_AdT75Hvg4NzRPcxDhqYD4xxuxvcPDBP9wr3zA80zkKOZ3A&oe=654771B8";

const SearchBanner: FC<SearchBannerProps> = () => {
  return (
    <Stack
      component="div"
      sx={{
        minHeight: 600,
        backgroundImage: `url(${bannaerimg})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      gap={3}
      direction="column"
      justifyContent="center"
      alignItems="center"
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
        >
          25,000 rooms amd houses available now on Dream House{" "}
        </Typography>
        <SearchFilterForm />
      </Stack>
    </Stack>
  );
};

export default SearchBanner;
