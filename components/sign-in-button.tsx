import type { FC, ReactElement } from "react";
import { signInWithGoogle } from "@/firebase/auth";
import Button from "@mui/material/Button";
import { asyncEventHandler } from "@/utils/utils";

const handleSignInWithGoogle = asyncEventHandler(async (): Promise<void> => {
  await signInWithGoogle();
});

const SignInButton: FC = (): ReactElement | null => {
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
