import { RenderPhotoProps } from "react-photo-album";

export interface AlbumProps {}

export interface RenderImageProps extends RenderPhotoProps {
  length: number;
}
