import {
  Avatar,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { redirect } from "next/navigation";
import { getAuthSession } from "src/lib/authz";
import { userService } from "src/lib/services/user";

export default async function Account() {
  const session = await getAuthSession();
  if (!session) redirect("/signin");
  const profile = await userService.getProfile(session.userId);

  return (
    <Card>
      <CardContent>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Avatar
            src={profile.image ?? undefined}
            alt={profile.name}
            sx={{ width: 96, height: 96 }}
          />
          <Stack spacing={1}>
            <Typography variant="h4">{profile.name}</Typography>
            <Typography color="text.secondary">{profile.email}</Typography>
            {profile.phone && <Typography>{profile.phone}</Typography>}
            <Stack direction="row" spacing={1}>
              <Chip label={profile.role} size="small" />
              <Chip
                label={profile.status}
                size="small"
                color={profile.status === "active" ? "success" : "warning"}
              />
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
