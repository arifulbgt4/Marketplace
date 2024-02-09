import { FC } from "react";
import { Box, Link, SvgIcon, Typography } from "@mui/material";

import { CategoryButtonProps } from "./Types";

const CategoryButton: FC<CategoryButtonProps> = ({ href, text, svg }) => {
  return (
    <Box
      sx={{
        borderRadius: 2,
        ":hover": {
          "& svg": {
            transform: `scale(1.8)`,
          },
        },
      }}
      px={2}
      py={1}
      display="flex"
      flexDirection="column"
      component={Link}
      href={href}
      justifyContent="center"
      alignItems="center"
    >
      <SvgIcon
        fontSize="large"
        sx={{
          filter: `drop-shadow(2px 3px 0.9px rgb(0 0 0 / 0.5))`,
          transition: "transform 0.3s ease-in-out",
          transform: `scale(1.6)`,
          mb: 2.25,
          willChange: "transform",
        }}
      >
        {svg}
      </SvgIcon>
      <Typography
        variant="button"
        color="text.primary"
        textTransform="capitalize"
      >
        {text}
      </Typography>
    </Box>
  );
};

export default CategoryButton;
