"use client";

import { Chessboard } from "react-chessboard";
import type { FC } from "react";
import Hello from "@/app/hello";

const Home: FC = () => {
  return (
    <main className="flex min-h-screen items-center justify-around">
      <Chessboard id="chessboard" boardWidth={560}
      />
      <Hello text={"World"} age={27} />
    </main>
  );
};

Home.displayName = "Home";

export default Home;
