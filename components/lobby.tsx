import type { FC, ReactElement, ReactNode } from "react";
import { useEffect } from "react";
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
import { useLocalStorage } from "usehooks-ts";
import type { Color } from "chess.js";
import { child, get, ref, set, update } from "firebase/database";
import { database } from "@/firebase/firebase";

interface SnapshotValueType {
  position?: string;
  players: { w?: string; b?: string };
  spectators?: string[];
}

interface Row {
  readonly id: number;
  readonly name: string;
  readonly rating: number;
}

const rows: GridRowsProp<Row> = [
  { id: 1, name: "Martin Kedmenec", rating: 800 },
  { id: 2, name: "Sebastian Mygind", rating: 900 },
  { id: 3, name: "Simon Woidemann", rating: 800 },
  { id: 4, name: "Mads Heilmann", rating: 1000 },
  { id: 5, name: "Kristiyan Georgiev", rating: 700 },
];

const joinLobby = async (
  // Due to eslint not detecting parameters as readonly
  // eslint-disable-next-line
  params: Readonly<GridRenderCellParams>,
  user: User,
): Promise<void> => {
  const { id } = params.row as Row;
  const snapshot = await get(child(ref(database), `games/${id}/state`));
  const color = localStorage.getItem("color");
  const colorValue = color === "w" ? "w" : "b";

  // Handle creating lobbies
  // TODO This should be its own separate button for the future
  if (!snapshot.exists()) {
    console.log(color);
    await set(ref(database, `games/${id}/state`), {
      players: { [colorValue]: user.uid },
    });
    return;
  }

  // Handle joining lobbies as players
  const snapshotValue = snapshot.val() as SnapshotValueType;

  if (snapshotValue.players.b === undefined) {
    await update(ref(database, `games/${id}/state/players`), {
      b: user.uid,
    });
    return;
  }

  if (snapshotValue.players.w === undefined) {
    await update(ref(database, `games/${id}/state/players`), {
      w: user.uid,
    });
    return;
  }

  // Handle joining lobbies as spectators
  if (snapshotValue.spectators === undefined) {
    snapshotValue.spectators = [];
  }

  snapshotValue.spectators.push(user.uid);
  await update(ref(database, `games/${id}/state`), {
    spectators: snapshotValue.spectators,
  });
};

const joinLobbyHandler = (
  // Due to eslint not detecting parameters as readonly
  // eslint-disable-next-line
  params: Readonly<GridRenderCellParams>,
  user: User,
): void => {
  joinLobby(params, user).catch((error: unknown) => {
    console.error(error);
  });
};

const columns = (user: User): GridColDef[] => [
  { field: "name", headerName: "Player", flex: 1 },
  { field: "rating", headerName: "Rating", flex: 0 },
  {
    field: "join",
    headerName: "Join",
    width: 150,
    flex: 0,
    // Due to eslint not detecting parameters as readonly
    // eslint-disable-next-line
    renderCell: (params: Readonly<GridRenderCellParams>): ReactNode => (
      <Button
        onClick={() => {
          joinLobbyHandler(params, user);
        }}
        //href="/game"
      >
        Join
      </Button>
    ),
  },
];

interface LobbyProperties {
  readonly user: User | null;
}

const Lobby: FC<LobbyProperties> = ({
  user,
}: LobbyProperties): ReactElement | null => {
  const [localStorageColor, setLocalStorageColor] = useLocalStorage<Color>(
    "color",
    "w",
  );

  useEffect(() => {
    setLocalStorageColor("w");
  }, [setLocalStorageColor]);

  // SelectChangeEvent couldn't be whitelisted even in eslint.config.js...
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  const handleChange = (event: SelectChangeEvent): void => {
    setLocalStorageColor(event.target.value as Color);
  };

  if (!user) {
    return null;
  }

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "80%",
        width: "50%",
        p: 4,
      }}
    >
      <Typography variant="h4">Welcome back, {user.displayName}!</Typography>
      <FormControl fullWidth sx={{ xs: { flexGrow: 1 } }}>
        <InputLabel id="color-label">Color</InputLabel>
        <Select
          labelId="color-label"
          value={localStorageColor}
          label="Color"
          onChange={handleChange}
        >
          <MenuItem value={"w"}>White</MenuItem>
          <MenuItem value={"b"}>Black</MenuItem>
        </Select>
      </FormControl>
      <Box height="100%" width="100%">
        <DataGrid rows={rows} columns={columns(user)} />
      </Box>
    </Paper>
  );
};

export default Lobby;
