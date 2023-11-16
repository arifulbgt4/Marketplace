import { Photo } from "./Types";

const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];

const getPhotos = (photos: Photo[] = []) =>
  photos.map((photo) => ({
    src: photo.src,
    width: photo.width,
    height: photo.height,
    srcSet: breakpoints.map((breakpoint) => {
      const height = Math.round((photo.height / photo.width) * breakpoint);
      return {
        src: photo.src,
        width: breakpoint,
        height,
      };
    }),
  }));

export default getPhotos;
