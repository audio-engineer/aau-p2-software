import type { FC, ReactElement } from "react";
import AccountPage from "@/components/client/account-page";
import { verifySession } from "@/utils/server-actions";

const Account: FC = async (): Promise<ReactElement | null> => {
  const session = await verifySession();

  if (!session) {
    return null;
  }

  return <AccountPage />;
};

export default Account;
