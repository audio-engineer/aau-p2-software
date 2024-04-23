"use client";

import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { useColorScheme } from "@mui/material/styles";
import type { FC, ReactElement } from "react";
import { useEffect, useState } from "react";
import BrightnessHigh from "@mui/icons-material/BrightnessHigh";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
// Due to CSS Variables being an experimental technology
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import type { Mode } from "@mui/system/cssVars/useCurrentColorScheme";

interface BrightnessIconProps {
  readonly colorMode: string | undefined;
}

const BrightnessIcon: FC<BrightnessIconProps> = ({
  colorMode,
}: BrightnessIconProps): ReactElement | null => {
  if (undefined === colorMode) {
    return null;
  }

  if ("system" === colorMode) {
    return <SettingsBrightnessIcon />;
  }

  if ("dark" === colorMode) {
    return <BrightnessHigh />;
  }

  return <Brightness4Icon />;
};

const ColorMode: FC = (): ReactElement | null => {
  const { mode, setMode } = useColorScheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const toggleColorModeHandler = (): void => {
    let newMode: Mode = "light";

    if ("light" === mode) {
      newMode = "dark";
    }

    if ("dark" === mode) {
      newMode = "system";
    }

    setMode(newMode);
  };

  return (
    <>
      <Typography display={{ xs: "none", sm: "initial" }}>{mode}</Typography>
      <IconButton
        sx={{ ml: "auto", color: "inherit" }}
        onClick={toggleColorModeHandler}
      >
        <BrightnessIcon colorMode={mode} />
      </IconButton>
    </>
  );
};

export default ColorMode;
