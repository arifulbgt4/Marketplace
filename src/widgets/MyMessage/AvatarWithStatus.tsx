import { Avatar, AvatarProps, Badge, Box } from "@mui/material";

type AvatarWithStatusProps = AvatarProps & {
  online?: boolean;
};

export default function AvatarWithStatus(props: AvatarWithStatusProps) {
  const { online = false, ...other } = props;
  return (
    <Box>
      <Badge
        variant={online ? "dot" : "standard"}
        color={online ? "success" : "primary"}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        invisible={false}
        overlap="circular"
        sx={{
          "& .MuiBadge-badge": {
            boxShadow: `0 0 0 2px #fff`,
            mb: 0.2,
          },
        }}
      >
        <Avatar sx={{ height: 32, width: 32 }} {...other} />
      </Badge>
    </Box>
  );
}
