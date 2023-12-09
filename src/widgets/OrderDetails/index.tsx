import { FC } from "react";
import {
  Stack,
  IconButton,
  Typography,
  Box,
  Avatar,
  Button,
} from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import BlockIcon from "@mui/icons-material/Block";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

import { MoreVert } from "@mui/icons-material";

import { OrderDetailsProps } from "./Types";

function CorrectRenderLink2() {
  return (
    <Stack direction="row">
      <Button size="small">Download</Button>
      <IconButton>
        <MoreVert />
      </IconButton>
    </Stack>
  );
}
const listItems = [
  {
    id: "INV-1234",
    date: "Feb 3, 2023",
    status: "Refunded",
    customer: {
      initial: "O",
      name: "Olivia Ryhe",
      email: "olivia@email.com",
    },
  },
  {
    id: "INV-1233",
    date: "Feb 3, 2023",
    status: "Paid",
    customer: {
      initial: "S",
      name: "Steve Hampton",
      email: "steve.hamp@email.com",
    },
  },
  {
    id: "INV-1232",
    date: "Feb 3, 2023",
    status: "Refunded",
    customer: {
      initial: "C",
      name: "Ciaran Murray",
      email: "ciaran.murray@email.com",
    },
  },
  {
    id: "INV-1231",
    date: "Feb 3, 2023",
    status: "Refunded",
    customer: {
      initial: "M",
      name: "Maria Macdonald",
      email: "maria.mc@email.com",
    },
  },
  {
    id: "INV-1230",
    date: "Feb 3, 2023",
    status: "Cancelled",
    customer: {
      initial: "C",
      name: "Charles Fulton",
      email: "fulton@email.com",
    },
  },
  {
    id: "INV-1229",
    date: "Feb 3, 2023",
    status: "Cancelled",
    customer: {
      initial: "J",
      name: "Jay Hooper",
      email: "hooper@email.com",
    },
  },
  {
    id: "INV-1228",
    date: "Feb 10, 2023",
    status: "Paid",
    customer: {
      initial: "L",
      name: "Lain Crosit",
      email: "crosit@email.com",
    },
  },
  {
    id: "INV-1227",
    date: "Feb 3, 2023",
    status: "Paid",
    customer: {
      initial: "A",
      name: "Adam Smith",
      email: "smith34@email.com",
    },
  },
  {
    id: "INV-1226",
    date: "Feb 18, 2023",
    status: "Refunded",
    customer: {
      initial: "B",
      name: "Benn Yammen",
      email: "yammen@email.com",
    },
  },
  {
    id: "INV-1225",
    date: "jan 3, 2023",
    status: "Paid",
    customer: {
      initial: "C",
      name: "Chette Looper",
      email: "looper@email.com",
    },
  },
  {
    id: "INV-1224",
    date: "Feb 2, 2023",
    status: "Cancelled",
    customer: {
      initial: "D",
      name: "Daniel Vooper",
      email: "Vooper@email.com",
    },
  },
];

const OrderDetails: FC<OrderDetailsProps> = ({ orderDetailsData }) => {
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Invoice",
      width: 150,
      editable: true,
    },
    {
      field: "date",
      headerName: "Date",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      width: 180,
      renderCell: (cellValues) => {
        if (cellValues.value == "Refunded") {
          return (
            <Stack
              bgcolor={(theme) => theme.palette.divider}
              direction="row"
              alignItems="center"
              borderRadius={5}
            >
              <AutorenewIcon fontSize="small" />
              <Typography px={1}>{cellValues.value}</Typography>
            </Stack>
          );
        } else if (cellValues.value == "Paid") {
          return (
            <Stack
              direction="row"
              alignItems="center"
              bgcolor={(theme) => theme.palette.success.dark}
              borderRadius={5}
            >
              <CheckRoundedIcon fontSize="small" />
              <Typography px={1}>{cellValues.value}</Typography>
            </Stack>
          );
        } else
          return (
            <Stack
              bgcolor={(theme) => theme.palette.error.dark}
              direction="row"
              alignItems="center"
              borderRadius={5}
            >
              <Box px={0.5} pt={0.5}>
                <BlockIcon fontSize="small" />
              </Box>
              <Typography px={1}>{cellValues.value}</Typography>
            </Stack>
          );
      },
    },

    {
      field: "customer",
      headerName: "Customer",
      width: 300,
      renderCell: (cellValues) => {
        return (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            py={2}
          >
            <Avatar>{cellValues.value.initial}</Avatar>
            <Box px={2}>
              <Typography>{cellValues.value.name}</Typography>
              <Typography>{cellValues.value.email}</Typography>
            </Box>
          </Stack>
        );
      },
    },

    {
      field: "actions",
      headerName: "ACTIONS",
      renderCell: CorrectRenderLink2,

      width: 130,
    },
  ];

  return (
    <DataGrid
      sx={{
        border: "none",
        ".MuiDataGrid-cell": {
          border: "none",
        },
        // ".highlight": {
        //   color: "red",
        //   borderRadius: 5,
        //   "&:hover": {
        //     bgcolor: "darkgrey",
        //   },
        // },
      }}
      columns={columns}
      rows={listItems}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 7,
          },
        },
      }}
      slots={{ toolbar: GridToolbar }}
      /*  getRowClassName={(params) => {
        return params.row.status === "Refunded" ? "highlight" : "";
      }} */
      autoHeight={true}
      pageSizeOptions={[10]}
      showColumnVerticalBorder={false}
      getRowHeight={() => "auto"}
      checkboxSelection
    />
  );
};

export default OrderDetails;
