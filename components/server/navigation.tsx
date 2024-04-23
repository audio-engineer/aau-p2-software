import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ToolbarDisplay from "@/components/server/toolbar-display";
import AppBar from "@mui/material/AppBar";
import type { FC, ReactElement } from "react";
import ColorMode from "@/components/client/color-mode";

const Navigation: FC = (): ReactElement | null => {
  return (
    <AppBar position="static">
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
        <Box
          display="flex"
          alignItems="center"
          marginX={{ md: "1rem" }}
          width={{ xs: "3rem", sm: "5.5rem", lg: "5.5rem" }}
        >
          <ColorMode />
        </Box>
        <ToolbarDisplay />
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
