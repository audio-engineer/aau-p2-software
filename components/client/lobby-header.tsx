"use client";

import type { FC, ReactElement } from "react";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import type { Color } from "chess.js";
import type { User } from "firebase/auth";
import { push } from "firebase/database";
import { getMatchesRef } from "@/firebase/firebase";
import type { Match } from "@/types/database";
import { useAuthentication } from "@/contexts/authentication";
import Loader from "@/components/client/loader";

const createNewMatch = async (user: User, color: Color): Promise<void> => {
  await push(getMatchesRef(), {
    state: {
      fen: false,
    },
    players: {
      [user.uid]: {
        displayName: user.displayName,
        color,
        playerNumber: 1,
      },
    },
  } satisfies Match);
};

const LobbyHeader: FC = (): ReactElement | null => {
  const { isUserLoading, user } = useAuthentication();

  const [color, setColor] = useState<Color>("w");

  const createNewMatchHandler = (): void => {
    if (!user) {
      return;
    }

    createNewMatch(user, color).catch((error: unknown) => {
      console.error(error);
    });
  };

  // SelectChangeEvent couldn't be whitelisted even in eslint.config.js...
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  const colorSelectionHandler = (event: SelectChangeEvent): void => {
    setColor(event.target.value as Color);
  };

  if (isUserLoading) {
    return <Loader />;
  }

  return (
    <Box
      height="100%"
      width="100%"
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      justifyContent={{ xs: "center", sm: "space-between" }}
      alignItems="center"
    >
      <Typography
        variant="h5"
        display={{ xs: "initial", md: "none" }}
        marginBottom={{ xs: "1rem", sm: 0 }}
      >
        Welcome back, {user?.displayName}!
      </Typography>
      <Typography variant="h4" display={{ xs: "none", md: "initial" }}>
        Welcome back, {user?.displayName}!
      </Typography>
      <Box display="flex">
        <FormControl sx={{ marginRight: "1rem" }}>
          <InputLabel id="color-label">Color</InputLabel>
          <Select
            labelId="color-label"
            value={color}
            label="Color"
            onChange={colorSelectionHandler}
          >
            <MenuItem value={"w"}>White</MenuItem>
            <MenuItem value={"b"}>Black</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="success"
          onClick={createNewMatchHandler}
        >
          Create New Match
        </Button>
      </Box>
    </Box>
  );
};

export default LobbyHeader;
