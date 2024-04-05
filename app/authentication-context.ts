import { createContext } from "react";
import type { User } from "@firebase/auth";

interface AuthenticationContextProperties {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

const AuthenticationContext = createContext<AuthenticationContextProperties>({
  isLoading: false,
  isAuthenticated: false,
  user: null,
});

export default AuthenticationContext;
