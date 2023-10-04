import { Grid } from "@mui/material";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Grid container>
      <Grid item xs={8}>
        {children}
      </Grid>
      <Grid item xs={4}>
        secuirityitem
      </Grid>
    </Grid>
  );
}
