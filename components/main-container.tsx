"use client";

import type { FC, ReactElement } from "react";
import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ToolbarDisplay from "@/components/toolbar-display";
import type { Children } from "@/app/layout";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import AuthenticationContext from "@/app/authentication-context";
import type { User } from "@firebase/auth";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "@/firebase/firebase";

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const MainContainer: FC<Children> = ({
  children,
}: Readonly<Children>): ReactElement | null => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setIsAuthenticated(!!firebaseUser);
        setIsLoading(false);
      },
      (error: Readonly<Error>) => {
        console.error("Authentication error", error);
      },
    );
  }, [auth]);

  return (
    <AuthenticationContext.Provider
      value={{ isLoading, isAuthenticated, user }}
    >
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
                sx={{ my: 2, color: "white", width: "fit-content" }}
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
    </AuthenticationContext.Provider>
  );
};

export default MainContainer;
