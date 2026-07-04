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
  type = "rent",
  description,
  rating,
  address,
  bedrooms,
  bathrooms,
  services,
  name,
}) => {
  const router = useRouter();
  const [isSelect, setIsSelect] = useState(isMark);

  const typeLabel = type === "sale" ? "For Sale" : "For Rent";

  return (
    <Card
      onClick={() => router.push(`${routes.listingDetails}/${slug}`)}
      sx={(theme) => ({
        cursor: "pointer",
        position: "relative",
        borderRadius: 3,
        transition: "all .5s",
        bgcolor: "transparent",
        pb: 0,
        boxShadow: { xs: 10, md: 0 },
        "& .MuiChip-root": {
          marginRight: { xs: 5, md: 0 },
        },
        ":hover": {
          boxShadow: 10,
          "& article": {
            opacity: { md: 1 },
          },
          "& .MuiChip-root": {
            marginRight: 5,
          },
          "& .MuiCardMedia-root": {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
        },
      })}
    >
      <Box
        sx={{
          overflow: "hidden",
          position: "absolute",
          top: { xs: 27, md: 17 },
          left: 16,
          zIndex: 1,
        }}
      >
        <Chip
          label={typeLabel}
          sx={(theme) => ({
            bgcolor: theme.palette.primary.contrastText,
            fontWeight: 500,
          })}
        />
      </Box>
      <CardMedia
        sx={{
          aspectRatio: 1,
          objectFit: "cover",
          borderBottomLeftRadius: { md: 12 },
          borderBottomRightRadius: { md: 12 },
          transition: "all .5s",
        }}
        image={image}
      >
        {price !== undefined && (
          <Chip
            sx={(theme) => ({
              bgcolor: theme.palette.action.active,
              fontWeight: 500,
              position: "absolute",
              right: 16,
              top: { xs: 27, md: 17 },
              p: 0,
              zIndex: 1,
              transition: "all .5s",
            })}
            label={
              <Stack flexDirection="row" justifyContent="end" alignItems="center">
                <Typography
                  color={(theme) => theme.palette.common.white}
                  pr={0.2}
                  variant="caption"
                  fontSize={14}
                >
                  {"$"}
                </Typography>
                <Typography
                  color={(theme) => theme.palette.common.white}
                  variant="subtitle2"
                  fontWeight={500}
                >
                  {price}
                </Typography>
                <Typography
                  color={(theme) => theme.palette.common.white}
                  variant="caption"
                  letterSpacing={-0.3}
                  fontSize={12}
                >
                  {"/mon"}
                </Typography>
              </Stack>
            }
          />
        )}

        <Stack
          justifyContent="space-between"
          sx={{
            opacity: { md: 0 },
            transition: "all .5s",
          }}
          component="article"
          height="100%"
        >
          <Stack
            sx={(theme) => ({
              background: `linear-gradient(to bottom, ${theme.palette.action.active} 40%, transparent 100%)`,
            })}
            pr={2}
            pt={{ xs: 3, md: 2 }}
            flexDirection="row"
            justifyContent="flex-end"
          >
            <IconButton
              sx={(theme) => ({
                border: 1,
                color: theme.palette.primary.contrastText,
                borderColor: "transparent",
                ":hover": {
                  borderColor: theme.palette.primary.contrastText,
                },
              })}
              size="small"
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
      <CardContent
        sx={{
          p: 2,
          ":last-child": {
            paddingBottom: 2,
          },
        }}
      >
        <Stack flexDirection="row" gap={0.5}>
          <LocationOnIcon
            sx={{ height: 16, width: 16, mt: 0.5, opacity: 0.7 }}
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
        {(bedrooms !== undefined || bathrooms !== undefined) && (
          <Stack flexDirection="row" gap={1} mt={1}>
            {bedrooms !== undefined && (
              <Typography variant="caption" color="text.secondary">
                {bedrooms} {bedrooms === 1 ? "bed" : "beds"}
              </Typography>
            )}
            {bathrooms !== undefined && (
              <Typography variant="caption" color="text.secondary">
                {bathrooms} {bathrooms === 1 ? "bath" : "baths"}
              </Typography>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default Listing;
