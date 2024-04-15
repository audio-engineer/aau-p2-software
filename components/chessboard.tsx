import type { FC, ReactElement } from "react";
import { useMemo } from "react";
import type { Move, Square } from "chess.js";
import { Chess } from "chess.js";
import { Chessboard as ReactChessboard } from "react-chessboard";
import type { MatchPlayerInfo } from "@/types/database";

interface ChessboardProps {
  readonly fen: string;
  readonly player: MatchPlayerInfo | null;
  readonly onLegalMove: (fen: string) => void;
}

const Chessboard: FC<ChessboardProps> = ({
  fen,
  player,
  onLegalMove,
}: ChessboardProps): ReactElement | null => {
  const makeAMove = (move: Readonly<Move>): Move | null => {
    if (!player) {
      return null;
    }

    const gameCopy = new Chess(fen);

    const result = gameCopy.move(move);

    if (!result || player.color !== result.color) {
      return null;
    }

    onLegalMove(gameCopy.fen());

    return result;
  };

  const onPieceDrop = (sourceSquare: string, targetSquare: string): boolean => {
    const result = makeAMove({
      from: sourceSquare as Square,
      to: targetSquare as Square,
      promotion: "q",
    });

    return null !== result;
  };

  const boardOrientation = useMemo(() => {
    if (!player || "w" === player.color) {
      return "white";
    }

    return "black";
  }, [player]);

  return (
    <ReactChessboard
      id="chessboard"
      position={fen}
      onPieceDrop={onPieceDrop}
      boardOrientation={boardOrientation}
    />
  );
};

export default Chessboard;
