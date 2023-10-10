import { FC } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "src/lib/auth";
import { Grid } from "@mui/material";

import { AppLayoutProps } from "./Types";
import Header from "src/widgets/Header";
import Footer from "src/widgets/Footer";

const AppLayout: FC<AppLayoutProps> = async ({ children }) => {
  const session = await getServerSession(authOptions);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Header user={session?.user} />
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
