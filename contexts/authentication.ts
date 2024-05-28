"use client";

import { createContext, useContext } from "react";
import type { User } from "firebase/auth";

interface AuthenticationContextProps {
  readonly isUserLoading: boolean;
  readonly user: User | null;
}

const Authentication = createContext<AuthenticationContextProps | null>(null);

export const useAuthentication = (): AuthenticationContextProps => {
  const authenticationContext = useContext(Authentication);

  if (!authenticationContext) {
    throw new Error(
      "useAuthentication has to be used within <Authentication.Provider>",
    );
  }

  return authenticationContext;
};

export default Authentication;
