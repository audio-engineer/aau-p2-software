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
import type { ColorMode } from "@/app/color-mode-context";
import ColorModeContext, { dark, light } from "@/app/color-mode-context";
import Navigation from "@/components/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";

const queryClient = new QueryClient();

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const MainContainer: FC<Children> = ({
  children,
}: Readonly<Children>): ReactElement | null => {
  const [colorMode, setColorMode] = useState<ColorMode>(light);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [localStorageColorMode, setLocalStorageColorMode] =
    useLocalStorage<ColorMode>("color-mode", "light");

  useEffect(() => {
    setColorMode(localStorageColorMode);
  }, [localStorageColorMode]);

  const colorModeMemo = useMemo(
    () => ({
      toggleColorMode: (): void => {
        setColorMode((previousMode) => {
          if (light === previousMode) {
            setLocalStorageColorMode(dark);

            return dark;
          }

          setLocalStorageColorMode(light);

          return light;
        });
      },
    }),
    [setLocalStorageColorMode],
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
    return onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
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
        <AuthenticationContext.Provider value={{ isLoading, user }}>
          <QueryClientProvider client={queryClient}>
            <Box>
              <Navigation />
              <Box component="main" display="flex" height="100vh">
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
          </QueryClientProvider>
        </AuthenticationContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default MainContainer;
