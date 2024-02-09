"use client";
import { FC, Suspense, useState } from "react";
import {
  AppBar,
  Container,
  Toolbar,
  Box,
  IconButton,
  Hidden,
  Stack,
  Modal,
  Typography,
  Paper,
} from "@mui/material";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";

import Logo from "src/components/Logo";
import SearchFilterForm from "src/forms/SearchFilterForm";
import HeaderLanguage from "../HeaderLanguage";
import UserAvatar from "../UserAvatar";
import UserLogIn from "../UserLogIn";

import { HeaderProps } from "./Types";

const Header: FC<HeaderProps> = ({ user }) => {
  const [openModal, setOpenModal] = useState(false);
  // const { sticky, stickyRef } = useSticky(10);

  return (
    <AppBar position="fixed" color="inherit" elevation={0}>
      <Container>
        <Toolbar
          disableGutters
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Logo />
          <Hidden mdUp>
            <IconButton
              type="submit"
              size="small"
              onClick={() => {
                setOpenModal(true);
              }}
            >
              <SearchSharpIcon
                sx={(theme) => ({
                  height: 24,
                  width: 24,
                })}
              />
            </IconButton>
            <Modal
              open={openModal}
              onClose={() => {
                setOpenModal(false);
              }}
              slotProps={{
                backdrop: {
                  sx: (theme) => ({
                    background: "transparent",
                    top: 48,
                    backdropFilter: "blur(2px)",
                  }),
                },
              }}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              sx={{ bgcolor: "transparent", top: 48 }}
            >
              <Stack
                component={Paper}
                elevation={4}
                gap={1}
                px={2.8}
                pt={2}
                pb={3.5}
                position="relative"
                sx={{
                  borderBottomRightRadius: 18,
                  borderBottomLeftRadius: 18,
                }}
              >
                <Typography variant="h5">Where to ?</Typography>
                <Suspense>
                  <SearchFilterForm
                    size="small"
                    onClose={() => {
                      setOpenModal(false);
                    }}
                  />
                </Suspense>
              </Stack>
            </Modal>
          </Hidden>
          <Hidden mdDown>
            <Stack direction="row" justifyContent="end" alignItems="center">
              <HeaderLanguage />
              <Box>
                {!user ? (
                  <UserLogIn />
                ) : (
                  <UserAvatar userimg="https://scontent.fdac151-1.fna.fbcdn.net/v/t39.30808-6/323216917_849017493050726_3721557920749209294_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=9c7eae&_nc_eui2=AeEg_ZuDfeIZyNvIkur8oJxa-R-XXFY9otj5H5dcVj2i2F-q_E15Th8XGkIuYHY_M647hRz0lqxtUUKOg1e94LNt&_nc_ohc=OoSWGP2Y1ygAX8hVnd1&_nc_oc=AQlIAUbde8IqW0VqAaxTOniMl8EU7gHqNmqkQzHijCo2LV4S1Eysa24NGvIc_FK6cts&_nc_ht=scontent.fdac151-1.fna&oh=00_AfC0BwrjeDMqwVEKnZDA3XcHxZtV1rZ2M9CQIsashvMC9w&oe=65CBE083" />
                )}
              </Box>
            </Stack>
          </Hidden>
        </Toolbar>
        <Hidden mdUp>
          <Toolbar
            sx={(theme) => ({
              position: "fixed",
              boxShadow: 10,
              bottom: 0,
              left: 0,
              right: 0,
              background: theme.palette.background.paper,
            })}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flex={1}
            >
              <HeaderLanguage />
              <Box>
                {!user ? (
                  <UserLogIn />
                ) : (
                  <UserAvatar userimg="https://scontent.fdac151-1.fna.fbcdn.net/v/t39.30808-6/323216917_849017493050726_3721557920749209294_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=9c7eae&_nc_eui2=AeEg_ZuDfeIZyNvIkur8oJxa-R-XXFY9otj5H5dcVj2i2F-q_E15Th8XGkIuYHY_M647hRz0lqxtUUKOg1e94LNt&_nc_ohc=OoSWGP2Y1ygAX8hVnd1&_nc_oc=AQlIAUbde8IqW0VqAaxTOniMl8EU7gHqNmqkQzHijCo2LV4S1Eysa24NGvIc_FK6cts&_nc_ht=scontent.fdac151-1.fna&oh=00_AfC0BwrjeDMqwVEKnZDA3XcHxZtV1rZ2M9CQIsashvMC9w&oe=65CBE083" />
                )}
              </Box>
            </Stack>
          </Toolbar>
        </Hidden>
      </Container>
    </AppBar>
  );
};
export default Header;
