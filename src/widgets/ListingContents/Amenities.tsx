import { FC } from "react";
import { Stack, SvgIcon, Typography } from "@mui/material";

import { AmenitiesProps } from "./Types";

const Amenities: FC<AmenitiesProps> = ({ label, value, data }) => {
  return (
    <Stack
      border={1}
      sx={(theme) => ({
        borderColor: theme.palette.divider,
      })}
      flexDirection="row"
      // justifyContent="center"
      alignItems="center"
      borderRadius={1}
      p={2}
      gap={2}
    >
      {data?.icon && (
        <SvgIcon fontSize="large" component={data?.icon} inheritViewBox />
      )}
      <Typography variant="subtitle1">{label}</Typography>
    </Stack>
  );
};

export default Amenities;
