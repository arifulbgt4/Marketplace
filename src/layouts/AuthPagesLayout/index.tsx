"use client";
import { FC } from "react";
import { usePathname } from "next/navigation";
import { Grid, Container, Stack, Typography, Link } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import routes from "src/global/routes";

import { AuthPagesLayoutOptions } from "./Types";

const AuthPagesLayout: FC<AuthPagesLayoutOptions> = ({ children }) => {
  const pathname = usePathname();
  return (
    <Grid container>
      <Grid item xs={12}>
        <Container>
          <Stack pt={10} gap={10}>
            <Typography variant="h3">Create an account</Typography>
            <Tabs value={pathname}>
              <Tab
                label="SIGN IN"
                value={routes.signin}
                component={Link}
                href={routes.signin}
              />
              <Tab
                component={Link}
                label="CREATE ACCOUNT"
                value={routes.signup}
                href={routes.signup}
              />
            </Tabs>
          </Stack>
        </Container>
      </Grid>
      <Grid item xs={12}>
        {children}
      </Grid>
    </Grid>
  );
};

export default AuthPagesLayout;
