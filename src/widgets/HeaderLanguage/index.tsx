"use client";
import { FC, useState } from "react";
import {
  Grid,
  Stack,
  Typography,
  IconButton,
  Box,
  Modal,
  Container,
  Avatar,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CloseIcon from "@mui/icons-material/Close";

import CounttryLanRegion from "src/components/CountryLanRegion";

import { HeaderLanguageProps } from "./Types";

const HeaderLanguage: FC<HeaderLanguageProps> = () => {
  const [value, setValue] = useState("1");
  const [open, setOpen] = useState(false);
  const [countris, setCountris] = useState([]);
  const [region, setRegion] = useState({
    flag: "https://cdn.britannica.com/29/22529-004-ED1907BE/Union-Flag-Cross-St-Andrew-of-George.jpg",
    language: "Bengali",
  });
  const handleOpenLangModal = () => {
    setOpen((prev) => !prev);
  };
  const handleCloseLangModal = () => {
    setOpen((prev) => !prev);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // fetch("https://restcountries.com/v3.1/all")
  //   .then((res) => {
  //     return res.json();
  //   })
  //   .then((data) => {
  //     setCountris(data);
  //   });

  return (
    <Box mr={{ md: 2 }}>
      <Stack
        onClick={handleOpenLangModal}
        flexDirection="row"
        gap={1}
        justifyContent="center"
        alignItems="center"
        px={{ md: 2 }}
        py={{ md: 1 }}
        borderRadius={40}
        sx={(theme) => ({
          color: "primary.main",
          cursor: "pointer",
          "&:hover": {
            bgcolor: "action.hover",
            color: "common.black",
          },
        })}
      >
        <Avatar sx={{ height: 24, width: 24 }} src={region.flag} />
        <Typography variant="h6">EN</Typography>
      </Stack>
      <Modal open={open} onClose={handleCloseLangModal}>
        <Stack justifyContent="center" alignItems="center">
          <Container
            maxWidth="md"
            sx={{
              bgcolor: "background.paper",
              top: { md: 77 },
              bottom: 0,
              position: "absolute",
              height: { md: 580, xs: "calc(100vh - 48px)" },
              borderRadius: 2.5,
              borderBottomLeftRadius: { xs: 0, md: 10 },
              borderBottomRightRadius: { xs: 0, md: 10 },
            }}
          >
            <Box position="relative">
              <IconButton
                onClick={handleCloseLangModal}
                sx={{
                  position: "absolute",
                  zIndex: 1,
                  right: { xs: -8, md: 0 },
                  top: { xs: -32, md: 25 },
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
            <Box
              sx={{
                overflow: "scroll",
                "&::-webkit-scrollbar": {
                  width: 0,
                },
              }}
              height="100%"
              px={2}
              pb={5}
            >
              {/* <Box
                sx={{
                  height: "fit-content",
                  position: "sticky",
                  top: 0,
                  bgcolor: "background.paper",
                  pt: 5,
                }}
              ></Box> */}
              <TabContext value={value}>
                <Stack mt={{ xs: 2, md: 3.5 }}>
                  <TabList onChange={handleChange}>
                    <Tab sx={{ pl: 0 }} label="Language and region" value="1" />
                    <Tab label="Currency" value="2" />
                  </TabList>
                </Stack>
                <TabPanel sx={{ px: 0 }} value="1">
                  <Stack pb={4} gap={3}>
                    <Typography variant="h5">
                      Suggested languages and regions
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid
                        item
                        xs={6}
                        md={3}
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        gap={1.25}
                      >
                        <CounttryLanRegion
                          name="Bangladesh"
                          language="Bengali"
                          flag="https://t4.ftcdn.net/jpg/01/04/47/13/360_F_104471360_1xohRUSRjfdGxoaRDtLg2z4ztBHkT21K.jpg"
                        />
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        md={3}
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        gap={1.25}
                      >
                        <CounttryLanRegion
                          name="Unaited Kingdom"
                          language="Bengali"
                          flag="https://cdn.britannica.com/29/22529-004-ED1907BE/Union-Flag-Cross-St-Andrew-of-George.jpg"
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                  <Stack gap={3}>
                    <Typography variant="h5">
                      Choose a language and region
                    </Typography>
                    <Grid container spacing={1}>
                      {countris.map((country: any, index) => {
                        if (country?.languages) {
                          const languages: any = Object.values(
                            country?.languages
                          );
                          return (
                            <Grid
                              item
                              xs={6}
                              md={3}
                              key={index}
                              display="flex"
                              flexDirection="row"
                              alignItems="center"
                              gap={1.25}
                            >
                              <CounttryLanRegion
                                indexCoun={index}
                                name={country.name.common}
                                language={languages[0]}
                                flag={country.flags.svg}
                              />
                            </Grid>
                          );
                        }
                      })}
                    </Grid>
                  </Stack>
                </TabPanel>
                <TabPanel sx={{ px: 0 }} value="2">
                  <Stack pb={4} gap={3}>
                    <Typography variant="h5">
                      Suggested languages and regions
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid
                        item
                        xs={6}
                        md={3}
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        gap={1.25}
                      >
                        <CounttryLanRegion
                          currenciesName="Bangladeshi"
                          currencie="BDT"
                          currenciesSymbole="TK"
                          flag="https://t4.ftcdn.net/jpg/01/04/47/13/360_F_104471360_1xohRUSRjfdGxoaRDtLg2z4ztBHkT21K.jpg"
                        />
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        md={3}
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        gap={1.25}
                      >
                        <CounttryLanRegion
                          currenciesName="Unaited Kingdom"
                          currencie="Dolar"
                          currenciesSymbole="$"
                          flag="https://cdn.britannica.com/29/22529-004-ED1907BE/Union-Flag-Cross-St-Andrew-of-George.jpg"
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                  <Stack gap={3}>
                    <Typography variant="h5">
                      Choose a language and region
                    </Typography>
                    <Grid container spacing={1}>
                      {countris.map((country: any, index) => {
                        if (country?.currencies) {
                          const currencies: any = Object.values(
                            country?.currencies
                          )[0];
                          var currencie = Object.keys(country?.currencies);

                          return (
                            <Grid
                              item
                              xs={6}
                              md={3}
                              key={index}
                              display="flex"
                              flexDirection="row"
                              alignItems="center"
                              gap={1}
                            >
                              <CounttryLanRegion
                                indexCoun={index}
                                currencie={currencie}
                                currenciesName={currencies.name}
                                flag={country.flags.svg}
                                currenciesSymbole={currencies.symbol}
                              />
                            </Grid>
                          );
                        }
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
