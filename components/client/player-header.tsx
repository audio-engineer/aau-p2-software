"use client";

import Typography from "@mui/material/Typography";
import type {
  MatchId,
  MatchPlayerInfo,
  MatchPlayerRecord,
} from "@/types/database";
import { get } from "firebase/database";
import { getMatchPlayersRef } from "@/firebase/firebase";
import type { FC, ReactElement } from "react";
import { useMatch } from "@/contexts/match";

const getRemotePlayerDisplayNames = async (
  mid: MatchId,
): Promise<{
  readonly playerOne: MatchPlayerInfo;
  readonly playerTwo: MatchPlayerInfo | undefined;
}> => {
  const playerSnapshot = await get(getMatchPlayersRef(mid));

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

const PlayerHeader: FC = (): ReactElement | null => {
  const { mid, player, opponent } = useMatch();

  return (
    <Typography variant="h5" align="center">
      {getPlayerHeader(mid, player, opponent)}
    </Typography>
  );
};

export default PlayerHeader;
