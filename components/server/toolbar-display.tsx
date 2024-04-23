import type { FC, ReactElement } from "react";
import SignInButton from "@/components/client/sign-in-button";
import ToolbarMenu from "@/components/client/toolbar-menu";
import { verifySession } from "@/utils/server-actions";

const ToolbarDisplay: FC = async (): Promise<ReactElement | null> => {
  const session = await verifySession();

  if (!session) {
    return <SignInButton />;
  }

  return <ToolbarMenu />;
};

export default ToolbarDisplay;
