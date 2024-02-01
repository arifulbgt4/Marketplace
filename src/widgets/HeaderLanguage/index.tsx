"use client";
import { useLocale } from "next-intl";
import { createLocalizedPathnamesNavigation } from "next-intl/navigation";
import { FC, useState, useCallback, useMemo } from "react";
import {
  Grid,
  Stack,
  Typography,
  IconButton,
  Box,
  Modal,
  Container,
  Tab,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CloseIcon from "@mui/icons-material/Close";
import TranslateIcon from "@mui/icons-material/Translate";

import { languages as languagesData } from "src/global/staticData";
import routes from "src/global/routes";
import { LanguageOptions } from "src/global/types";
import { locales } from "src/global/staticData";
import Language from "src/components/Language";

import { HeaderLanguageProps } from "./Types";

export const { Link, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({
    locales,
    pathnames: {
      "/": "/",
      [routes.about]: {
        en: routes.about,
        af: routes.about,
        am: routes.about,
        ar: routes.about,
        hy: routes.about,
        as: routes.about,
        az: routes.about,
        bn: routes.about,
      },
    },
  });

const HeaderLanguage: FC<HeaderLanguageProps> = () => {
  const [currency, setCurrency] = useState();
  const [value, setValue] = useState("1");
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<LanguageOptions>({
    key: "",
    name: "",
    eng: "",
  });

  const router = useRouter();
  const pathName = usePathname();

  const locale = useLocale();

  const defaultLang = useMemo(() => {
    return languagesData.filter((d) => d.key === locale)[0];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //---------------------------------------------------//
  // Controling Language and Currency modal open/close //
  //---------------------------------------------------//
  const handleOpenLangModal = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);
  // replace language on modale close
  const handleCloseLangModal = useCallback(() => {
    setOpen((prev) => !prev);
    router.replace(pathName, { locale: language.key, scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, pathName]);

  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setValue(newValue);
    },
    []
  );

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
        <TranslateIcon fontSize="small" />
        <Typography variant="h6" textTransform="uppercase">
          {language?.key || defaultLang?.key}
        </Typography>
      </Stack>
      <Modal
        slotProps={{
          backdrop: {
            sx: (theme) => ({
              background: {
                xs: `linear-gradient(to bottom,${theme.palette.action.active} 30% , transparent 70%,  transparent 100%)`,
                md: "transparent",
              },
              bottom: { xs: 48, md: 0 },
              backdropFilter: "blur(2px)",
            }),
          },
        }}
        open={open}
        onClose={handleCloseLangModal}
      >
        <Stack justifyContent="center" alignItems="center">
          <Container
            maxWidth="md"
            sx={{
              bgcolor: "background.paper",
              top: { md: 77 },
              bottom: { xs: 48, md: 0 },
              position: "absolute",
              height: { md: 580, xs: "calc(100vh - 104px - 48px)" },
              borderRadius: { xs: 6, md: 2.5 },
              borderBottomLeftRadius: { xs: 0, md: 10 },
              borderBottomRightRadius: { xs: 0, md: 10 },
              boxShadow: { xs: 0, md: 5 },
            }}
          >
            <Box position="relative">
              <IconButton
                onClick={handleCloseLangModal}
                sx={(theme) => ({
                  position: "absolute",
                  zIndex: 1,
                  right: { xs: -5, md: 0 },
                  top: { xs: -32, md: 25 },
                  bgcolor: "transparent",
                  color: {
                    xs: theme.palette.grey[100],
                    md: theme.palette.text.primary,
                  },
                  p: 0.2,
                })}
                disableRipple
              >
                <CloseIcon />
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
              <TabContext value={value}>
                <Stack>
                  <TabList onChange={handleChange}>
                    <Tab sx={{ pl: 0 }} label="Language and region" value="1" />
                    <Tab label="Currency" value="2" />
                  </TabList>
                </Stack>
                <TabPanel sx={{ px: 0 }} value="1">
                  <Stack pb={4} gap={3}>
                    <Typography variant="h5">Selected languages</Typography>

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
                        <Language
                          name={language?.name || defaultLang?.name}
                          langKey={language?.key || defaultLang?.key}
                          eng={language?.eng || defaultLang?.eng}
                          isActive
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                  <Stack gap={3}>
                    <Typography variant="h5">Choose a language</Typography>
                    <Grid container spacing={1}>
                      {languagesData?.map((lang: LanguageOptions, index) => (
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
                          <Language
                            name={lang.name}
                            langKey={lang.key}
                            eng={lang.eng}
                            isActive={Boolean(
                              (language?.key || defaultLang?.key) === lang.key
                            )}
                            onClick={() => setLanguage(lang)}
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
                        {/* <CounttryLanRegion
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
                        /> */}
                      </Grid>
                    </Grid>
                  </Stack>
                  <Stack gap={3}>
                    <Typography variant="h5">
                      Choose a language and region
                    </Typography>
                    {/* <Grid container spacing={1}>
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
                    </Grid> */}
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
