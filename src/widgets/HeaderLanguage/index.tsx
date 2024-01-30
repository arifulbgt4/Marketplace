"use client";
import { FC, useEffect, useState } from "react";
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

import { HeaderLanguageProps } from "./Types";
import CounttryLanRegion from "src/components/CountryLanRegion";

const HeaderLanguage: FC<HeaderLanguageProps> = () => {
  const [value, setValue] = useState("1");
  const [open, setOpen] = useState(false);
  const [countris, setCountris] = useState([]);
  const [region, setRegion] = useState({
    cca2: "BD",
    languages: { ben: "Bengali" },
    flag: "🇧🇩",
    name: { common: "Bangladesh" },
    currencies: { BDT: { name: "Bangladeshi taka", symbol: "৳" } },
  });

  const [currency, setCurrency] = useState({
    cca2: "BD",
    languages: { ben: "Bengali" },
    flag: "🇧🇩",
    name: { common: "Bangladesh" },
    currencies: { BDT: { name: "Bangladeshi taka", symbol: "৳" } },
  });
  console.log("region", region);

  const handleOpenLangModal = () => {
    setOpen((prev) => !prev);
  };
  const handleCloseLangModal = () => {
    setOpen((prev) => !prev);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const getRegions = async () => {
    const res = await fetch("https://restcountries.com/v3.1/all", {
      method: "GET",
    });
    const data = await res.json();
    setCountris(data);
    return data;
  };

  useEffect(() => {
    getRegions();
  }, []);

  return (
    <Box mr={{ md: 2 }}>
      <Stack
        onClick={handleOpenLangModal}
        flexDirection="row"
        gap={1}
        justifyContent="center"
        alignItems="center"
        px={2}
        py={1}
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
        <Avatar
          variant="square"
          sx={{
            height: 30,
            width: 30,
            marginBottom: "-3px",
            fontSize: 30,
            background: "transparent",
          }}
        >
          {region.flag}
        </Avatar>
        <Typography variant="h6">
          {Object.keys(region?.languages)[0]}
        </Typography>
      </Stack>
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
                      Selected languages and regions
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
                          name={region?.name?.common}
                          flag={region.flag}
                          language={
                            (region?.languages &&
                              (Object?.values(
                                region?.languages
                              )[1] as string)) ||
                            (Object?.values(region?.languages)[0] as string)
                          }
                          isActive
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                  <Stack gap={3}>
                    <Typography variant="h5">
                      Choose a language and region
                    </Typography>
                    <Grid container spacing={1}>
                      {countris.map((country: any, index) => (
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
                            name={country?.name.common}
                            language={
                              country?.languages &&
                              ((Object?.values(
                                country?.languages
                              )[1] as string) ||
                                (Object?.values(
                                  country?.languages
                                )[0] as string))
                            }
                            flag={country.flag}
                            isActive={Boolean(region.cca2 === country.cca2)}
                            onClick={() => setRegion(country)}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Stack>
                </TabPanel>
                <TabPanel sx={{ px: 0 }} value="2">
                  <Stack pb={4} gap={3}>
                    <Typography variant="h5">Selected Currency</Typography>
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
                          currencie={
                            Object.values(currency?.currencies)[0]?.name
                          }
                          currenciesName={`${
                            Object.keys(currency?.currencies)[0]
                          }
                                 - ${
                                   Object.values(currency?.currencies)[0].symbol
                                 }`}
                          flag={currency?.flag}
                          currenciesSymbole={
                            Object.values(currency?.currencies)[0].symbol
                          }
                          isActive
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
                          );
                          console.log("currencies", currencies[0]);

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
                                currencie={currencies[0]?.name}
                                currenciesName={`${
                                  Object.keys(country?.currencies)[0]
                                } - ${currencies[0].symbol}`}
                                flag={country?.flag}
                                currenciesSymbole={currencies[0].symbol}
                                isActive={Boolean(
                                  currency?.cca2 === country?.cca2
                                )}
                                onClick={() => setCurrency(country)}
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
