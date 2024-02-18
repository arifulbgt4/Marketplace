"use client";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CardMedia,
  Typography,
  Stack,
  IconButton,
  Card,
  CardContent,
  Chip,
  Box,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import routes from "src/global/routes";

import { ListingProps } from "./Types";

const Listing: FC<ListingProps> = ({
  isGrid = true,
  isMark = false,
  id,
  slug,
  title,
  image,
  price,
  description,
  rating,
  address,
  services,
  name,
}) => {
  const router = useRouter();
  const [isSelect, setIsSelect] = useState(isMark);

  return (
    <Card
      onClick={() => router.push(`${routes.listingDetails}/${slug}`)}
      elevation={0}
      sx={(theme) => ({
        cursor: "pointer",
        borderRadius: 3,
        ":hover": {
          boxShadow: 10,
          "& article": {
            opacity: { md: 1 },
          },
        },
      })}
    >
      <CardMedia image={image}>
        <Stack
          height={320}
          justifyContent="space-between"
          sx={{ opacity: { md: 0 }, transition: "all .4s" }}
          component="article"
        >
          <Stack
            sx={(theme) => ({
              background: `linear-gradient(to bottom, ${theme.palette.action.active} 20%, transparent 100%)`,
            })}
            p={2}
            flexDirection="row"
            justifyContent="space-between"
          >
            <Chip
              label="For Sale"
              sx={(theme) => ({
                bgcolor: theme.palette.primary.contrastText,
              })}
            />
            <IconButton
              sx={(theme) => ({
                color: theme.palette.primary.contrastText,
                p: 0,
              })}
              onClick={(event) => {
                event.stopPropagation();
                setIsSelect((prv) => !prv);
              }}
            >
              {isSelect ? <BookmarkIcon /> : <BookmarkBorderOutlinedIcon />}
            </IconButton>
          </Stack>
          <Box
            p={2}
            sx={(theme) => ({
              background: `linear-gradient(to top, ${theme.palette.action.active} 40%, transparent 100%)`,
            })}
          >
            <Typography
              variant="h3"
              sx={(theme) => ({
                color: theme.palette.primary.contrastText,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              })}
            >
              {title}
            </Typography>
          </Box>
        </Stack>
      </CardMedia>
      <CardContent>
        <Stack
          flexDirection="row"
          gap={1}
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <Stack
            flexDirection="row"
            alignItems="flex-start"
            gap={0.5}
            sx={{
              ":hover": {
                color: "primary.dark",
              },
            }}
          >
            <LocationOnIcon
              sx={{ height: 16, width: 16, mt: 0.5, opacity: 0.6 }}
            />

            <Typography
              variant="h6"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                transition: "all .01s",
              }}
              component="p"
            >
              {address}
            </Typography>
          </Stack>
          <Stack
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
          >
            <Typography color="text.disabled" pr={0.2} variant="h5">
              {"$"}
            </Typography>
            <Typography variant="h4">2.2</Typography>
            <Typography color="text.disabled" variant="h6" letterSpacing={-0.3}>
              {"/mon"}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>

    // <Stack
    //   // component={Link}
    //   // href={`${routes.listingDetails}/${slug}`}
    //   onClick={() => router.push(`${routes.listingDetails}/${slug}`)}
    // sx={(theme) => ({
    //   cursor: "pointer",
    //   transition: "all .1s",

    //   ":hover": {
    //     bgcolor: theme.palette.background.paper,
    //     "& .MuiCardMedia-root": {
    //       boxShadow: 10,
    //     },
    //     "& h5": {
    //       color: theme.palette.primary.contrastText,
    //     },
    //     "& button": {
    //       color: theme.palette.primary.contrastText,
    //     },
    //     "& span": {
    //       background: `linear-gradient(to top, ${theme.palette.action.active} 20%, transparent 40%)`,
    //     },
    //     "& .MuiTypography-subtitle2": {
    //       opacity: 1,
    //     },
    //   },
    //   flexDirection: isGrid ? "column" : "row",
    //   gap: isGrid ? 0 : 3,
    //   position: "relative",
    //   borderRadius: 4.5,
    // })}
    // >
    //   <CardMedia
    //     sx={{
    //       borderRadius: 3,
    //       transition: "all .1s",
    //     }}
    //     image={image}
    //   >
    //     <Stack
    //       component="span"
    //       justifyContent="flex-end"
    //       sx={(theme) => ({
    //         transition: "all .1s",
    //         background: {
    //           xs: `linear-gradient(to top, ${theme.palette.action.active} 20%, transparent 40%)`,
    //           md: "transparent",
    //         },
    //       })}
    //       borderRadius={3}
    //       height={250}
    //     >
    //       <Stack
    //         flexDirection="row"
    //         p={1}
    //         gap={1}
    //         justifyContent="space-between"
    //         alignItems="start"
    //       >
    //         <Typography
    //           pb={0.5}
    //           variant="h5"
    //           sx={(theme) => ({
    //             color: {
    //               xs: theme.palette.primary.contrastText,
    //               md: "transparent",
    //             },
    //             display: "-webkit-box",
    //             WebkitLineClamp: 2,
    //             WebkitBoxOrient: "vertical",
    //             overflow: "hidden",
    //             transition: "all .01s",
    //           })}
    //         >
    //           {title}
    //         </Typography>

    //         <IconButton
    //           sx={(theme) => ({
    //             color: {
    //               xs: theme.palette.primary.contrastText,
    //               md: "transparent",
    //             },
    //             transition: "all .1s",
    //           })}
    //           onClick={(event) => {
    //             event.stopPropagation();
    //             setIsSelect((prv) => !prv);
    //           }}
    //           // size="small"
    //         >
    //           {isSelect ? <BookmarkIcon /> : <BookmarkBorderOutlinedIcon />}
    //         </IconButton>
    //       </Stack>
    //     </Stack>
    //   </CardMedia>
    //   <Stack
    //     flexDirection="row"
    //     p={1}
    //     gap={1}
    //     justifyContent="space-between"
    //     alignItems="flex-start"
    //   >
    //     <Stack
    //       flexDirection="row"
    //       alignItems="flex-start"
    //       gap={0.5}
    //       color="text.primary"
    //     >
    //       <LocationOnIcon
    //         sx={{ height: 16, width: 16, mt: 0.5, opacity: 0.6 }}
    //       />

    //       <Typography
    //         fontWeight={500}
    //         variant="subtitle2"
    //         sx={{
    //           display: "-webkit-box",
    //           WebkitLineClamp: 2,
    //           WebkitBoxOrient: "vertical",
    //           overflow: "hidden",
    //           transition: "all .01s",
    //         }}
    //         component="p"
    //       >
    //         {address}
    //       </Typography>
    //     </Stack>
    //     <Stack
    //       flexDirection="row"
    //       justifyContent="center"
    //       alignItems="center"
    //       color="text.secondary"
    //     >
    //       <Typography pr={0.2} variant="subtitle2">
    //         {"$"}
    //       </Typography>
    //       <Typography fontWeight={500} variant="subtitle1">
    //         2.2
    //       </Typography>
    //       <Typography
    //         component="p"
    //         variant="caption"
    //         letterSpacing={-0.3}
    //         sx={(theme) => ({
    //           opacity: 0.6,
    //         })}
    //       >
    //         /mon
    //       </Typography>
    //     </Stack>
    //   </Stack>
    // </Stack>
  );
};

export default Listing;
