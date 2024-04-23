"use client";

import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext } from "react";
import type { MatchId, MatchPlayerInfo } from "@/types/database";

interface MatchContextProps {
  readonly mid: MatchId;
  readonly player: MatchPlayerInfo | null;
  readonly opponent: MatchPlayerInfo | null;
  readonly fen: string;
  readonly isRemoteFenLoading: boolean;
  readonly setFen: Dispatch<SetStateAction<string>>;
  readonly legalMoveCount: number;
  readonly setLegalMoveCount: Dispatch<SetStateAction<number>>;
  readonly legalMoveCountIncrease: number;
}

const Match = createContext<MatchContextProps | null>(null);

export const useMatch = (): MatchContextProps => {
  const matchContext = useContext(Match);

  if (!matchContext) {
    throw new Error("useMatch has to be used within <Match.Provider>");
  }

  return matchContext;
};

export default Match;
