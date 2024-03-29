"use client";
import { FC, useMemo } from "react";
import { Grid } from "@mui/material";

import ListingHeader from "src/widgets/ListingHeader";

import { Album } from "../Album";
import { ListingPreviewProps } from "./Types";
import { amenities } from "src/global/staticData";
import { Amenities } from "../ListingContents";

const photos = [
  {
    src: "https://res.cloudinary.com/deoei2z3x/image/upload/c_crop,g_auto,h_700,w_700/permanent/hnbuklwtczrncsr6izb5.jpg",
    width: 700,
    height: 700,
  },
  {
    src: "https://res.cloudinary.com/deoei2z3x/image/upload/c_crop,g_auto,h_1200,w_1200/permanent/hnbuklwtczrncsr6izb5.jpg",
    width: 1200,
    height: 1200,
  },
  {
    src: "https://res.cloudinary.com/deoei2z3x/image/upload/c_crop,g_auto,h_850,w_850/permanent/hnbuklwtczrncsr6izb5.jpg",
    width: 850,
    height: 850,
  },
  {
    src: "https://res.cloudinary.com/deoei2z3x/image/upload/c_crop,g_auto,h_1800,w_1800/permanent/hnbuklwtczrncsr6izb5.jpg",
    width: 1800,
    height: 1800,
  },
  {
    src: "https://res.cloudinary.com/deoei2z3x/image/upload/c_crop,g_auto,h_1250,w_1250/permanent/hnbuklwtczrncsr6izb5.jpg",
    width: 1250,
    height: 1250,
  },
  {
    src: "https://res.cloudinary.com/deoei2z3x/image/upload/c_crop,g_auto,h_700,w_700/permanent/hnbuklwtczrncsr6izb5.jpg",
    width: 700,
    height: 700,
  },
  {
    src: "https://res.cloudinary.com/deoei2z3x/image/upload/c_crop,g_auto,h_1200,w_1200/permanent/hnbuklwtczrncsr6izb5.jpg",
    width: 1200,
    height: 1200,
  },
  {
    src: "https://res.cloudinary.com/deoei2z3x/image/upload/c_crop,g_auto,h_850,w_850/permanent/hnbuklwtczrncsr6izb5.jpg",
    width: 850,
    height: 850,
  },
  {
    src: "https://res.cloudinary.com/deoei2z3x/image/upload/c_crop,g_auto,h_1810,w_1810/permanent/hnbuklwtczrncsr6izb5.jpg",
    width: 1810,
    height: 1810,
  },
  {
    src: "https://res.cloudinary.com/deoei2z3x/image/upload/c_crop,g_auto,h_1250,w_1250/permanent/hnbuklwtczrncsr6izb5.jpg",
    width: 1250,
    height: 1250,
  },
];

const ListingPreview: FC<ListingPreviewProps> = ({ values }) => {
  const { title, address, image, amenities: amenitiesInput } = values;
  const photoDate = useMemo(() => {
    return image?.map((d: FileList) => {
      let width = 0;
      let height = 0;
      const objectURL = URL.createObjectURL(d[0]);
      const img = document.createElement("img");
      img.onload = function handleLoad() {
        width = img.width;
        height = img.height;

        // URL.revokeObjectURL(objectURL);
      };
      img.src = objectURL;
      return {
        src: objectURL,
        width: 100,
        height: 100,
      };
    });
  }, [image]);

  const amenitie = useMemo(() => {
    return amenities.filter((d) => amenitiesInput?.includes(d.value));
  }, [amenitiesInput]);

  return (
    <Grid container spacing={3} p={3}>
      <Grid item xs={12}>
        <ListingHeader
          title={title || "{Title}"}
          address={address || "{Address}"}
          creator="superhost"
        />
      </Grid>
      <Grid item xs={12}>
        <Album photos={photoDate?.length ? photoDate : photos} />
      </Grid>
      <Grid container item xs={12} spacing={2}>
        {amenitie?.map((d) => (
          <Grid key={d.value} item xs={12} md={6}>
            <Amenities {...d} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default ListingPreview;
