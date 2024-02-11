"use client";
import { FC, useState } from "react";
import { CardMedia, Typography, Link, Stack, IconButton } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

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
  const [isSelect, setIsSelect] = useState(isMark);

  return (
    <Stack
      component={Link}
      href={`${routes.listingDetails}/${slug}`}
      sx={(theme) => ({
        transition: "all 1s",
        ":hover": {
          bgcolor: theme.palette.background.paper,
          "& .MuiCardMedia-root": {
            boxShadow: 14,
          },
          "& h5": {
            color: theme.palette.primary.contrastText,
          },
          "& button": {
            color: theme.palette.primary.contrastText,
          },
          "& span": {
            background: `linear-gradient(to top, ${theme.palette.action.active} 20%, transparent 40%)`,
          },
        },

        flexDirection: isGrid ? "column" : "row",
        gap: isGrid ? 0 : 3,
        position: "relative",
        borderRadius: 4.5,
      })}
    >
      <CardMedia
        sx={{
          borderRadius: 3,
          transition: "all 5s",
        }}
        image={image}
      >
        <Stack height={250} overflow="hidden">
          <Stack
            component="span"
            p={2}
            justifyContent="space-between"
            alignItems="end"
            flexDirection="row"
            sx={(theme) => ({
              transition: "all 1s",
            })}
            borderRadius={3}
            height="100%"
          >
            <Typography
              pb={0.5}
              variant="h5"
              sx={(theme) => ({
                color: {
                  xs: theme.palette.primary.contrastText,
                  md: "transparent",
                },
                transition: "all 1s",
              })}
            >
              {title}
            </Typography>
            <IconButton
              sx={(theme) => ({
                color: {
                  xs: theme.palette.primary.contrastText,
                  md: "transparent",
                },
                transition: "all 1s",
              })}
              onClick={() => {
                setIsSelect((prv) => !prv);
              }}
              size="small"
            >
              {isSelect ? <BookmarkIcon /> : <BookmarkBorderOutlinedIcon />}
            </IconButton>
          </Stack>
        </Stack>
      </CardMedia>
      <Stack flexDirection="row" p={2} justifyContent="space-between">
        <Stack
          flexDirection="row"
          alignItems="center"
          gap={0.5}
          color="text.primary"
        >
          <LocationOnIcon sx={{ height: 16, width: 16 }} />
          <Typography fontWeight={400} variant="subtitle1" component="p">
            {address.slice(0, 24)}
          </Typography>
        </Stack>
        <Stack
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          color="text.secondary"
        >
          <AttachMoneyIcon sx={{ height: 18, width: 18 }} />
          <Typography fontWeight={500} variant="subtitle1">
            2.2
          </Typography>
          <Typography
            component="p"
            variant="caption"
            letterSpacing={-0.3}
            sx={(theme) => ({
              opacity: 0.6,
            })}
          >
            /mon
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Listing;
