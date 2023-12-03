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
import { useDemoData } from "@mui/x-data-grid-generator";

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
      renderCell: CorrectRenderLink1,
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

  /*  const correctColumns: GridColDef[] = [
    { field: "orderNo", renderCell: CorrectRenderLink1, width: 200 },
    { field: "656", renderCell: CorrectRenderLink2, width: 200 },
  ]; */

  // const { data } = useDemoData({
  //   dataSet: "Commodity",
  //   rowLength: 5,
  //   maxColumns: 6,
  // });

  return (
    <DataGrid
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
    ></DataGrid>
    // <>
    //   <TableContainer>
    //     <Table sx={{ overflowX: "auto" }}>
    //       <TableHead>
    //         <TableRow>
    //           <TableCell align="left" sx={{ borderBottom: "none" }}>
    //             Order
    //           </TableCell>
    //           <TableCell align="left" sx={{ borderBottom: "none" }}>
    //             PRODUCT
    //           </TableCell>
    //           <TableCell align="left" sx={{ borderBottom: "none" }}>
    //             SXU
    //           </TableCell>
    //           <TableCell align="left" sx={{ borderBottom: "none" }}>
    //             CATEGORY
    //           </TableCell>
    //           <TableCell align="left" sx={{ borderBottom: "none" }}>
    //             PAYMENT
    //           </TableCell>
    //           <TableCell align="left" sx={{ borderBottom: "none" }}>
    //             ORDER STATUS
    //           </TableCell>
    //           <TableCell align="left" sx={{ borderBottom: "none" }}>
    //             ACTIONS
    //           </TableCell>
    //         </TableRow>
    //       </TableHead>
    //       <TableBody>
    //         {orderDetailsData.map((data) => {
    //           const {
    //             id,
    //             orderNo,
    //             product,
    //             sxu,
    //             category,
    //             payment,
    //             orderStatus,
    //           } = data;
    //           return (
    //             <TableRow key={id}>
    //               <TableCell
    //                 sx={{
    //                   display: "flex",
    //                   borderBottom: "none",
    //                 }}
    //                 align="left"
    //               >
    //                 {orderNo}
    //               </TableCell>
    //               <TableCell
    //                 align="left"
    //                 sx={{ maxWidth: 164, borderBottom: "none" }}
    //               >
    //                 <Stack flexDirection="row" alignItems="self-start" gap={1}>
    //                   <IconButton sx={{ p: 0 }}>
    //                     <InsertPhotoIcon />
    //                   </IconButton>
    //                   <Typography variant="body2">{product}</Typography>
    //                 </Stack>
    //               </TableCell>
    //               <TableCell sx={{ borderBottom: "none" }} align="left">
    //                 {sxu}
    //               </TableCell>
    //               <TableCell sx={{ borderBottom: "none" }} align="left">
    //                 <Stack flexDirection="row" alignItems="self-start" gap={1}>
    //                   <IconButton sx={{ p: 0 }}>
    //                     <SmartphoneIcon />
    //                   </IconButton>
    //                   <Typography variant="body2">{category}</Typography>
    //                 </Stack>
    //               </TableCell>
    //               <TableCell sx={{ borderBottom: "none" }} align="left">
    //                 <Box>
    //                   <Typography variant="h6">
    //                     {"$"}
    //                     {payment}
    //                   </Typography>
    //                   <Typography variant="body2">Full Paid</Typography>
    //                 </Box>
    //               </TableCell>
    //               <TableCell sx={{ borderBottom: "none" }} align="left">
    //                 <Chip
    //                   size="small"
    //                   label={orderStatus}
    //                   color={orderStatus === "Complete" ? "primary" : "warning"}
    //                 />
    //               </TableCell>
    //               <TableCell sx={{ borderBottom: "none" }} align="left">
    //                 <Stack flexDirection="row">
    //                   <IconButton>
    //                     <OpenInNew />
    //                   </IconButton>
    //                   <IconButton>
    //                     <MoreVert />
    //                   </IconButton>
    //                 </Stack>
    //               </TableCell>
    //             </TableRow>
    //           );
    //         })}
    //       </TableBody>
    //     </Table>
    //   </TableContainer>

    // </>
  );
};

export default OrderDetails;
