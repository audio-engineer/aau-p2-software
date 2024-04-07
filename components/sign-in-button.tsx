import type { FC, ReactElement } from "react";
import { signInWithGoogle } from "@/firebase/auth";
import Button from "@mui/material/Button";

const SignInButton: FC = (): ReactElement | null => {
  const handleSignInWithGoogle = (): void => {
    signInWithGoogle().catch((error: unknown) => {
      console.error(error);
    });
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleSignInWithGoogle}
    >
      Sign In
    </Button>
  );
};

export default SignInButton;
