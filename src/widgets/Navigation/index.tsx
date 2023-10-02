import { FC } from "react";
import { AppBar } from "@mui/material";

import { NavigationProps } from "./Types";

const Navigation: FC<NavigationProps> = () => {
  return <AppBar position="relative">Navigation</AppBar>;
};

export default Navigation;
