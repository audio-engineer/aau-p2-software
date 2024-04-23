import type { FC, ReactElement } from "react";
import HomePage from "@/components/server/home-page";
import LobbyPage from "@/components/server/lobby-page";
import { verifySession } from "@/utils/server-actions";

const Home: FC = async (): Promise<ReactElement | null> => {
  const session = await verifySession();

  if (!session) {
    return <HomePage />;
  }

  return <LobbyPage />;
};

export default Home;
