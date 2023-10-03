"use client";
import { FC, useState } from "react";
import { Grid, Typography } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { AuthPagesLayoutOptions } from "./Types";

const AuthPagesLayout: FC<AuthPagesLayoutOptions> = ({ children }) => {
  const [value, setValue] = useState("one");
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography>Create an account</Typography>
        <Tabs
          onChange={(a, b) => {
            setValue(b);
          }}
          value={value}
        >
          <Tab label="CREATE ACCOUNT" value="one" />
          <Tab label="SIGN IN" value="two" />
        </Tabs>
      </Grid>
      <Grid item xs={12}>
        {children}
      </Grid>
    </Grid>
  );
};

export default AuthPagesLayout;
