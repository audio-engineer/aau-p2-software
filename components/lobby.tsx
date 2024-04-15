import type { FC, ReactElement, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import type {
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
} from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { User } from "@firebase/auth";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import type { Color } from "chess.js";
import { onValue, push, ref, set } from "firebase/database";
import { database } from "@/firebase/firebase";
import type {
  ActiveUserRecord,
  BaseActiveUser,
  BasePlayerMatchInfo,
  MatchId,
  MatchRecord,
  PlayerMatchInfo,
} from "@/types/database";

type MatchRowPlayerData = PlayerMatchInfo & {
  readonly displayName: User["displayName"];
};

interface MatchRowModel {
  readonly id: MatchId;
  readonly playerOne: MatchRowPlayerData;
  readonly playerTwo: MatchRowPlayerData | undefined;
}

interface LobbyProperties {
  readonly user: User;
}

const joinMatch = async (
  params: GridRenderCellParams<MatchRowModel>,
  user: User,
): Promise<void> => {
  let color = "w";

  if ("w" === params.row.playerOne.color) {
    color = "b";
  }

  await set(ref(database, `matches/${params.row.id}/players/${user.uid}`), {
    color,
    playerTwo: true,
  });
};

const createNewMatch = async (
  uid: keyof ActiveUserRecord,
  color: Color,
): Promise<void> => {
  await push(ref(database, "matches"), {
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    latestMove: { from: true, to: true, color: true },
    players: {
      [uid]: {
        color,
        playerOne: true,
      },
    },
  });
};

const joinMatchHandler = (
  params: GridRenderCellParams<MatchRowModel>,
  user: User,
): void => {
  joinMatch(params, user).catch((error: unknown) => {
    console.error(error);
  });
};

const columns = (user: User): GridColDef[] => [
  { field: "id", headerName: "Match ID", flex: 1 },
  {
    field: "playerOne",
    headerName: "Player 1",
    flex: 1,
    valueGetter: (value: MatchRowPlayerData): string => {
      return `${value.displayName} (${value.color})`;
    },
  },
  {
    field: "playerTwo",
    headerName: "Player 2",
    flex: 1,
    valueGetter: (value: MatchRowPlayerData | undefined): string => {
      if (!value) {
        return "-";
      }

      return `${value.displayName} (${value.color})`;
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
    flex: 0,
    renderCell: (params: GridRenderCellParams<MatchRowModel>): ReactNode => {
      if (
        undefined === params.row.playerTwo &&
        user.displayName !== params.row.playerOne.displayName
      ) {
        return (
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              joinMatchHandler(params, user);
            }}
          >
            Join
          </Button>
        );
      }

      return (
        <Button variant="contained" href={`/match/${params.row.id}`}>
          View
        </Button>
      );
    },
  },
];

const Lobby: FC<LobbyProperties> = ({
  user,
}: LobbyProperties): ReactElement | null => {
  const [color, setColor] = useState<Color>("w");
  const [activeUsers, setActiveUsers] = useState<ActiveUserRecord>();
  const [matches, setMatches] = useState<MatchRecord>();

  useEffect(() => {
    return onValue(ref(database, "matches"), (matchesSnapshot) => {
      if (!matchesSnapshot.exists()) {
        return;
      }

      setMatches(matchesSnapshot.val() as MatchRecord);
    });
  }, []);

  useEffect(() => {
    return onValue(ref(database, "activeUsers"), (activeUsersSnapshot) => {
      if (!activeUsersSnapshot.exists()) {
        return;
      }

      setActiveUsers(activeUsersSnapshot.val() as ActiveUserRecord);
    });
  }, []);

  const rows: GridRowsProp = useMemo(() => {
    if (!activeUsers || !matches) {
      return [];
    }

    const getPlayer = (
      key: string,
      uid: User["uid"],
    ): (BaseActiveUser & BasePlayerMatchInfo) | undefined => {
      if (!uid) {
        return undefined;
      }

      return {
        displayName: activeUsers[uid].displayName,
        color: matches[key].players[uid].color,
      };
    };

    return Object.keys(matches).map((key) => {
      const [playerOneUid, playerTwoUid] = Object.keys(matches[key].players);

      return {
        id: key,
        playerOne: getPlayer(key, playerOneUid),
        playerTwo: getPlayer(key, playerTwoUid),
      };
    });
  }, [activeUsers, matches]);

  const createNewMatchHandler = (): void => {
    createNewMatch(user.uid, color).catch((error: unknown) => {
      console.error(error);
    });
  };

  // SelectChangeEvent couldn't be whitelisted even in eslint.config.js...
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  const colorSelectionHandler = (event: SelectChangeEvent): void => {
    setColor(event.target.value as Color);
  };

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "80%",
        width: "70%",
        p: 4,
      }}
    >
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4">Welcome back, {user.displayName}!</Typography>
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
      <Box height="80%" width="100%">
        <DataGrid
          rows={rows}
          columns={columns(user)}
          disableRowSelectionOnClick
        />
      </Box>
    </Paper>
  );
};

export default Lobby;
