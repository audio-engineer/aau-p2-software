import type { Color as ChessFenColor } from "chess-fen";
import type { Color as ChessJsColor } from "chess.js";
import type { MatchPlayerRecord, PlayerNumber } from "@/types/database";

const colorMap: Record<string, string> = {
  b: "black",
  w: "white",
};

export const normalizeColor = (color: ChessFenColor | ChessJsColor): string => {
  return colorMap[color] || color;
};

export const getLatestMoveColor = (color: ChessFenColor): ChessFenColor => {
  if ("white" === color) {
    return "black";
  }

  return "white";
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
