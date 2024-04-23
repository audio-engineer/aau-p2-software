"use client";

import type { FC, PropsWithChildren } from "react";
import { useEffect, useMemo, useState } from "react";
import Match from "@/contexts/match";
import { type QueryKey, useQuery } from "@tanstack/react-query";
import { get, onValue } from "firebase/database";
import { getMatchPlayersRef, getMatchStateRef } from "@/firebase/firebase";
import type {
  MatchId,
  MatchPlayerInfo,
  MatchPlayerRecord,
  State,
} from "@/types/database";
import { Chess } from "chess.js";
import { getLatestMoveColor, normalizeColor } from "@/utils/utils";
import { useAuthentication } from "@/contexts/authentication";

interface MatchProviderProps {
  readonly mid: MatchId;
}

const initialLegalMoveCount = 0;
const legalMoveCountIncrease = 1;

const getRemoteFen = async ({
  queryKey,
}: {
  readonly queryKey: QueryKey;
}): Promise<string | false> => {
  // @ts-expect-error It's challenging to define a query key type
  const [, { mid }] = queryKey;

  const snapshot = await get(getMatchStateRef(mid as MatchId));

  if (!snapshot.exists()) {
    return false;
  }

  const match = snapshot.val() as State;

  return match.fen;
};

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const MatchProvider: FC<PropsWithChildren<MatchProviderProps>> = ({
  mid,
  children,
}: PropsWithChildren<MatchProviderProps>) => {
  const { isUserLoading, user } = useAuthentication();

  const game = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(game.fen());
  const [legalMoveCount, setLegalMoveCount] = useState(initialLegalMoveCount);
  const [player, setPlayer] = useState<MatchPlayerInfo | null>(null);
  const [opponent, setOpponent] = useState<MatchPlayerInfo | null>(null);

  const { isLoading: isRemoteFenLoading, data: remoteFen } = useQuery({
    queryKey: ["remoteFen", { mid }],
    queryFn: getRemoteFen,
  });

  const value = useMemo(
    () => ({
      mid,
      player,
      opponent,
      fen,
      isRemoteFenLoading,
      setFen,
      legalMoveCount,
      setLegalMoveCount,
      legalMoveCountIncrease,
    }),
    [fen, isRemoteFenLoading, legalMoveCount, mid, opponent, player],
  );

  useEffect(() => {
    if (false === remoteFen || undefined === remoteFen) {
      return;
    }

    setFen(remoteFen);
  }, [remoteFen]);

  useEffect(() => {
    return onValue(getMatchPlayersRef(mid), (matchSnapshot) => {
      if (!matchSnapshot.exists()) {
        return;
      }

      const matchPlayers = matchSnapshot.val() as MatchPlayerRecord;

      const matchPlayerUids = Object.keys(matchPlayers);

      const playerUid = matchPlayerUids.find((uid) => uid === user?.uid);

      const opponentUid = matchPlayerUids.find((uid) => uid !== user?.uid);

      if (undefined !== playerUid) {
        setPlayer(matchPlayers[playerUid]);
      }

      if (undefined !== playerUid && undefined !== opponentUid) {
        setOpponent(matchPlayers[opponentUid]);
      }
    });
  }, [mid, user?.uid]);

  useEffect(() => {
    return onValue(getMatchStateRef(mid), (stateSnapshot) => {
      if (!stateSnapshot.exists()) {
        return;
      }

      const state = stateSnapshot.val() as State;

      // The match has been initialized, but no moves have been played yet
      if (false === state.fen) {
        return;
      }

      const gameCopy = new Chess(state.fen);

      const latestMoveColor = getLatestMoveColor(gameCopy.turn());

      // The client is a player, and the latest move was by the client/player
      if (
        player &&
        normalizeColor(player.color) === normalizeColor(latestMoveColor)
      ) {
        return;
      }

      // The latest move was by the opponent
      setFen(gameCopy.fen());
    });
  }, [mid, player]);

  if (isUserLoading) {
    return null;
  }

  return <Match.Provider value={value}>{children}</Match.Provider>;
};

export default MatchProvider;
