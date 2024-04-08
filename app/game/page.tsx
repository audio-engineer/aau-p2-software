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
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import type { SelectChangeEvent } from "@mui/material/Select";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const initialLegalMoveCount = 0;
const legalMoveCountIncrease = 1;

const Game: FC = (): ReactElement | null => {
  const { isLoading, isAuthenticated } = useContext(AuthenticationContext);
  const [fen, setFen] = useState("");
  const [legalMoveCount, setLegalMoveCount] = useState(initialLegalMoveCount);
  const [color, setColor] = useState("w");

  // SelectChangeEvent couldn't be whitelisted even in eslint.config.js...
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  const handleChange = (event: SelectChangeEvent): void => {
    setColor(event.target.value);
  };

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
          md={6}
          height="100%"
          display="flex"
          flexDirection="column"
          padding={{ md: "1rem" }}
        >
          {/* TODO Start remove after testing */}
          <FormControl fullWidth>
            <InputLabel id="color-label">Color</InputLabel>
            <Select
              labelId="color-label"
              value={color}
              label="Color"
              onChange={handleChange}
            >
              <MenuItem value={"w"}>White</MenuItem>
              <MenuItem value={"b"}>Black</MenuItem>
            </Select>
          </FormControl>
          {/* TODO End remove after testing */}
          <Chessboard
            onLegalMove={(liftedFen: string) => {
              setFen(liftedFen);
              setLegalMoveCount(legalMoveCount + legalMoveCountIncrease);
            }}
            color={color}
          />
        </Grid>
        <Grid md={6} height="100%" padding={{ md: "1rem" }}>
          <ChatProvider fen={fen} legalMoveCount={legalMoveCount} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Game;
