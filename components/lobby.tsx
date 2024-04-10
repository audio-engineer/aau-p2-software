import type { FC, ReactElement, ReactNode } from "react";
import { useEffect, useState } from "react";
import type { GridColDef, GridRowsProp } from "@mui/x-data-grid";
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

const rows: GridRowsProp = [
  { id: 1, givenName: "Martin", surname: "Kedmenec", rating: 800 },
  { id: 2, givenName: "Sebastian", surname: "Mygind", rating: 900 },
  { id: 3, givenName: "Simon", surname: "Woidemann", rating: 800 },
  { id: 4, givenName: "Mads", surname: "Heilmann", rating: 1000 },
  { id: 5, givenName: "Kristiyan", surname: "Georgiev", rating: 700 },
];

const columns: GridColDef[] = [
  { field: "givenName", headerName: "Given Name", flex: 1 },
  { field: "surname", headerName: "Surname", flex: 1 },
  { field: "rating", headerName: "Rating", flex: 1 },
  {
    field: "join",
    headerName: "Join",
    width: 150,
    flex: 1,
    renderCell: (): ReactNode => <Button href="/game">Join</Button>,
  },
];

interface LobbyProperties {
  readonly user: User | null;
}

const Lobby: FC<LobbyProperties> = ({
  user,
}: LobbyProperties): ReactElement | null => {
  const [color, setColor] = useState("w");

  useEffect(() => {
    localStorage.setItem("color", color);
  }, [color]);

  // SelectChangeEvent couldn't be whitelisted even in eslint.config.js...
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  const handleChange = (event: SelectChangeEvent): void => {
    setColor(event.target.value);
    localStorage.setItem("color", event.target.value);
  };

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "80%",
        width: "100%",
        p: 4,
      }}
    >
      <Typography variant="h4">Welcome back, {user?.displayName}!</Typography>
      <FormControl fullWidth sx={{ xs: { flexGrow: 1 } }}>
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
      <Box height="100%" width="100%">
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </Paper>
  );
};

export default Lobby;
