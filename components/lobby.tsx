import type { FC, ReactElement, ReactNode } from "react";
import type { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

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
    renderCell: (): ReactNode => {
      return <Button>Join</Button>;
    },
  },
];

const Lobby: FC = (): ReactElement | null => {
  return (
    <Paper sx={{ display: "flex", height: "80%", width: "100%", p: 4 }}>
      <Box sx={{ height: "100%", width: "100%" }}>
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </Paper>
  );
};

export default Lobby;
