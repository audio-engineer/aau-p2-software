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
import Box from "@mui/material/Box";
import type { MatchId } from "@/types/database";

interface MatchProps {
  readonly params: {
    readonly mid: MatchId;
  };
}

const initialLegalMoveCount = 0;
const legalMoveCountIncrease = 1;

const Match: FC<MatchProps> = ({ params }: MatchProps): ReactElement | null => {
  const { isLoading, user } = useContext(AuthenticationContext);
  const [fen, setFen] = useState("");
  const [legalMoveCount, setLegalMoveCount] = useState(initialLegalMoveCount);

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    redirect("/");
  }

  return (
    <Paper sx={{ display: "flex", height: "80%", width: "100%", p: { md: 4 } }}>
      <Grid container width="100%" height="100%">
        <Grid
          xs={12}
          md={6}
          height={{ sm: "100%" }}
          padding={{ md: "1rem" }}
          spacing={{ xs: 2 }}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box
            px={{ xs: "1rem", sm: "2rem", md: "1rem", xl: "4rem" }}
            flexGrow={{ xs: 1 }}
            display="flex"
            alignItems="center"
          >
            <Chessboard
              onLegalMove={(liftedFen: string) => {
                setFen(liftedFen);
                setLegalMoveCount(legalMoveCount + legalMoveCountIncrease);
              }}
              mid={params.mid}
              user={user}
            />
          </Box>
        </Grid>
        <Grid xs={12} md={6} height={{ sm: "100%" }} padding={{ md: "1rem" }}>
          <ChatProvider
            fen={fen}
            user={user}
            mid={params.mid}
            legalMoveCount={legalMoveCount}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Match;
