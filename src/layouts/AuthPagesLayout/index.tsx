"use client";
import { FC, useState } from "react";
import { Grid, Container, Stack, Typography, Tabs, Tab } from "@mui/material";

import { AuthPagesLayoutOptions } from "./Types";

const AuthPagesLayout: FC<AuthPagesLayoutOptions> = ({ children }) => {
  const [value, setValue] = useState("one");
  return (
    <Grid container>
      <Grid item xs={12}>
        <Container>
          <Stack pt={10} gap={10}>
            <Typography variant="h3">Create an account</Typography>
            <Tabs
              onChange={(a, b) => {
                setValue(b);
              }}
              value={value}
            >
              <Tab label="CREATE ACCOUNT" value="one" />
              <Tab label="SIGN IN" value="two" />
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
