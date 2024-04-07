"use client";

import type { FC, ReactElement } from "react";
import { useEffect, useMemo, useState } from "react";
import type { Children } from "@/app/layout";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import AuthenticationContext from "@/app/authentication-context";
import type { User } from "@firebase/auth";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "@/firebase/firebase";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ColorModeContext from "@/app/color-mode-context";
import Navigation from "@/components/navigation";

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const MainContainer: FC<Children> = ({
  children,
}: Readonly<Children>): ReactElement | null => {
  const [colorMode, setColorMode] = useState<"dark" | "light">("light");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const colorModeMemo = useMemo(
    () => ({
      toggleColorMode: (): void => {
        setColorMode((prevMode) => {
          if ("light" === prevMode) {
            return "dark";
          }

          return "light";
        });
      },
    }),
    [],
  );

  const themeMemo = useMemo(
    () =>
      createTheme({
        palette: {
          mode: colorMode,
        },
      }),
    [colorMode],
  );

  useEffect(() => {
    // TODO Memoize auth state
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
  }, []);

  return (
    <ColorModeContext.Provider value={colorModeMemo}>
      <ThemeProvider theme={themeMemo}>
        <CssBaseline />
        <AuthenticationContext.Provider
          value={{ isLoading, isAuthenticated, user }}
        >
          <Box>
            <Navigation />
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
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default MainContainer;
