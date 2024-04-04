import type { FC, ReactElement } from "react";
import SignInButton from "@/components/sign-in-button";
import ToolbarMenu from "@/components/toolbar-menu";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";

const ToolbarDisplay: FC = (): ReactElement | null => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <></>;
  }

  if (error) {
    console.error(error);
  }

  if (!user) {
    return <SignInButton />;
  }

  return <ToolbarMenu />;
};

export default ToolbarDisplay;
