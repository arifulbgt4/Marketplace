import * as React from "react";
import { Avatar, AvatarProps, Badge } from "@mui/material";

type AvatarWithStatusProps = AvatarProps & {
  online?: boolean;
};

export default function AvatarWithStatus(props: AvatarWithStatusProps) {
  const { online = false, ...other } = props;
  return (
    <Badge
      variant={online ? "dot" : "standard"}
      color={online ? "success" : "primary"}
    >
      <Avatar {...other} />
    </Badge>
  );
}
