import { createContext } from "react";

interface ColorModeContextProps {
  readonly toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextProps>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleColorMode: () => {},
});

export default ColorModeContext;
