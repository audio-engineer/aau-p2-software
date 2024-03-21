"use client";

import ChessboardGame from "@/components/chessboard-game";
import type { ChangeEvent, FC, KeyboardEvent, ReactElement } from "react";
import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import type { StockfishResponse } from "@/app/api/stockfish/route";
import { ref, set } from "firebase/database";
import { database } from "@/firebase/firebase";

const StockfishResponseWindow = ({
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

const Home: FC = (): ReactElement | null => {
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
      ref(database, `messages/${process.env.NEXT_PUBLIC_TEST_SESSION_ID}`),
      {
        message: input,
      },
    );

    await fetchData();
  };

  return (
    <main className="flex min-h-screen items-center justify-around">
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ChessTeacher
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
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

export default Home;
