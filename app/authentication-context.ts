import { createContext } from "react";
import type { User } from "@firebase/auth";

interface AuthenticationContextProperties {
  isLoading: boolean;
  user: User | null;
}

const AuthenticationContext = createContext<AuthenticationContextProperties>({
  isLoading: false,
  user: null,
});

export default AuthenticationContext;
