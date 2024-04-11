import { createContext } from "react";

export type ColorMode = "dark" | "light";

export const dark: ColorMode = "dark";
export const light: ColorMode = "light";

interface ColorModeContextProps {
  readonly toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextProps>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleColorMode: () => {},
});

export default ColorModeContext;
