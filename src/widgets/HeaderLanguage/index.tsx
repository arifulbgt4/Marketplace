"use client";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { FC, useState, useCallback, useMemo } from "react";
import {
  Grid,
  Stack,
  Typography,
  IconButton,
  Box,
  Modal,
  Container,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TranslateIcon from "@mui/icons-material/Translate";

import { languages as languagesData } from "src/global/staticData";
import { LanguageOptions } from "src/global/types";
import Language from "src/components/Language";

import { HeaderLanguageProps } from "./Types";

const HeaderLanguage: FC<HeaderLanguageProps> = () => {
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
  }, [locale]);

  //---------------------------------------------------//
  // Controling Language and Currency modal open/close //
  //---------------------------------------------------//
  const handleOpenLangModal = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);
  // replace language on modale close
  const handleCloseLangModal = useCallback(() => {
    setOpen((prev) => !prev);
    if (language.key && language.key !== locale) {
      const pathWithoutLocale =
        pathName.replace(/^\/(en|af|am|ar|hy|as|az|bn)(?=\/|$)/, "") || "/";
      router.replace(`/${language.key}${pathWithoutLocale}`);
    }
  }, [language.key, locale, pathName, router]);

  return (
    <Box mr={{ md: 2 }}>
      <Stack
        onClick={handleOpenLangModal}
        flexDirection="row"
        gap={1}
        justifyContent="center"
        alignItems="center"
        px={{ xs: 0, md: 2 }}
        py={{ xs: 0, md: 1 }}
        borderRadius={40}
        sx={(theme) => ({
          color: "text.primary",
          cursor: "pointer",
          "&:hover": {
            bgcolor: { md: "action.hover" },
          },
        })}
      >
        <TranslateIcon fontSize="small" />
        <Typography variant="h6" textTransform="uppercase">
          {language?.key || defaultLang?.key}
        </Typography>
      </Stack>
      <Modal open={open} onClose={handleCloseLangModal}>
        <Stack justifyContent="center" alignItems="center">
          <Container
            maxWidth="md"
            sx={{
              bgcolor: "background.paper",
              pt: 2,
              top: { md: "50%" },
              left: { md: "50%" },
              transform: { md: "translate(-50%, -50%)" },
              bottom: { xs: 48, md: 0 },
              position: "absolute",
              height: { md: 580, xs: "calc(100vh - 180px - 48px)" },
              borderRadius: { xs: 6, md: 2.5 },
              borderBottomLeftRadius: { xs: 0, md: 10 },
              borderBottomRightRadius: { xs: 0, md: 10 },
              boxShadow: { xs: 15, md: 5 },
            }}
          >
            <Box position="relative">
              <IconButton
                onClick={handleCloseLangModal}
                sx={(theme) => ({
                  position: "absolute",
                  zIndex: 1,
                  right: { xs: -5, md: -5 },
                  top: { xs: -55, md: 0 },
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
              p={{ xs: 1, md: 2 }}
            >
              <Stack gap={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h5">Selected language</Typography>
                  </Grid>
                  <Grid item container spacing={2} pb={2}>
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
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h5">Choose a language</Typography>
                  </Grid>
                  <Grid item container spacing={1}>
                    {languagesData?.map((lang: LanguageOptions) => (
                      <Grid
                        item
                        xs={6}
                        md={3}
                        key={lang.key}
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
                            (language?.key || defaultLang?.key) === lang.key,
                          )}
                          onClick={() => setLanguage(lang)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Stack>
            </Box>
          </Container>
        </Stack>
      </Modal>
    </Box>
  );
};

export default HeaderLanguage;
