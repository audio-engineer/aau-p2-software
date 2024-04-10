import type { FC, ReactElement } from "react";
import { useEffect, useMemo, useState } from "react";
import type { Move, Square } from "chess.js";
import { Chess } from "chess.js";
import { Chessboard as ReactChessboard } from "react-chessboard";
import { get, onValue, ref, set } from "firebase/database";
import { database } from "@/firebase/firebase";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/loader";
import { redirect } from "next/navigation";

interface StateSnapshot {
  readonly move: Move;
  readonly fen: string;
}

interface ChessboardProps {
  readonly onLegalMove: (fen: string) => void;
}

const getRemoteState = async (): Promise<string | null> => {
  const snapshot = await get(
    ref(database, `games/${process.env.NEXT_PUBLIC_TEST_SESSION_ID}/state`),
  );

  if (!snapshot.exists()) {
    return null;
  }

  const stateSnapshot = snapshot.val() as StateSnapshot;

  return stateSnapshot.fen;
};

const setRemoteState = async (
  move: Readonly<Move>,
  fen: string,
): Promise<void> => {
  await set(
    ref(database, `games/${process.env.NEXT_PUBLIC_TEST_SESSION_ID}/state`),
    {
      move,
      fen,
    },
  );
};

const Chessboard: FC<ChessboardProps> = ({
  onLegalMove,
}: ChessboardProps): ReactElement | null => {
  const game = useMemo(() => new Chess(), []);
  const [clientFen, setClientFen] = useState(game.fen());
  const color = useMemo(() => {
    const localStorageColor = localStorage.getItem("color");

    if (null === localStorageColor) {
      redirect("/");
    }

    return localStorageColor;
  }, []);

  const { isLoading, data: remoteFen } = useQuery({
    queryKey: ["remoteState"],
    queryFn: getRemoteState,
  });

  useEffect(() => {
    if (null === remoteFen || undefined === remoteFen) {
      return;
    }

    setClientFen(remoteFen);
  }, [remoteFen]);

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

        setClientFen(gameCopy.fen());
      },
    );
  }, [color]);

  const makeAMove = (move: Readonly<Move>): Move | null => {
    const gameCopy = new Chess(clientFen);

    const result = gameCopy.move(move);

    if (!result || color !== result.color) {
      return null;
    }

    setClientFen(gameCopy.fen());
    onLegalMove(gameCopy.fen());

    setRemoteState(result, gameCopy.fen()).catch((error: unknown) => {
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
    if ("w" === color) {
      return "white";
    }

    return "black";
  }, [color]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ReactChessboard
      id="chessboard"
      position={clientFen}
      onPieceDrop={onPieceDrop}
      boardOrientation={boardOrientation}
    />
  );
};

export default Chessboard;
