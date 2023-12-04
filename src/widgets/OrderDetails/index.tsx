import { FC } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Stack, IconButton, Typography, Box } from "@mui/material";
import { MoreVert, OpenInNew } from "@mui/icons-material";

import { OrderDetailsProps } from "./Types";

function CorrectRenderLink2() {
  return (
    <Stack direction="row">
      <IconButton>
        <OpenInNew />
      </IconButton>
      <IconButton>
        <MoreVert />
      </IconButton>
    </Stack>
  );
}

const OrderDetails: FC<OrderDetailsProps> = ({ orderDetailsData }) => {
  const columns: GridColDef[] = [
    {
      field: "orderNo",
      headerName: "#ORDER",
      minWidth: 130,
    },
    {
      field: "product",
      headerName: "PRODUCT",
      width: 260,
    },
    {
      field: "sxu",
      headerName: "SXU",
      width: 130,
    },
    {
      field: "category",
      headerName: "CATEGORY",
      width: 132,
    },

    {
      field: "payment",
      headerName: "PAYMENT",
    },
    {
      field: "orderstatus",
      width: 130,
      headerName: "ORDERSTATUS",
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
      rows={orderDetailsData}
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
