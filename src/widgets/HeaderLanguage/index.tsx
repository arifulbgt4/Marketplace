"use client";
import { FC, useEffect, useState } from "react";
import {
  Grid,
  Stack,
  Typography,
  CardMedia,
  IconButton,
  Box,
  Modal,
  Container,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CloseIcon from "@mui/icons-material/Close";

import { HeaderLanguageProps } from "./Types";

const HeaderLanguage: FC<HeaderLanguageProps> = () => {
  const [value, setValue] = useState("1");
  const [open, setOpen] = useState(false);
  const [countris, setCountris] = useState([]);
  const handleOpenLangModal = () => {
    setOpen((prev) => !prev);
  };
  const handleCloseLangModal = () => {
    setOpen((prev) => !prev);
  };

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

  return (
    <Box mr={1} width={35}>
      <IconButton disableRipple onClick={handleOpenLangModal}>
        <LanguageIcon />
      </IconButton>
      <Modal open={open} onClose={handleCloseLangModal}>
        <Stack justifyContent="center" alignItems="center">
          <Container
            maxWidth="md"
            sx={{
              bgcolor: "background.paper",
              top: 77,
              position: "absolute",
              height: 580,
              borderRadius: 5,
            }}
          >
            <Box overflow="auto" height="100%" px={2} pb={5}>
              <Box
                sx={{
                  pt: 8,
                  height: "fit-content",
                  position: "sticky",
                  top: 0,
                  bgcolor: "background.paper",
                }}
              >
                <Box position="relative">
                  <IconButton
                    onClick={handleCloseLangModal}
                    sx={{
                      position: "absolute",
                      right: -12,
                      top: -25,
                      bgcolor: "action.active",
                      color: "#fff",
                      p: 0.2,
                      "&:hover": {
                        bgcolor: "action.active",
                        color: "#fff",
                      },
                    }}
                    disableRipple
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <TabContext value={value}>
                <Stack>
                  <TabList onChange={handleChange}>
                    <Tab sx={{ pl: 0 }} label="Language and region" value="1" />
                    <Tab label="Currency" value="2" />
                  </TabList>
                </Stack>
                <TabPanel sx={{ pl: 0 }} value="1">
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
                    <Typography variant="h5">
                      Choose a language and region
                    </Typography>
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
                <TabPanel sx={{ pl: 0 }} value="2">
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
                    <Typography variant="h5">
                      Choose a language and region
                    </Typography>
                    <Grid container rowSpacing={2}>
                      {countris.map((country: any, index) => {
                        return (
                          <Grid
                            item
                            xs={3}
                            key={index}
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            gap={1.25}
                            width={162}
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
          </Container>
        </Stack>
      </Modal>
    </Box>
  );
};

export default HeaderLanguage;

const CountriFlag = ({ name, flag, region, capital }: any) => {
  return (
    <>
      <Box p={1.25} border={1} borderColor="action.focus" borderRadius={1}>
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
