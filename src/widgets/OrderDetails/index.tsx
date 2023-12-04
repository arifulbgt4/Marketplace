import { FC } from "react";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridColumnGroupingModel,
  GridRowsProp,
  GridToolbar,
  GridRenderCellParams,
} from "@mui/x-data-grid";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Stack,
  IconButton,
  Typography,
  Box,
  Chip,
  TablePagination,
} from "@mui/material";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import { MoreVert, OpenInNew } from "@mui/icons-material";

import { OrderDetailsProps } from "./Types";

function CorrectRenderLink1() {
  return (
    <Stack direction="row" alignItems="center">
      <Box px={2}>
        <InsertPhotoIcon />
      </Box>
      <Typography>
        "Phone 234-M Grey ColorTristique sed Regular Price: $800 Sale Price:
        $8Do "
      </Typography>
    </Stack>
  );
}
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
