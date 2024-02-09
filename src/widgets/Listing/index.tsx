"use client";
import { FC, useState } from "react";
import {
  CardMedia,
  Typography,
  Link,
  Stack,
  IconButton,
  Box,
  Avatar,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import CategoryIcon from "@mui/icons-material/Category";

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
  const [show, setShow] = useState(false);

  return (
    <Stack
      // elevation={10}
      onMouseOver={() => setShow(true)}
      onMouseOut={() => setShow(false)}
      sx={{
        flexDirection: isGrid ? "column" : "row",
        gap: isGrid ? 0 : 3,
        borderRadius: 3,
        // bgcolor: "transparent",
        ":hover": {
          boxShadow: 14,
        },
      }}
    >
      <Box component={Link} href={`${routes.listingDetails}/${slug}`}>
        <CardMedia
          sx={{
            borderRadius: 3,

            ":hover": {
              borderBottomRightRadius: !show ? 12 : 0,
              borderBottomLeftRadius: !show ? 12 : 0,
            },
          }}
          image={image}
        >
          <Stack height={isGrid ? 250 : 223}>
            {show && (
              <Stack
                p={2}
                justifyContent="space-between"
                alignItems="end"
                flexDirection="row"
                sx={(theme) => ({
                  background: `linear-gradient(to top, ${theme.palette.action.active} 20%, transparent 40%)`,
                })}
                height="100%"
              >
                <Typography pb={0.5} variant="h5" color="#fff">
                  {title}
                </Typography>
                <IconButton
                  sx={(theme) => ({
                    bgcolor: theme.palette.background.default,
                    ":hover": { bgcolor: theme.palette.background.default },
                  })}
                  onClick={() => {
                    setIsSelect((prv) => !prv);
                  }}
                  size="large"
                >
                  {isSelect ? (
                    <BookmarkIcon
                      sx={{ height: 18, width: 18 }}
                      color="primary"
                    />
                  ) : (
                    <BookmarkBorderOutlinedIcon
                      sx={{ height: 18, width: 18 }}
                      color="primary"
                    />
                  )}
                </IconButton>
              </Stack>
            )}
          </Stack>
        </CardMedia>
      </Box>
      <Stack
        p={2}
        width="100%"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Stack
          flexDirection="row"
          alignItems="center"
          gap={1}
          component={Link}
          color="text.primary"
          href={`${routes.listingDetails}/${slug}`}
          sx={{
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          <Avatar sx={{ height: 24, width: 24 }} />
          <Typography variant="h6">Kamruzzaman</Typography>
        </Stack>
        <Stack
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          gap={0.5}
          color="text.secondary"
        >
          <CategoryIcon sx={{ height: 18, width: 18 }} />
          <Typography fontWeight={600} variant="caption">
            2.5
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Listing;
