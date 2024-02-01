"use client";
import { FC, Suspense } from "react";
import {
  Typography,
  Box,
  Stack,
  Container,
  Card,
  CardContent,
} from "@mui/material";

import SearchFilterForm from "src/forms/SearchFilterForm";

import { SearchBannerProps } from "./Types";

const SearchBanner: FC<SearchBannerProps> = () => {
  return (
    <Stack
      component="div"
      sx={(theme) => ({
        minHeight: "100vh",
        // backgroundImage: `url(${BANNER_BG})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        position: "relative",
        background: theme.palette.background.paper,
        mt: -8,
      })}
      gap={3}
      direction="column"
      justifyContent={{ xs: "flex-end", md: "center" }}
    >
      <Box textAlign="center">
        <Typography variant="h1">Find Home Together</Typography>
      </Box>
      <Stack>
        <Typography
          variant="h3"
          pb={8}
          sx={{ opacity: 0.8 }}
          textAlign="center"
        >
          25,000 rooms amd houses available now on Dream House
        </Typography>
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 999 }}>
          <Suspense>
            <SearchFilterForm />
          </Suspense>
          <Stack flexDirection="row" justifyContent="center" mt={15}>
            <Card>
              <CardContent>
                <Typography>Large flat</Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography>Large flat</Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography>Large flat</Typography>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Stack>

      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          right: 0,
          overflow: "hidden",
        }}
      >
        <Box
          sx={(theme) => ({
            borderWidth: 3,
            borderStyle: "dotted",
            borderColor: theme.palette.primary.dark,
            position: "absolute",
            top: "25%",
            bottom: "-100%",
            left: "2%",
            right: "2%",
            borderRadius: "100%",
            opacity: 0.2,
            zIndex: 9,
          })}
        >
          <Box
            sx={(theme) => ({
              borderWidth: 3,
              borderStyle: "dotted",
              borderColor: theme.palette.primary.main,
              position: "absolute",
              top: "6%",
              bottom: 0,
              left: "8%",
              right: "8%",
              borderRadius: "100%",
            })}
          >
            <Box
              sx={(theme) => ({
                borderWidth: 3,
                borderStyle: "dotted",
                borderColor: theme.palette.primary.light,
                position: "absolute",
                top: "8%",
                bottom: 0,
                left: "10%",
                right: "10%",
                borderRadius: "100%",
              })}
            >
              <Box
                sx={(theme) => ({
                  borderWidth: 3,
                  borderStyle: "dotted",
                  borderColor: theme.palette.primary.light,
                  position: "absolute",
                  top: "7%",
                  bottom: 0,
                  left: "12%",
                  right: "12%",
                  borderRadius: "100%",
                })}
              >
                <Box
                  sx={(theme) => ({
                    borderWidth: 3,
                    borderStyle: "dotted",
                    borderColor: theme.palette.primary.light,
                    position: "absolute",
                    top: "10%",
                    bottom: 0,
                    left: "14%",
                    right: "14%",
                    borderRadius: "100%",
                  })}
                ></Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          position: "absolute",
          left: 0,
          right: 0,
          bottom: -200,
          height: 400,
          // background: "#fff",
          zIndex: 9,
          backgroundImage: `linear-gradient(to top, transparent 0%, ${theme.palette.background.default} 50%, transparent 100%);`,
        })}
      ></Box>
    </Stack>
  );
};

export default SearchBanner;
