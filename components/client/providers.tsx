"use client";

import type { FC, PropsWithChildren, ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthenticationProvider from "@/components/client/providers/authentication-provider";

const queryClient = new QueryClient();

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const Providers: FC<PropsWithChildren> = ({
  children,
}): ReactElement | null => {
  return (
    <AuthenticationProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AuthenticationProvider>
  );
};

export default Providers;
