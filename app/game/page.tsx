"use client";

import Chessboard from "@/components/chessboard";
import type { FC, ReactElement } from "react";
import { useContext, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Loader from "@/components/loader";
import { redirect } from "next/navigation";
import Paper from "@mui/material/Paper";
import ChatProvider from "@/components/chat-provider";
import AuthenticationContext from "@/app/authentication-context";

const initialLegalMoveCount = 0;
const legalMoveCountIncrease = 1;

const Game: FC = (): ReactElement | null => {
  const { isLoading, isAuthenticated } = useContext(AuthenticationContext);
  const [fen, setFen] = useState("");
  const [legalMoveCount, setLegalMoveCount] = useState(initialLegalMoveCount);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    redirect("/");
  }

  return (
    <Paper sx={{ display: "flex", height: "80%", width: "100%", p: 4 }}>
      <Grid container width="100%">
        <Grid
          xs={12}
          sm={6}
          height="100%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          padding="1rem"
        >
          <Chessboard
            onLegalMove={(liftedFen: string) => {
              setFen(liftedFen);
              setLegalMoveCount(legalMoveCount + legalMoveCountIncrease);
            }}
          />
        </Grid>
        <Grid xs={12} sm={6} height="100%" padding={{ md: "1rem" }}>
          <ChatProvider fen={fen} legalMoveCount={legalMoveCount} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Game;
