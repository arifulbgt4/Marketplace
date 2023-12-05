import { FC } from "react";
import { Grid, Typography, useTheme } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";

import { ParcentProps } from "./Types";

const Parcent: FC<ParcentProps> = ({ value, title }) => {
  const theme = useTheme();
  const StyledText = styled("text")(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: "middle",
    dominantBaseline: "central",
    fontSize: 10,
  }));

  function PieCenterLabel({ children }: { children: React.ReactNode }) {
    const { width, height, left, top } = useDrawingArea();
    return (
      <StyledText x={left + width / 2} y={top + height / 2}>
        {children}
      </StyledText>
    );
  }
  return (
    <Grid container>
      <Grid item xs={10}>
        <Typography variant="subtitle1">{title}</Typography>
      </Grid>
      <Grid item xs={2}>
        <PieChart
          margin={{ right: -8 }}
          series={[
            {
              data: [{ id: 2, value: value }],
              innerRadius: 15,
              outerRadius: 20,
              endAngle: (value * 360) / 100,
            },
          ]}
          colors={[
            value <= 17
              ? theme.palette.error.main
              : value <= 34
              ? theme.palette.warning.main
              : value <= 52
              ? theme.palette.secondary.main
              : value <= 68
              ? theme.palette.info.main
              : value <= 85
              ? theme.palette.primary.main
              : theme.palette.success.main,
          ]}
          height={50}
        >
          <PieCenterLabel>
            {value}
            {"%"}
          </PieCenterLabel>
        </PieChart>
      </Grid>
    </Grid>
  );
};

export default Parcent;
