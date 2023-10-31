import { FC } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "src/lib/auth";
import { Grid } from "@mui/material";

import Header from "src/widgets/Header";
import Footer from "src/widgets/Footer";

import { AppLayoutProps } from "./Types";

const AppLayout: FC<AppLayoutProps> = async ({ children }) => {
  const session = await getServerSession(authOptions);
  return (
    <Grid container>
      <Grid item xs={12} height={56.7}>
        <Header user={session?.user} />
      </Grid>
      <Grid item xs={12} height="calc(100% - 56.7px)">
        {children}
      </Grid>
      <Grid item xs={12}>
        <Footer />
      </Grid>
    </Grid>
  );
};

export default AppLayout;
