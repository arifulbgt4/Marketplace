import { FC } from "react";
import { Grid } from "@mui/material";

import { AppLayoutProps } from "./Types";
import Header from "src/widgets/Header";
import Navigation from "src/widgets/Navigation";
import Footer from "src/widgets/Footer";

const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Header />
      </Grid>
      <Grid item xs={12}>
        {children}
      </Grid>
      <Grid item xs={12}>
        <Footer />
      </Grid>
    </Grid>
  );
};

export default AppLayout;
