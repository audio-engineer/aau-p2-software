import type { FC, ReactElement } from "react";
import { useEffect, useState } from "react";
import type { Square } from "chess.js";
import { Chess, type Move } from "chess.js";
import { Chessboard } from "react-chessboard";
import { ref, set, onValue } from "firebase/database";
import { database } from "@/firebase/firebase";

const ChessboardGame: FC = (): ReactElement | null => {
  const [game, setGame] = useState<Chess>(new Chess());

  const makeAMove = (move: Readonly<Move> | string): Move | null => {
    const gameCopy = Object.assign(
      Object.create(Object.getPrototypeOf(game) as object),
      game,
    ) as Chess;

    const result = gameCopy.move(move);

    setGame(gameCopy);

    return result;
  };

  const saveState = async (move: Readonly<Move>): Promise<void> => {
    await set(
      ref(database, `games/${process.env.NEXT_PUBLIC_TEST_SESSION_ID}/state`),
      {
        move: move,
        position: game.fen(),
      },
    );
  };

  const onDrop = (sourceSquare: string, targetSquare: string): boolean => {
    const move = makeAMove({
      from: sourceSquare as Square,
      to: targetSquare as Square,
      promotion: "q",
    });

    if (null === move) {
      return false;
    }

    void saveState(move);

    return true;
  };

  interface snapshotData {
    move: Move;
  }

  useEffect(() => {
    onValue(
      ref(database, `games/${process.env.NEXT_PUBLIC_TEST_SESSION_ID}/state`),
      // Due to parameter not being readonly
      // eslint-disable-next-line
      (snapshot) => {
        const data = snapshot.val() as snapshotData | null | undefined;
        if (data !== null && data !== undefined) {
          makeAMove(data.move);
        }
      },
    );
  }, []);

  return (
    <div>
      <Chessboard
        id="chessboard"
        boardWidth={560}
        position={game.fen()}
        onPieceDrop={onDrop}
      />
    </div>
  );
};

export default ChessboardGame;
