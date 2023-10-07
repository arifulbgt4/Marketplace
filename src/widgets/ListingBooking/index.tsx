import { FC } from "react";
import {
  IconButton,
  Paper,
  Stack,
  Typography,
  Box,
  Divider,
  Button,
  ButtonBase,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PolylineRoundedIcon from "@mui/icons-material/PolylineRounded";

import { ListingDetailsSidebarProps } from "./Types";

const ListingBooking: FC<ListingDetailsSidebarProps> = () => {
  return (
    <Paper>
      <Stack flex={1}>
        <Stack flexDirection="row" p={2} justifyContent="space-between">
          <Box>
            <Typography variant="h5">$500/mo</Typography>
            <Typography variant="body2" color="text.secondary">
              6240 Gold Dust Dr, Sacramento, CA 95842
            </Typography>
          </Box>
          <IconButton>
            <ShoppingCartIcon sx={{ height: 38, width: 38 }} />
          </IconButton>
        </Stack>
        <Divider />

        <Box p={2}>
          <Typography variant="h5">Property details</Typography>
        </Box>
        <Divider />
        <Box p={1} gap={1}>
          <Button size="large" disabled>
            2 bed
          </Button>
          <Button size="large" disabled>
            2 batch
          </Button>
          <Button size="large" disabled>
            832 soft
          </Button>
        </Box>
        <Box p={1} gap={1}>
          <ButtonBase>
            <PolylineRoundedIcon />
            <Button>Apartment</Button>
          </ButtonBase>
          <ButtonBase>
            <PolylineRoundedIcon />
            <Button>2 days ago</Button>
          </ButtonBase>
          <ButtonBase>
            <PolylineRoundedIcon />
            <Button>(916) 426-8067</Button>
          </ButtonBase>
        </Box>
      </Stack>
    </Paper>
  );
};

export default ListingBooking;
