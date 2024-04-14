import type { FC, ReactElement } from "react";
import { useContext } from "react";
import SignInButton from "@/components/sign-in-button";
import ToolbarMenu from "@/components/toolbar-menu";
import AuthenticationContext from "@/app/authentication-context";

const ToolbarDisplay: FC = (): ReactElement | null => {
  const { isLoading, user } = useContext(AuthenticationContext);

  if (isLoading) {
    return <></>;
  }

  if (!user) {
    return <SignInButton />;
  }

  return <ToolbarMenu />;
};

export default ToolbarDisplay;
