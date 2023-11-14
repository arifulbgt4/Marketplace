"use client";
import { FC, useState } from "react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
// import optional lightbox plugins
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import photos from "./photos";
import NextJsImage from "./NextJsImage";

import { AlbumProps } from "./Types";

export const Album: FC<AlbumProps> = () => {
  const [index, setIndex] = useState(-1);

  const layout = photos.length <= 5 ? "rows" : "columns";

  return (
    <>
      <PhotoAlbum
        photos={photos.slice(0, 10)}
        layout={layout}
        spacing={8}
        renderPhoto={NextJsImage}
        defaultContainerWidth={1200}
        onClick={({ index }) => setIndex(index)}
        sizes={{
          size: "calc(100vw - 40px)",
          sizes: [
            { viewport: "(max-width: 299px)", size: "calc(100vw - 10px)" },
            { viewport: "(max-width: 599px)", size: "calc(100vw - 20px)" },
            { viewport: "(max-width: 1199px)", size: "calc(100vw - 30px)" },
          ],
        }}
      />
      <Lightbox
        slides={photos}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        // enable optional lightbox plugins
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
      />
    </>
  );
};
