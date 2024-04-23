"use client";

import type { FC, PropsWithChildren, ReactElement } from "react";
import { useEffect, useMemo, useState } from "react";
import type { User } from "@firebase/auth";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "@/firebase/firebase";
import Authentication from "@/contexts/authentication";

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const AuthenticationProvider: FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): ReactElement | null => {
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo(
    () => ({
      isUserLoading,
      user,
    }),
    [isUserLoading, user],
  );

  useEffect(() => {
    return onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (!firebaseUser) {
          return;
        }

        setUser(firebaseUser);

        setIsUserLoading(false);
      },
      (error: unknown) => {
        console.error("Authentication error", error);
      },
    );
  }, []);

  return (
    <Authentication.Provider value={value}>{children}</Authentication.Provider>
  );
};

export default AuthenticationProvider;
