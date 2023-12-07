import { FC, useEffect, useState } from "react";
import {
  Grid,
  Stack,
  Typography,
  CardMedia,
  IconButton,
  Box,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CloseIcon from "@mui/icons-material/Close";

import { HeaderLanguageProps } from "./Types";

const HeaderLanguage: FC<HeaderLanguageProps> = ({ handleCloseLangModal }) => {
  const [value, setValue] = useState("1");
  const [countris, setCountris] = useState([]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCountris(data);
      });
  }, []);
  //   console.log("object", country.name.common);
  return (
    <Box overflow="hidden">
      <TabContext value={value}>
        <Stack
          position="relative"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <TabList onChange={handleChange}>
            <Tab label="Language and region" value="1" />
            <Tab label="Currency" value="2" />
          </TabList>
          <IconButton
            onClick={handleCloseLangModal}
            sx={{
              position: "absolute",
              right: 0,
              top: 0,
              bgcolor: "action.active",
              color: "#fff",
              p: 0.5,
              "&:hover": {
                bgcolor: "action.active",
                color: "#fff",
              },
            }}
            disableRipple
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
        <TabPanel value="1">
          <Stack pb={4} gap={3}>
            <Typography variant="h5">
              Suggested languages and regions
            </Typography>

            <Grid container rowSpacing={2}>
              {countris.slice(0, 2).map((country: any, index) => {
                return (
                  <Grid
                    item
                    xs={3}
                    key={index}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    gap={1.25}
                  >
                    <CountriFlag
                      name={country.name.common}
                      region={country.region}
                      flag={country.flags.svg}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Stack>
          <Stack gap={3}>
            <Typography variant="h5">Choose a language and region</Typography>
            <Grid container rowSpacing={2}>
              {countris.map((country: any, index) => {
                console.log("object", country);
                return (
                  <Grid
                    item
                    xs={3}
                    key={index}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    gap={1.25}
                  >
                    <CountriFlag
                      name={country.name.common}
                      region={country.region}
                      flag={country.flags.svg}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Stack>
        </TabPanel>
        <TabPanel value="2">
          <Stack pb={4} gap={3}>
            <Typography variant="h5">
              Suggested languages and regions
            </Typography>
            <Grid container rowSpacing={2}>
              {countris.slice(0, 2).map((country: any, index) => {
                return (
                  <Grid
                    item
                    xs={3}
                    key={index}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    gap={1.25}
                  >
                    <CountriFlag
                      name={country.name.common}
                      flag={country.flags.svg}
                      capital={country.capital}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Stack>
          <Stack gap={3}>
            <Typography variant="h5">Choose a language and region</Typography>
            <Grid container rowSpacing={2}>
              {countris.map((country: any, index) => {
                console.log("object", country);
                return (
                  <Grid
                    item
                    xs={3}
                    key={index}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    gap={1.25}
                  >
                    <CountriFlag
                      name={country.name.common}
                      flag={country.flags.svg}
                      capital={country.capital}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Stack>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default HeaderLanguage;

const CountriFlag = ({ name, flag, region, capital }: any) => {
  return (
    <>
      <Box
        width={62}
        p={1.25}
        border={1}
        borderColor="action.focus"
        borderRadius={1}
      >
        <CardMedia component="img" height={24} image={flag} />
      </Box>
      <Box>
        <Typography variant="h5">{name}</Typography>
        {region && (
          <Typography color="text.secondary" variant="body2">
            {region}
          </Typography>
        )}
        {capital && (
          <Typography color="text.secondary" variant="body2">
            {capital}
          </Typography>
        )}
      </Box>
    </>
  );
};
