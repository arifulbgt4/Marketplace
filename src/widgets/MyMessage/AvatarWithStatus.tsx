import * as React from "react";
import Badge from "@mui/material/Badge";
import Avatar, { AvatarProps } from "@mui/material/Avatar";

type AvatarWithStatusProps = AvatarProps & {
  online?: boolean;
};

export default function AvatarWithStatus(props: AvatarWithStatusProps) {
  const { online = false, ...other } = props;
  return (
    <div>
      <Badge
        variant={online ? "dot" : "standard"}
        color={online ? "success" : "primary"}
      >
        <Avatar {...other} />
      </Badge>
    </div>
  );
}
