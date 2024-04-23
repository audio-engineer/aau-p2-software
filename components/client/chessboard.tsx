"use client";

import type { FC, ReactElement } from "react";
import { useMemo } from "react";
import type { Move, Square } from "chess.js";
import { Chess } from "chess.js";
import { Chessboard as ReactChessboard } from "react-chessboard";
import { useMatch } from "@/contexts/match";
import Loader from "@/components/client/loader";
import type { MatchId } from "@/types/database";
import { update } from "firebase/database";
import { getMatchStateRef } from "@/firebase/firebase";

const updateRemoteState = async (mid: MatchId, fen: string): Promise<void> => {
  await update(getMatchStateRef(mid), {
    fen,
  });
};

const Chessboard: FC = (): ReactElement | null => {
  const {
    mid,
    fen,
    setFen,
    player,
    legalMoveCount,
    setLegalMoveCount,
    legalMoveCountIncrease,
    isRemoteFenLoading,
  } = useMatch();

  const makeAMove = (move: Readonly<Move>): Move | null => {
    if (!player) {
      return null;
    }

    const gameCopy = new Chess(fen);

    const result = gameCopy.move(move);

    if (!result || player.color !== result.color) {
      return null;
    }

    const newFen = gameCopy.fen();

    setFen(newFen);
    setLegalMoveCount(legalMoveCount + legalMoveCountIncrease);
    updateRemoteState(mid, newFen).catch((error: unknown) => {
      console.error(error);
    });

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

  if (isRemoteFenLoading) {
    return <Loader />;
  }

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
