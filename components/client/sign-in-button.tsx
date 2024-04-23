"use client";

import type { FC, ReactElement } from "react";
import { signInWithGoogle } from "@/firebase/auth";
import Button from "@mui/material/Button";

export const handleSignInWithGoogle = (): void => {
  signInWithGoogle().catch((error: unknown) => {
    console.error(error);
  });
};

const SignInButton: FC = (): ReactElement | null => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleSignInWithGoogle}
      type="submit"
    >
      Sign In
    </Button>
  );
};

export default SignInButton;
