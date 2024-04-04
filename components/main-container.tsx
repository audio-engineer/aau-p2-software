"use client";

import type { FC, ReactElement } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ToolbarDisplay from "@/components/toolbar-display";
import type { Children } from "@/app/layout";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const MainContainer: FC<Children> = ({
  children,
}: Readonly<Children>): ReactElement | null => {
  return (
    <Box>
      <AppBar>
        <Toolbar>
          <Typography
            variant="h5"
            component="a"
            href="/"
            sx={{ mr: "1.5rem", color: "inherit", textDecoration: "none" }}
          >
            ChessTeacher
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <Button
              sx={{ my: 2, color: "white", display: "block" }}
              href="/about"
            >
              About
            </Button>
          </Box>
          <ToolbarDisplay />
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ display: "flex", height: "100vh" }}>
        <Container
          maxWidth="xl"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default MainContainer;
