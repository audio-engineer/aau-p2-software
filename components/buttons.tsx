import type { FC } from "react";
import React, { type ReactElement } from "react";
import { signInUserWithGoogle, signOutUser } from "@/firebase/authentication";
import Button from "@mui/material/Button";

export const SignInButton: FC = (): ReactElement | null => {
  const handleSignInClick = async (): void => {
    try {
      await signInUserWithGoogle();
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <Button variant="contained" onClick={handleSignInClick}>
      Sign in
    </Button>
  );
};

export const SignOutButton: FC = (): ReactElement | null => {
  const handleSignOutClick = async (): void => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Button variant="contained" onClick={handleSignOutClick}>
      Sign out
    </Button>
  );
};
