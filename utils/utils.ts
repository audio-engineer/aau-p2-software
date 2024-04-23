import type { Color } from "chess.js";
import type { MatchPlayerRecord, PlayerNumber } from "@/types/database";

const colorMap: Record<string, string> = {
  b: "black",
  w: "white",
};

export const normalizeColor = (color: Color): string => {
  return colorMap[color] || color;
};

export const getLatestMoveColor = (color: Color): Color => {
  if ("w" === color) {
    return "b";
  }

  return "w";
};

export const findPlayerUidByPlayerNumber = (
  matchPlayerRecord: MatchPlayerRecord,
  playerNumber: PlayerNumber,
): string | undefined => {
  const playerId = Object.keys(matchPlayerRecord).find(
    (id) => matchPlayerRecord[id].playerNumber === playerNumber,
  );

  if (undefined === playerId) {
    return undefined;
  }

  return playerId;
};
