"use client";
import { FC } from "react";
import { usePathname } from "next/navigation";
import {
  Paper,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Link,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import PeopleIcon from "@mui/icons-material/People";

import routes from "src/global/routes";

import { SettingNavigationProps } from "./Types";

const SettingNavigation: FC<SettingNavigationProps> = () => {
  const pathname = usePathname();
  return (
    <MenuList>
      <MenuItem
        component={Link}
        href={routes.userSetting}
        selected={routes.userSetting === pathname}
      >
        <ListItemIcon>
          <AccountCircleIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Personal Information</ListItemText>
      </MenuItem>
      <MenuItem
        component={Link}
        href={routes.userSecuritySetting}
        selected={routes.userSecuritySetting === pathname}
      >
        <ListItemIcon>
          <LockIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Change Your Password</ListItemText>
      </MenuItem>
      <MenuItem
        component={Link}
        href={routes.userMediaSetting}
        selected={routes.userMediaSetting === pathname}
      >
        <ListItemIcon>
          <InsertPhotoOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Avatar & Home page Image</ListItemText>
      </MenuItem>
      <MenuItem
        component={Link}
        href={routes.userSocialSetting}
        selected={routes.userSocialSetting === pathname}
      >
        <ListItemIcon>
          <PeopleIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Social Links</ListItemText>
      </MenuItem>
    </MenuList>
  );
};

export default SettingNavigation;
