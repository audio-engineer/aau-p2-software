import type { FC, ReactElement } from "react";
import { useEffect, useMemo, useState } from "react";
import type { Move, Square } from "chess.js";
import { Chess } from "chess.js";
import { Chessboard as ReactChessboard } from "react-chessboard";
import { onValue, ref, set } from "firebase/database";
import { database } from "@/firebase/firebase";

interface StateSnapshot {
  readonly move: Move;
  readonly fen: string;
}

interface ChessboardProps {
  readonly color: string;
  readonly onLegalMove: (fen: string) => void;
}

const saveState = async (move: Readonly<Move>, fen: string): Promise<void> => {
  await set(
    ref(database, `games/${process.env.NEXT_PUBLIC_TEST_SESSION_ID}/state`),
    {
      move,
      fen,
    },
  );
};

const Chessboard: FC<ChessboardProps> = ({
  color,
  onLegalMove,
}: ChessboardProps): ReactElement | null => {
  const [game, setGame] = useState<{ chess: Chess; move: Move | undefined }>({
    chess: new Chess(),
    move: undefined,
  });

  const makeAMove = (move: Readonly<Move>): Move | null => {
    const gameCopy = new Chess(game.chess.fen());

    const result = gameCopy.move(move);

    if (!result || color !== result.color) {
      return null;
    }

    setGame({ chess: gameCopy, move: result });
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

  useEffect(() => {
    if (undefined === game.move) {
      return;
    }

    saveState(game.move, game.chess.fen()).catch((error: unknown) => {
      console.error(error);
    });
  }, [game]);

  useEffect(() => {
    return onValue(
      ref(database, `games/${process.env.NEXT_PUBLIC_TEST_SESSION_ID}/state`),
      (snapshot) => {
        if (!snapshot.exists()) {
          return;
        }

        const stateSnapshot = snapshot.val() as StateSnapshot;

        if (color === stateSnapshot.move.color) {
          return;
        }

        const gameCopy = new Chess(stateSnapshot.fen);
        gameCopy.move(stateSnapshot.move);
        setGame({ chess: gameCopy, move: stateSnapshot.move });
      },
    );
  }, [color]);

  const boardOrientation = useMemo(() => {
    if ("w" === color) {
      return "white";
    }

    return "black";
  }, [color]);

  return (
    <ReactChessboard
      id="chessboard"
      position={game.chess.fen()}
      onPieceDrop={onPieceDrop}
      boardOrientation={boardOrientation}
    />
  );
};

export default Chessboard;
