import Chessboard from "@/components/chessboard";
import type { FC, ReactElement } from "react";
import { useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import ChatProvider from "@/components/chat-provider";
import Box from "@mui/material/Box";
import type {
  MatchId,
  MatchPlayerInfo,
  MatchPlayerRecord,
  State,
} from "@/types/database";
import { get, onValue, ref, update } from "firebase/database";
import { database } from "@/firebase/firebase";
import { Chess } from "chess.js";
import type { User } from "@firebase/auth";
import Fen from "chess-fen";
import { getLatestMoveColor, normalizeColor } from "@/utils/utils";
import type { QueryKey } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/loader";
import Typography from "@mui/material/Typography";

interface MatchPageProps {
  readonly user: User;
  readonly mid: MatchId;
}

const initialLegalMoveCount = 0;
const legalMoveCountIncrease = 1;

const getRemotePlayerDisplayNames = async (
  mid: MatchId,
): Promise<{
  readonly playerOne: MatchPlayerInfo;
  readonly playerTwo: MatchPlayerInfo | undefined;
}> => {
  const playerSnapshot = await get(ref(database, `matches/${mid}/players`));

  const matchPlayerRecord = playerSnapshot.val() as MatchPlayerRecord;
  const [playerOneUid, playerTwoUid] = Object.keys(matchPlayerRecord);

  return {
    playerOne: matchPlayerRecord[playerOneUid],
    playerTwo: matchPlayerRecord[playerTwoUid] ?? undefined,
  };
};

const getPlayerHeader = (
  mid: MatchId,
  player: MatchPlayerInfo | null,
  opponent: MatchPlayerInfo | null,
): string => {
  // Viewer
  if (!player && !opponent) {
    getRemotePlayerDisplayNames(mid)
      .then(({ playerOne, playerTwo }) => {
        const playerTwoDisplayName = playerTwo?.displayName ?? "TBA";

        return `${playerOne.displayName} vs. ${playerTwoDisplayName}`;
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  }

  // Player waiting
  if (player && !opponent) {
    return `${player.displayName} vs. TBA`;
  }

  // Player and opponent
  return `${player?.displayName} vs. ${opponent?.displayName}`;
};

const getRemoteFen = async ({
  queryKey,
}: {
  readonly queryKey: QueryKey;
}): Promise<string | false> => {
  // @ts-expect-error It's challenging to define a query key type
  const [, { mid }] = queryKey;

  const snapshot = await get(ref(database, `matches/${mid}/state`));

  if (!snapshot.exists()) {
    return false;
  }

  const match = snapshot.val() as State;

  return match.fen;
};

const updateRemoteState = async (mid: MatchId, fen: string): Promise<void> => {
  await update(ref(database, `matches/${mid}/state`), {
    fen,
  });
};

const MatchPage: FC<MatchPageProps> = ({
  user,
  mid,
}: MatchPageProps): ReactElement | null => {
  const game = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(game.fen());
  const [legalMoveCount, setLegalMoveCount] = useState(initialLegalMoveCount);
  const [player, setPlayer] = useState<MatchPlayerInfo | null>(null);
  const [opponent, setOpponent] = useState<MatchPlayerInfo | null>(null);

  const { isLoading, data: remoteFen } = useQuery({
    queryKey: ["remoteFen", { mid }],
    queryFn: getRemoteFen,
  });

  useEffect(() => {
    if (false === remoteFen || undefined === remoteFen) {
      return;
    }

    setFen(remoteFen);
  }, [remoteFen]);

  useEffect(() => {
    return onValue(ref(database, `matches/${mid}/players`), (matchSnapshot) => {
      if (!matchSnapshot.exists()) {
        return;
      }

      const matchPlayers = matchSnapshot.val() as MatchPlayerRecord;

      const matchPlayerUids = Object.keys(matchPlayers);

      const playerUid = matchPlayerUids.find((uid) => uid === user.uid);

      const opponentUid = matchPlayerUids.find((uid) => uid !== user.uid);

      if (undefined !== playerUid) {
        setPlayer(matchPlayers[playerUid]);
      }

      if (undefined !== playerUid && undefined !== opponentUid) {
        setOpponent(matchPlayers[opponentUid]);
      }
    });
  }, [mid, user.uid]);

  useEffect(() => {
    return onValue(ref(database, `matches/${mid}/state`), (stateSnapshot) => {
      if (!stateSnapshot.exists()) {
        return;
      }

      const state = stateSnapshot.val() as State;

      // The match has been initialized, but no moves have been played yet
      if (false === state.fen) {
        return;
      }

      const { toMove } = new Fen(state.fen);
      const latestMoveColor = getLatestMoveColor(toMove);

      // The client is a player, and the latest move was by the client/player
      if (
        player &&
        normalizeColor(player.color) === normalizeColor(latestMoveColor)
      ) {
        return;
      }

      const gameCopy = new Chess(state.fen);

      // The latest move was by the opponent
      setFen(gameCopy.fen());
    });
  }, [mid, player]);

  const onLegalMoveHandler = (liftedFen: string): void => {
    setFen(liftedFen);
    setLegalMoveCount(legalMoveCount + legalMoveCountIncrease);

    updateRemoteState(mid, liftedFen).catch((error: unknown) => {
      console.error(error);
    });
  };

  if (isLoading) {
    return <Loader />;
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
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h5">
                {getPlayerHeader(mid, player, opponent)}
              </Typography>
            </Box>
            <Chessboard
              fen={fen}
              player={player}
              onLegalMove={onLegalMoveHandler}
            />
          </Box>
        </Grid>
        <Grid xs={12} md={6} height={{ sm: "100%" }} padding={{ md: "1rem" }}>
          <ChatProvider
            fen={fen}
            player={player}
            user={user}
            mid={mid}
            legalMoveCount={legalMoveCount}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MatchPage;
