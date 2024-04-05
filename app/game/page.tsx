"use client";

import Chessboard from "@/components/chessboard";
import type { FC, ReactElement } from "react";
import { useContext } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Loader from "@/components/loader";
import { redirect } from "next/navigation";
import Paper from "@mui/material/Paper";
import Chat from "@/components/chat";
import AuthenticationContext from "@/app/authentication-context";

const Game: FC = (): ReactElement | null => {
  const { isLoading, isAuthenticated } = useContext(AuthenticationContext);

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
          xs={6}
          height="100%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          padding="1rem"
        >
          <Chessboard />
        </Grid>
        <Grid xs={6} height="100%" padding="1rem">
          <Chat />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Game;
