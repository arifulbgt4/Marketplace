import { FC } from "react";
import {
  IconButton,
  Paper,
  Stack,
  Typography,
  Box,
  Divider,
  Button,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PolylineRoundedIcon from "@mui/icons-material/PolylineRounded";

import { ListingBookingProps } from "./Types";

const ListingBooking: FC<ListingBookingProps> = () => {
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
        <Box display="flex" p={1} gap={1} borderRadius={4}>
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
        <Box display="flex" flexDirection="row">
          <Box p={1} display="flex">
            <IconButton disabled>
              <PolylineRoundedIcon sx={{ height: 15, width: 15 }} />
            </IconButton>
            <Button size="small" disabled>
              Apartment
            </Button>
          </Box>

          <Box p={1} display="flex">
            <IconButton disabled>
              <PolylineRoundedIcon sx={{ height: 15, width: 15 }} />
            </IconButton>
            <Button size="small" disabled>
              2 days ago
            </Button>
          </Box>
          <Box p={1} display="flex">
            <IconButton disabled>
              <PolylineRoundedIcon sx={{ height: 15, width: 15 }} />
            </IconButton>
            <Button size="small" disabled>
              (916) 426-8067
            </Button>
          </Box>
        </Box>
        <Box p={1} gap={1} display="flex">
          <Button variant="contained">Book now</Button>
          <Button variant="outlined">Bookmark</Button>
          <Button variant="outlined">Massage</Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default ListingBooking;
