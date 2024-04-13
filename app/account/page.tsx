"use client";

import type { FC, ReactElement } from "react";
import { useContext } from "react";
import Loader from "@/components/loader";
import AccountPage from "@/components/account-page";
import AuthenticationContext from "@/app/authentication-context";
import { redirect } from "next/navigation";

const Account: FC = (): ReactElement | null => {
  const { isLoading, isAuthenticated, user } = useContext(
    AuthenticationContext,
  );

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated || !user) {
    redirect("/");
  }

  return <AccountPage user={user} />;
};

export default Account;
