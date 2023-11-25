import { FC } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Stack, IconButton, Typography, Box, Chip } from "@mui/material";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import { MoreVert, OpenInNew } from "@mui/icons-material";

import { OrderDetailsProps } from "./Types";

const OrderDetails: FC<OrderDetailsProps> = ({ orderDetailsData }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ borderBottom: "none" }}>
              Order
            </TableCell>
            <TableCell align="left" sx={{ borderBottom: "none" }}>
              PRODUCT
            </TableCell>
            <TableCell align="left" sx={{ borderBottom: "none" }}>
              SXU
            </TableCell>
            <TableCell align="left" sx={{ borderBottom: "none" }}>
              CATEGORY
            </TableCell>
            <TableCell align="left" sx={{ borderBottom: "none" }}>
              PAYMENT
            </TableCell>
            <TableCell align="left" sx={{ borderBottom: "none" }}>
              ORDER STATUS
            </TableCell>
            <TableCell align="left" sx={{ borderBottom: "none" }}>
              ACTIONS
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderDetailsData.map((data) => {
            const {
              id,
              orderNo,
              product,
              sxu,
              category,
              payment,
              orderStatus,
            } = data;
            return (
              <TableRow key={id}>
                <TableCell
                  sx={{
                    display: "flex",
                    borderBottom: "none",
                  }}
                  align="left"
                >
                  {orderNo}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ maxWidth: 164, borderBottom: "none" }}
                >
                  <Stack flexDirection="row" alignItems="self-start" gap={1}>
                    <IconButton sx={{ p: 0 }}>
                      <InsertPhotoIcon />
                    </IconButton>
                    <Typography variant="body2">{product}</Typography>
                  </Stack>
                </TableCell>
                <TableCell sx={{ borderBottom: "none" }} align="left">
                  {sxu}
                </TableCell>
                <TableCell sx={{ borderBottom: "none" }} align="left">
                  <Stack flexDirection="row" alignItems="self-start" gap={1}>
                    <IconButton sx={{ p: 0 }}>
                      <SmartphoneIcon />
                    </IconButton>
                    <Typography variant="body2">{category}</Typography>
                  </Stack>
                </TableCell>
                <TableCell sx={{ borderBottom: "none" }} align="left">
                  <Box>
                    <Typography variant="h6">
                      {"$"}
                      {payment}
                    </Typography>
                    <Typography variant="body2">Full Paid</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottom: "none" }} align="left">
                  <Chip
                    size="small"
                    label={orderStatus}
                    color={orderStatus === "Complete" ? "primary" : "warning"}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: "none" }} align="left">
                  <Stack flexDirection="row">
                    <IconButton>
                      <OpenInNew />
                    </IconButton>
                    <IconButton>
                      <MoreVert />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderDetails;
