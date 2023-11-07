import { FC } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import {
  Avatar,
  Button,
  Divider,
  Grid,
  Rating,
  Stack,
  Typography,
} from "@mui/material";

import { UserProfileProps } from "./Types";

const UserProfile: FC<UserProfileProps> = () => {
  return (
    <Grid container rowSpacing={4}>
      <Grid item xs={12} gap={11}>
        <Stack alignItems="center" gap={3}>
          <Stack alignItems="center" gap={1}>
            <Avatar
              sx={{ height: 80, width: 80 }}
              src="https://scontent.fdac151-1.fna.fbcdn.net/v/t1.6435-9/57183841_350708698896126_7610830156164235264_n.jpg?stp=c0.83.500.500a_dst-jpg_s851x315&_nc_cat=103&ccb=1-7&_nc_sid=c21ed2&_nc_eui2=AeFaElRGqUVej9W3pHRzUJYzekZmaJR7xdZ6RmZolHvF1s_RFSaCIhmJ_z_gS4uUbj4a_8ibG42oZlFVJ_U8AMvQ&_nc_ohc=0syEpE5SNx0AX9PoTQp&_nc_ht=scontent.fdac151-1.fna&oh=00_AfDtqza5S0hu-bERP7JZgHE38_hoTQVmmvTq7qJ_gepnpg&oe=657190FC"
              alt="JL"
            />
            <Stack alignItems="center" gap={0.5}>
              <Typography variant="h4">Ramita MR</Typography>
              <Typography color="text.secondary">Superhost</Typography>
            </Stack>
          </Stack>
          <Stack
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack alignItems="center">
              <Typography variant="subtitle1">12</Typography>
              <Typography color="text.secondary">Reviews</Typography>
            </Stack>
            <Stack alignItems="center">
              <Typography variant="subtitle1">11</Typography>
              <Typography color="text.secondary">Months hosting</Typography>
            </Stack>
            <Stack alignItems="center">
              <Stack flexDirection="row" gap={0.5}>
                <Rating max={1} defaultValue={1} />
                <Typography variant="subtitle1">4.9</Typography>
              </Stack>
              <Typography color="text.secondary">Rating</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={12} display="flex" justifyContent="center">
        <Button startIcon={<ChatIcon />} variant="outlined">
          chat
        </Button>
      </Grid>
      <Grid
        item
        xs={12}
        display="flex"
        alignItems="flex-start"
        gap={4}
        flexDirection="column"
      >
        <Stack gap={2} width="100%">
          <Typography variant="h5">About</Typography>
          <Divider></Divider>
        </Stack>
        <Stack gap={2} alignItems="flex-start">
          <Typography color="text,secondary">
            Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse
            quam nihil molestiae
          </Typography>
          <Typography color="text,secondary">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          </Typography>
          <Typography color="text,secondary">
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id es Quis autem vel eum iure
            reprehenderit
          </Typography>
          <Typography color="text,secondary">
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
          </Typography>
          <Typography color="text,secondary">
            Ut enim ad minima veniam, quis nostrum exercitationem ullam{" "}
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default UserProfile;