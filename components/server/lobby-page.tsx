import type { FC, ReactElement } from "react";
import Paper from "@mui/material/Paper";
import LobbyHeader from "@/components/client/lobby-header";
import LobbyGrid from "@/components/client/lobby-grid";

const LobbyPage: FC = (): ReactElement | null => {
  return (
    <>
      <Paper
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          height: { xs: "136px", md: "6rem" },
          p: { sm: 2 },
          mb: 2,
        }}
      >
        <LobbyHeader />
      </Paper>
      <LobbyGrid />
    </>
  );
};

export default LobbyPage;
