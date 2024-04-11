import type { Metadata } from "next";
import type { FC, ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import ErrorHandler from "@/utils/error-handler";
import dynamic from "next/dynamic";

const MainContainer = dynamic(
  async () => import("@/components/main-container"),
  {
    ssr: false,
  },
);

export const metadata: Metadata = {
  title: "ChessTeacher",
  description: "Next-gen Online Chess Instructor",
};

export interface Children {
  readonly children: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const RootLayout: FC<Children> = ({ children }: Readonly<Children>) => {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ErrorHandler />
          <CssBaseline />
          <MainContainer>{children}</MainContainer>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
