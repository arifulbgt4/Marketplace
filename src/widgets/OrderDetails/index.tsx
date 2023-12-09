import { FC, useMemo } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import {
  Stack,
  IconButton,
  Typography,
  Box,
  Avatar,
  Button,
} from "@mui/material";
import { MoreVert, OpenInNew } from "@mui/icons-material";
import { GridCellParams } from "@mui/x-data-grid";

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
      width: 140,
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
    },
    {
      field: "orderstatus",
      width: 90,
      renderCell: (params) => <Avatar src={params.value} />,
    },
    {
      field: "customer",
      headerName: "Customer",
      width: 132,
      valueGetter: (params) => params.row.customer.name,
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
      autoHeight={true}
      pageSizeOptions={[10]}
      disableRowSelectionOnClick
      showColumnVerticalBorder={false}
      getRowHeight={() => "auto"}
    />
  );
};

export default OrderDetails;
