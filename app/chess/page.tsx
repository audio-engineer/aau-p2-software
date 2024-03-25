"use client";

import ChessboardGame from "@/components/chessboard-game";
import type { ChangeEvent, FC, KeyboardEvent, ReactElement } from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import type { StockfishResponse } from "@/app/api/stockfish/route";
import { ref, set } from "firebase/database";
import { auth, database } from "@/firebase/firebase";
import { redirect } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

const StockfishResponseWindow: FC = ({
  isLoading,
  stockfishResponse,
}: {
  readonly isLoading: boolean;
  readonly stockfishResponse: string;
}): ReactElement | null => {
  if (isLoading) {
    return <CircularProgress sx={{ alignSelf: "center", margin: "auto" }} />;
  }

  return <>{stockfishResponse}</>;
};

const Chess: FC = (): ReactElement | null => {
  const [user] = useAuthState(auth);
  if (!user) {
    redirect("/");
  }

  const [isLoading, setIsLoading] = useState(false);
  const [stockfishResponse, setStockfishResponse] = useState(
    "Hello, this is Stockfish. Type a valid UCI command and press Enter.",
  );
  const [input, setInput] = useState("");

  const fetchData = async (): Promise<void> => {
    setIsLoading(true);

    const response = await fetch("/api/stockfish");

    const responseJson = (await response.json()) as StockfishResponse;

    setStockfishResponse(JSON.stringify(responseJson.data["best-move"]));

    setIsLoading(false);
  };

  const onChangeHandler = (
    // Due to `event` not being readonly
    // eslint-disable-next-line
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setInput(event.target.value);
  };

  // Due to `event` not being readonly and function returning a promise
  // eslint-disable-next-line
  const onKeyUpHandler = async (event: KeyboardEvent<HTMLImageElement>) => {
    if ("Enter" !== event.key) {
      return;
    }

    setInput("");

    await set(
      ref(database, `games/${process.env.NEXT_PUBLIC_TEST_SESSION_ID}/chat`),
      {
        message: input,
      },
    );

    await fetchData();
  };

  return (
    <main className="flex min-h-screen items-center justify-around">
      <Container>
        <Grid container>
          <Grid xs={6}>
            <ChessboardGame />
          </Grid>
          <Grid xs={6}>
            <Box display="flex" flexDirection="column" sx={{ height: "100%" }}>
              <Paper
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  m: 1,
                  p: 1,
                }}
              >
                <StockfishResponseWindow
                  isLoading={isLoading}
                  stockfishResponse={stockfishResponse}
                />
              </Paper>
              <Paper sx={{ m: 1, p: 1 }}>
                <TextField
                  fullWidth
                  align-self="flex-end"
                  placeholder="Say something to Stockfish"
                  value={input}
                  onChange={onChangeHandler}
                  // Due to `onKeyUpHandler` returning a promise
                  // eslint-disable-next-line
                  onKeyUp={onKeyUpHandler}
                  style={{ color: "black" }}
                />
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
};

export default Chess;
