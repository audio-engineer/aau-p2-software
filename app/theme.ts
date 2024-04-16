import { Roboto } from "next/font/google";
import type { PaletteMode, PaletteOptions, ThemeOptions } from "@mui/material";

const roboto = Roboto({ subsets: ["latin"], weight: "500" });

const commonPalette: PaletteOptions = {};

const lightPalette: PaletteOptions = {
  ...commonPalette,
  primary: {
    main: "#9e8d8d",
  },
};

const darkPalette: PaletteOptions = {
  ...commonPalette,
};

export const getThemeOptions = (paletteMode: PaletteMode): ThemeOptions => {
  let palette: PaletteOptions = {};

  if ("light" === paletteMode) {
    palette = lightPalette;
  } else {
    palette = darkPalette;
  }

  return {
    palette: {
      mode: paletteMode,
      ...palette,
    },
    typography: {
      fontFamily: roboto.style.fontFamily,
    },
  };
};
