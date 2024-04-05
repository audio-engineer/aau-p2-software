import type { FC, ReactElement } from "react";
import { useEffect, useState } from "react";
import type { Square } from "chess.js";
import { Chess, type Move } from "chess.js";
import { Chessboard as ReactChessboard } from "react-chessboard";
import { onValue, ref, set } from "firebase/database";
import { database } from "@/firebase/firebase";
import type { StockfishMessageResponse } from "@/app/api/stockfish/route";

const Chessboard: FC = (): ReactElement | null => {
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
    const response = await fetch("/api/stockfish", {
      method: "POST",
      body: JSON.stringify({ fen: game.fen() }),
    });

    const responseJson = (await response.json()) as StockfishMessageResponse;

    await set(
      ref(database, `games/${process.env.NEXT_PUBLIC_TEST_SESSION_ID}/state`),
      {
        move: move,
        position: game.fen(),
      },
    );

    await set(
      ref(database, `games/${process.env.NEXT_PUBLIC_TEST_SESSION_ID}/chat`),
      {
        stockfish: responseJson.message,
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
        if (null !== data && data !== undefined) {
          makeAMove(data.move);
        }
      },
    );
  }, []);

  return (
    <ReactChessboard
      id="chessboard"
      position={game.fen()}
      onPieceDrop={onDrop}
    />
  );
};

export default Chessboard;
