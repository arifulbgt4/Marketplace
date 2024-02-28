"use client";
import { FC, useState } from "react";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Stack,
  Typography,
} from "@mui/material";

import { ReviewProps } from "./Types";

const Review: FC<ReviewProps> = ({
  id,
  title,
  subheader,
  img,
  description,
}) => {
  const [checked, setChecked] = useState(false);
  return (
    <Stack
      gap={3.8}
      sx={(theme) => ({
        ":hover": {
          "& .MuiCard-root": {
            bgcolor: { md: theme.palette.secondary.light },
            color: { md: theme.palette.secondary.contrastText },
            transform: { md: "scale(1.1)" },
            transformOrigin: { md: "bottom" },

            // mt: 5,
            //  transform-origin: top left;
          },
        },
      })}
    >
      <Card
        elevation={0}
        sx={(theme) => ({
          border: 1,
          borderColor: theme.palette.action.hover,
          transition: "all .5s",
        })}
      >
        {description && (
          <CardContent
            sx={{
              p: 5,
              cursor: "pointer",
              ":last-child": {
                paddingBottom: 5,
              },
            }}
            onClick={() => {
              setChecked((prev) => !prev);
            }}
          >
            <Collapse easing="... hi" in={checked} collapsedSize={88}>
              <Typography
                variant="subtitle1"
                textAlign="center"
                // sx={{
                //   display: "-webkit-box",
                //   WebkitLineClamp: 3,
                //   WebkitBoxOrient: "vertical",
                //   overflow: "hidden",
                // }}
              >
                {description}
              </Typography>
            </Collapse>
            {/* <Typography variant="caption">{"... see more"}</Typography> */}
          </CardContent>
        )}
      </Card>

      <Stack justifyContent="center" alignItems="center">
        <Avatar
          src="https://www.w3schools.com/howto/img_avatar.png"
          alt="JL"
          sx={{ height: 47, width: 47 }}
        />
        <Typography variant="h6">{title}</Typography>
        <Typography variant="caption">{subheader}</Typography>
      </Stack>

      {/* <CardHeader
        avatar={<Avatar variant="rounded" src={img} />}
        title={title}
        subheader={subheader}
      /> */}
    </Stack>
  );
};

export default Review;
