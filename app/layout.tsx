import type { Metadata } from "next";
import type { FC, PropsWithChildren } from "react";
import MainContainer from "@/components/server/main-container";
import Providers from "@/components/client/providers";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import { theme } from "@/app/theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import InitColorSchemeScript from "@/components/client/init-color-scheme-script";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "ChessTeacher",
  description: "Next-gen Online Chess Instructor",
};

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const RootLayout: FC<PropsWithChildren> = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en">
      <body>
        <InitColorSchemeScript />
        <AppRouterCacheProvider>
          <CssVarsProvider theme={theme} defaultMode="system">
            <CssBaseline />
            <Providers>
              <MainContainer>{children}</MainContainer>
            </Providers>
          </CssVarsProvider>
        </AppRouterCacheProvider>
        <SpeedInsights />
      </body>
    </html>
  );
};

export default RootLayout;
