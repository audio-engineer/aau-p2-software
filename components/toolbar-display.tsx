import type { FC, ReactElement } from "react";
import { useContext } from "react";
import SignInButton from "@/components/sign-in-button";
import ToolbarMenu from "@/components/toolbar-menu";
import AuthenticationContext from "@/app/authentication-context";

const ToolbarDisplay: FC = (): ReactElement | null => {
  const { isLoading, isAuthenticated } = useContext(AuthenticationContext);

  if (isLoading) {
    return <></>;
  }

  if (!isAuthenticated) {
    return <SignInButton />;
  }

  return <ToolbarMenu />;
};

export default ToolbarDisplay;
