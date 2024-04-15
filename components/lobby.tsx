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
import type { DataSnapshot } from "firebase/database";
import { onChildChanged, onValue, push, ref, set } from "firebase/database";
import { database } from "@/firebase/firebase";
import type {
  Match,
  MatchId,
  MatchPlayerInfo,
  MatchRecord,
} from "@/types/database";
import { PlayerNumber } from "@/types/database";
import { toast } from "react-toastify";
import { findPlayerUidByPlayerNumber } from "@/utils/utils";

type MatchRowPlayerData = MatchPlayerInfo & {
  readonly displayName: User["displayName"];
};

interface MatchRowModel {
  readonly id: MatchId;
  readonly playerOne: MatchRowPlayerData | undefined;
  readonly playerTwo: MatchRowPlayerData | undefined;
}

interface LobbyProperties {
  readonly user: User;
}

const getMatchRowPlayerData = (
  matchRecord: MatchRecord,
  key: string,
  uid: User["uid"] | undefined,
): MatchRowPlayerData | undefined => {
  if (undefined === uid) {
    return undefined;
  }

  const player = matchRecord[key].players[uid];

  return {
    displayName: player.displayName,
    color: player.color,
    playerNumber: player.playerNumber,
  };
};

const getMatchRowModelArray = (matchRecord: MatchRecord): MatchRowModel[] => {
  return Object.keys(matchRecord).map((key) => {
    const matchPlayerRecord = matchRecord[key].players;

    const playerOneUid = findPlayerUidByPlayerNumber(
      matchPlayerRecord,
      PlayerNumber.playerOne,
    );
    const playerTwoUid = findPlayerUidByPlayerNumber(
      matchPlayerRecord,
      PlayerNumber.playerTwo,
    );

    return {
      id: key,
      playerOne: getMatchRowPlayerData(matchRecord, key, playerOneUid),
      playerTwo: getMatchRowPlayerData(matchRecord, key, playerTwoUid),
    };
  });
};

const joinMatch = async (
  params: GridRenderCellParams<MatchRowModel>,
  user: User,
): Promise<void> => {
  let color = "w";

  if ("w" === params.row.playerOne?.color) {
    color = "b";
  }

  await set(ref(database, `matches/${params.row.id}/players/${user.uid}`), {
    color,
    displayName: user.displayName,
    playerNumber: 2,
  });
};

const createNewMatch = async (user: User, color: Color): Promise<void> => {
  await push(ref(database, "matches"), {
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

const joinMatchHandler = (
  params: GridRenderCellParams<MatchRowModel>,
  user: User,
): void => {
  joinMatch(params, user).catch((error: unknown) => {
    console.error(error);
  });
};

const displayToast = (matchSnapshot: DataSnapshot, uid: User["uid"]): void => {
  const match = matchSnapshot.val() as Match;

  if (!Object.keys(match.players).includes(uid)) {
    return;
  }

  const opponentUid = Object.keys(match.players).find((id) => id !== uid);

  if (undefined === opponentUid) {
    return;
  }

  if (PlayerNumber.playerTwo !== match.players[opponentUid].playerNumber) {
    return;
  }

  const opponentDisplayName = match.players[opponentUid].displayName ?? "";

  toast(
    `♟️ Player ${opponentDisplayName} joined your match ${matchSnapshot.key}!`,
  );
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
    flex: 1,
    renderCell: (params: GridRenderCellParams<MatchRowModel>): ReactNode => {
      if (
        undefined === params.row.playerTwo &&
        user.displayName !== params.row.playerOne?.displayName
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
    return onChildChanged(ref(database, `matches`), (matchSnapshot) => {
      if (!matchSnapshot.exists()) {
        return;
      }

      displayToast(matchSnapshot, user.uid);
    });
  }, [user.uid]);

  const rows: GridRowsProp = useMemo(() => {
    if (!matches) {
      return [];
    }

    return getMatchRowModelArray(matches);
  }, [matches]);

  const createNewMatchHandler = (): void => {
    createNewMatch(user, color).catch((error: unknown) => {
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
