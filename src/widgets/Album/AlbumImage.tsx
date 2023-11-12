import { FC, useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Box } from "@mui/material";
import { AlbumImageProps } from "./Types";

const AlbumImage: FC<AlbumImageProps> = ({
  src,
  half = false,
  spacing = 0,
}) => {
  const [size, setSize] = useState<number>(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref?.current !== undefined) {
      setSize(ref.current?.clientWidth || 0);
    }
  }, [ref]);

  const height = half ? size / 2 : size;

  return (
    <Box
      ref={ref}
      sx={(theme) => ({
        position: "relative",
        height: half
          ? `calc(${height}px - ${theme.spacing(spacing / 2)})`
          : height,
        borderRadius: 1,
        overflow: "hidden",
        cursor: "pointer",
      })}
    >
      <Image
        src={src}
        alt="albm"
        fill
        sizes={`(max-width: 1122px) 50vw, 100vw`}
        style={{
          objectFit: "cover",
        }}
      />
    </Box>
  );
};

export default AlbumImage;
