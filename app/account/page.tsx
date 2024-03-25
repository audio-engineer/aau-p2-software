"use client";

import type { FC, ReactElement } from "react";
import { redirect } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { SignOutButton } from "@/components/buttons";

const ProfilePage: FC = (): ReactElement | null => {
  const [user] = useAuthState(auth);
  if (!user) {
    redirect("/");
  }

  return (
    <div>
      <SignOutButton />
    </div>
  );
};

export default ProfilePage;
