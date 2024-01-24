"use client";
import { FC, useState } from "react";
import {
  Grid,
  Stack,
  Typography,
  CardMedia,
  IconButton,
  Box,
  Modal,
  Container,
  List,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CloseIcon from "@mui/icons-material/Close";

import { HeaderLanguageProps } from "./Types";
import CounttryLanRegion from "src/components/CountryLanRegion";

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

  // fetch("https://restcountries.com/v3.1/all")
  //   .then((res) => {
  //     return res.json();
  //   })
  //   .then((data) => {
  //     setCountris(data);
  //   });

  return (
    <Box mr={{ md: 2 }}>
      <IconButton sx={{ p: 0 }} onClick={handleOpenLangModal}>
        <LanguageIcon fontSize="small" />
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
              <Box
                sx={{
                  height: "fit-content",
                  position: "sticky",
                  top: 0,
                  bgcolor: "background.paper",
                  pt: 5,
                }}
              >
                <Box position="relative">
                  <IconButton
                    onClick={handleCloseLangModal}
                    sx={{
                      position: "absolute",
                      right: -15,
                      top: -15,
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
