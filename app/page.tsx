"use client";

import type { FC, ReactElement } from "react";
import Lobby from "@/components/lobby";
import HomePage from "@/components/home-page";
import Loader from "@/components/loader";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";

const Home: FC = (): ReactElement | null => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    console.error(error);
  }

  if (!user) {
    return <HomePage />;
  }

  return <Lobby />;
};

export default Home;
