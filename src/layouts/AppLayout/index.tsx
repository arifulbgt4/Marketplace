import { FC } from "react";
import { getServerSession } from "next-auth";
import { Grid, Container } from "@mui/material";

import { authOptions } from "src/lib/auth";
import Header from "src/widgets/Header";
import Footer from "src/widgets/Footer";

import { AppLayoutProps } from "./Types";

const HEADER_HEIGHT = 64;

const AppLayout: FC<AppLayoutProps> = async ({ children }) => {
  const session = await getServerSession(authOptions);
  return (
    <>
      <Container>
        <Grid container>
          <Grid item xs={12} height={HEADER_HEIGHT}>
            <Header user={session?.user} />
          </Grid>
          <Grid item xs={12} pb={15}>
            {children}
          </Grid>
        </Grid>
      </Container>
      <Grid container>
        <Grid item xs={12}>
          <Footer />
        </Grid>
      </Grid>
    </>
  );
};

export default AppLayout;
