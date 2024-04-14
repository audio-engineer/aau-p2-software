"use client";

import type { FC, ReactElement } from "react";
import { useContext } from "react";
import Lobby from "@/components/lobby";
import HomePage from "@/components/home-page";
import Loader from "@/components/loader";
import AuthenticationContext from "@/app/authentication-context";

const Home: FC = (): ReactElement | null => {
  const { isLoading, user } = useContext(AuthenticationContext);

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return <HomePage />;
  }

  return <Lobby user={user} />;
};

export default Home;
