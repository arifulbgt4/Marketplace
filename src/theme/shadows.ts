import { Shadows as ShadowsOptions, alpha } from "@mui/material/styles";
import { PaletteOptions } from "./palette";

const COLOR: string = "#000000";

function shadowsTheme({ shadows }: PaletteOptions): ShadowsOptions {
  const TRANSPARENT_ONE: string = shadows?.transparentOne || alpha(COLOR, 0.2);
  const TRANSPARENT_TWO: string = shadows?.transparentTwo || alpha(COLOR, 0.14);
  const TRANSPARENT_THREE: string =
    shadows?.transparentThree || alpha(COLOR, 0.12);
  return [
    `none`,
    `0px 18px 36px -18px ${TRANSPARENT_ONE},0px 30px 45px -30px ${TRANSPARENT_TWO}`,
    `0px 18px 36px -18px ${TRANSPARENT_ONE},0px 30px 45px -30px ${TRANSPARENT_TWO}`,
    `0px 18px 36px -18px ${TRANSPARENT_ONE},0px 30px 45px -30px ${TRANSPARENT_TWO}`,
    `0px 18px 36px -18px ${TRANSPARENT_ONE},0px 30px 45px -30px ${TRANSPARENT_TWO}`,
    `0px 18px 36px 18px ${TRANSPARENT_ONE},0px 30px 45px 30px ${TRANSPARENT_TWO}`,
    `0px 18px 36px 18px ${TRANSPARENT_ONE},0px 30px 45px 30px ${TRANSPARENT_TWO}`,
    `0px 18px 36px 18px ${TRANSPARENT_ONE},0px 30px 45px 30px ${TRANSPARENT_TWO}`,
    `0px 18px 36px 18px ${TRANSPARENT_ONE},0px 30px 45px 30px ${TRANSPARENT_TWO}`,
    `0px 18px 36px 18px ${TRANSPARENT_ONE},0px 30px 45px 30px ${TRANSPARENT_TWO}`,
    `0px 0px 1px 1px rgba(0,0,0,0.005),0px 0px 20px 3px rgba(50,50,93,0.15)`,
    `0px 0px 1px 1px rgba(0,0,0,0.005),0px 0px 30px 7px rgba(50,50,93,0.15)`,
    `0px 0px 1px 1px rgba(0,0,0,0.005),0px 0px 35px 8px rgba(50,50,93,0.15)`,
    `0px 0px 1px 1px rgba(0,0,0,0.005),0px 0px 40px 9px rgba(50,50,93,0.15)`,
    `0px 0px 1px 1px rgba(0,0,0,0.005),0px 0px 45px 10px rgba(50,50,93,0.15)`,
    `0px -18px 10px 0px ${TRANSPARENT_ONE},0px -45px 30px 0px ${TRANSPARENT_TWO}`,
    `0px 18px 36px -18px ${TRANSPARENT_ONE},0px 30px 45px -30px ${TRANSPARENT_TWO}`,
    `0px 18px 36px -18px ${TRANSPARENT_ONE},0px 30px 45px -30px ${TRANSPARENT_TWO}`,
    `0px 18px 36px -18px ${TRANSPARENT_ONE},0px 30px 45px -30px ${TRANSPARENT_TWO}`,
    `0px 18px 36px -18px ${TRANSPARENT_ONE},0px 30px 45px -30px ${TRANSPARENT_TWO}`,
    `0px 18px 36px -18px ${TRANSPARENT_ONE},0px 30px 45px -30px ${TRANSPARENT_TWO}`,
    `0px 18px 36px -18px ${TRANSPARENT_ONE},0px 30px 45px -30px ${TRANSPARENT_TWO}`,
    `0px 18px 36px -18px ${TRANSPARENT_ONE},0px 30px 45px -30px ${TRANSPARENT_TWO}`,
    `0px 18px 36px -18px ${TRANSPARENT_ONE},0px 30px 45px -30px ${TRANSPARENT_TWO}`,
    ` 0 2px 4px 0 ${TRANSPARENT_ONE}, 0 2px 4px 0 ${TRANSPARENT_TWO}`,
  ];
}

export default shadowsTheme;
