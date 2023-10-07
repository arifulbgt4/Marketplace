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
        <Box p={2}>
          <Typography variant="h5">Property details</Typography>
        </Box>
        <Divider />
      </Stack>
    </Paper>
  );
};

export default ListingBooking;
