import type { FC, ReactElement } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import PlayerHeader from "@/components/client/player-header";
import Chessboard from "@/components/client/chessboard";
import ChatProvider from "@/components/client/chat-provider";

const MatchPage: FC = (): ReactElement | null => {
  return (
    <Grid container width="100%" height="100%" spacing={{ xs: 1, md: 3 }}>
      <Grid
        xs={12}
        sm={6}
        lg={8}
        height={{ md: "100%" }}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Paper
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: { xs: "50px" },
            width: "100%",
            mb: "1rem",
          }}
        >
          <PlayerHeader />
        </Paper>
        <Box display="flex" width="100%" height="100%" px={{ xs: 0 }}>
          <Chessboard />
        </Box>
      </Grid>
      <Grid
        xs={12}
        sm={6}
        lg={4}
        height={{ sm: "420px", md: "550px", lg: "810px" }}
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <Paper sx={{ height: "100%", p: 2 }}>
          <ChatProvider />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default MatchPage;
