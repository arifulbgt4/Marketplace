import { FC } from "react";
import { Typography, Box, Paper } from "@mui/material";

import SearchFilterForm from "src/forms/SearchFilterForm";

import { SearchBannerProps } from "./Types";

const bannaerimg =
  "https://scontent.fdac151-1.fna.fbcdn.net/v/t1.15752-9/384820780_347011921016699_8313359896565317700_n.png?_nc_cat=108&ccb=1-7&_nc_sid=ae9488&_nc_eui2=AeEsLQgGhu08CR-DeUfDtMCe5CjaR2Hn_ezkKNpHYef97N935-sm0XaD9SVIEYXyWpTvjQrW4un2e_UAfpl4a086&_nc_ohc=4FHVr7aI6sYAX-n0HLO&_nc_ht=scontent.fdac151-1.fna&oh=03_AdT75Hvg4NzRPcxDhqYD4xxuxvcPDBP9wr3zA80zkKOZ3A&oe=654771B8";

const SearchBanner: FC<SearchBannerProps> = () => {
  return (
    <Paper sx={{ width: "100%", minHeight: 500, position: "relative" }}>
      <Box
        component="div"
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `url(${bannaerimg})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
        gap={3}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        alignSelf="stretch"
      >
        <Typography variant="h2" fontWeight="300">
          Find Home Together
        </Typography>
        <Typography variant="h4">
          25,000 rooms amd houses available now on Dream House{" "}
        </Typography>
        <Box position="relative">
          <Box position="absolute">
            <SearchFilterForm />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default SearchBanner;
