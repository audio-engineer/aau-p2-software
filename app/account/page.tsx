"use client";

import type { FC, ReactElement } from "react";
import { redirect } from "next/navigation";
import Loader from "@/components/loader";
import AccountPage from "@/components/account-page";
import { auth } from "@/firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Account: FC = (): ReactElement | null => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    console.error(error);
  }

  if (!user) {
    redirect("/");
  }

  return <AccountPage user={user} />;
};

export default Account;
