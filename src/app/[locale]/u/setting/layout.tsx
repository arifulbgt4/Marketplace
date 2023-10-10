import { Box, Container, Grid } from "@mui/material";

import SettingNavigation from "src/widgets/SettingNavigation";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box>
      <Container>
        <Grid container py={5} spacing={10}>
          <Grid item xs={8}>
            {children}
          </Grid>
          <Grid item xs={4}>
            <SettingNavigation />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
