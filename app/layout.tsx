import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import type { FC, ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

const inter = Roboto({ subsets: ["latin"], weight: "500" });

export const metadata: Metadata = {
  title: "AAU P2 Software",
  description: "Next-gen Online Chess Game",
};

interface Children {
  readonly children: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const RootLayout: FC<Children> = ({ children }: Readonly<Children>) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
