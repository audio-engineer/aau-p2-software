import type { FC, ReactElement } from "react";
import { useCallback, useEffect, useState } from "react";
import type { Move, Square } from "chess.js";
import { Chess } from "chess.js";
import { Chessboard as ReactChessboard } from "react-chessboard";
import { onValue, ref, set } from "firebase/database";
import { database } from "@/firebase/firebase";

interface StateSnapshot {
  move: Move;
}

interface ChessboardProps {
  readonly onLegalMove: (fen: string) => void;
}

const Chessboard: FC<ChessboardProps> = ({
  onLegalMove,
}: ChessboardProps): ReactElement | null => {
  const [game, setGame] = useState<Chess>(new Chess());

  const makeAMove = useCallback(
    (
      move: Readonly<Move> | string,
    ): { result: Move | null; gameCopy: Chess } => {
      const gameCopy = Object.assign(
        Object.create(Object.getPrototypeOf(game) as object),
        game,
      ) as Chess;

      return { result: gameCopy.move(move), gameCopy };
    },
    [game],
  );

  // TODO Figure out how to send FEN to realtime database async
  const saveState = async (move: Readonly<Move>): Promise<void> => {
    await set(
      ref(database, `games/${process.env.NEXT_PUBLIC_TEST_SESSION_ID}/state`),
      {
        move,
        position: game.fen(),
      },
    );
  };

  const onPieceDrop = (sourceSquare: string, targetSquare: string): boolean => {
    const { result, gameCopy } = makeAMove({
      from: sourceSquare as Square,
      to: targetSquare as Square,
      promotion: "q",
    });

    if (!result) {
      return false;
    }

    setGame(gameCopy);
    void saveState(result);
    onLegalMove(game.fen());

    return true;
  };

  useEffect(() => {
    return onValue(
      ref(database, `games/${process.env.NEXT_PUBLIC_TEST_SESSION_ID}/state`),
      (snapshot) => {
        if (!snapshot.exists()) {
          return;
        }

        const stateSnapshot = snapshot.val() as StateSnapshot;

        const { gameCopy } = makeAMove(stateSnapshot.move);

        setGame(gameCopy);
        // TODO Check if onLegalMove needs to be called here
        // onLegalMove(game.fen());
      },
    );
  }, [game, makeAMove, onLegalMove]);

  return (
    <ReactChessboard
      id="chessboard"
      position={game.fen()}
      onPieceDrop={onPieceDrop}
      boardOrientation="white"
    />
  );
};

export default Chessboard;
