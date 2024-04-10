import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import ToolbarDisplay from "@/components/toolbar-display";
import AppBar from "@mui/material/AppBar";
import type { FC, ReactElement } from "react";
import { useContext } from "react";
import ColorModeContext from "@/app/color-mode-context";
import { useTheme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";

interface BrightnessIconProps {
  readonly colorMode: PaletteMode;
}

const BrightnessIcon: FC<BrightnessIconProps> = ({
  colorMode,
}: BrightnessIconProps): ReactElement | null => {
  if ("dark" === colorMode) {
    return <Brightness7Icon />;
  }

  return <Brightness4Icon />;
};

const Navigation: FC = (): ReactElement | null => {
  const theme = useTheme();
  const { toggleColorMode } = useContext(ColorModeContext);

  return (
    <AppBar>
      <Toolbar>
        <Typography
          variant="h5"
          component="a"
          href="/"
          sx={{
            mr: "1.5rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          ChessTeacher
        </Typography>
        <Box flexGrow="1" />
        <Box>
          <Button color="inherit" href="/about">
            About
          </Button>
        </Box>
        <Box marginX="1rem" width={{ lg: "8rem" }}>
          {theme.palette.mode} mode
          <IconButton
            sx={{ ml: 1, color: "inherit" }}
            onClick={toggleColorMode}
          >
            <BrightnessIcon colorMode={theme.palette.mode} />
          </IconButton>
        </Box>
        <ToolbarDisplay />
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
