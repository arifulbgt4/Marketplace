import { FC, useState } from "react";
import Slider from "@mui/material/Slider";
import { Box, Typography } from "@mui/material";

import { SliderFilterProps } from "./Types";

const SliderFilter: FC<SliderFilterProps> = () => {
  function valuetext(value: number) {
    return `${value}$`;
  }

  const [value, setValue] = useState<number[]>([20, 37]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };
  return (
    <Box pt={2}>
      <Typography variant="h5" pb={1}>
        Price
      </Typography>
      <Slider
        getAriaLabel={() => "Price range"}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
      />
    </Box>
  );
};

export default SliderFilter;
