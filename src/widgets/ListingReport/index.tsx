"use client";
import { FC, useState } from "react";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box, Button, Modal, Paper, Stack, Typography } from "@mui/material";

import { ListingReportProps } from "./Types";
import ReportForm from "src/forms/ReportForm";

const ListingReport: FC<ListingReportProps> = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Stack justifyContent="center" alignItems="center">
      <Box>
        <Button
          disableRipple
          sx={(theme) => ({
            ":hover": {
              bgcolor: "transparent",
              color: theme.palette.primary.main,
            },
          })}
          onClick={handleOpen}
          color="inherit"
          startIcon={<WarningAmberIcon />}
        >
          Report this listing
        </Button>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Paper
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            p: 4,
          }}
        >
          <ReportForm handleClose={handleClose} />
        </Paper>
      </Modal>
    </Stack>
  );
};

export default ListingReport;
