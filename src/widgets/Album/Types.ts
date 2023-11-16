import { RenderPhotoProps } from "react-photo-album";

export interface AlbumProps {
  photos: Photo[];
}

export interface RenderImageProps extends RenderPhotoProps {
  length: number;
}

export interface Photo {
  src: string;
  width: number;
  height: number;
}
