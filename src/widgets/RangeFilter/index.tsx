import { FC } from "react";
import { Box, Typography } from "@mui/material";

import { Slider } from "src/components/Input";

import { SliderFilterProps } from "./Types";

const RangeFilter: FC<SliderFilterProps> = ({ title, ...rest }) => {
  return (
    <Box pt={2}>
      <Typography variant="h5" pb={1}>
        {title}
      </Typography>
      <Slider name="priceRange" valueLabelDisplay="auto" {...rest} />
    </Box>
  );
};

export default RangeFilter;
