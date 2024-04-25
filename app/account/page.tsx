import type { FC, ReactElement } from "react";
import AccountPage from "@/components/client/account-page";
import { verifySession } from "@/utils/server-actions";
import { redirect } from "next/navigation";

const Account: FC = async (): Promise<ReactElement | null> => {
  const session = await verifySession();

  if (!session) {
    redirect("/");
  }

  return <AccountPage />;
};

export default Account;
