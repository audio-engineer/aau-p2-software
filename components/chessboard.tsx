import type { FC, ReactElement } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Color, Move, Square } from "chess.js";
import { Chess } from "chess.js";
import { Chessboard as ReactChessboard } from "react-chessboard";
import { get, onValue, ref, update } from "firebase/database";
import { database } from "@/firebase/firebase";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/loader";
import type {
  Match,
  MatchId,
  MatchRecord,
  PlayerMatchInfo,
} from "@/types/database";
import type { User } from "@firebase/auth";

interface ChessboardProps {
  readonly user: User;
  readonly mid: MatchId;
  readonly onLegalMove: (fen: string) => void;
}

const updateRemoteState = async (
  mid: keyof MatchRecord,
  latestMove: Readonly<Move>,
  fen: string,
): Promise<void> => {
  await update(ref(database, `matches/${mid}`), {
    fen,
    latestMove,
  });
};

const Chessboard: FC<ChessboardProps> = ({
  user,
  mid,
  onLegalMove,
}: ChessboardProps): ReactElement | null => {
  const game = useMemo(() => new Chess(), []);
  const [clientFen, setClientFen] = useState(game.fen());
  const [color, setColor] = useState<Color>("w");

  const getRemoteFen = useCallback(async () => {
    const snapshot = await get(ref(database, `matches/${mid}`));

    if (!snapshot.exists()) {
      return null;
    }

    const match = snapshot.val() as Match;

    return match.fen;
  }, [mid]);

  const getRemoteColor = useCallback(async () => {
    const playerSnapshot = await get(
      ref(database, `matches/${mid}/players/${user.uid}`),
    );

    if (!playerSnapshot.exists()) {
      return null;
    }

    const player = playerSnapshot.val() as PlayerMatchInfo;

    return player.color;
  }, [mid, user]);

  const { isLoading, data: remoteFen } = useQuery({
    queryKey: ["remoteFen"],
    queryFn: getRemoteFen,
  });

  const { isLoading: isLoadingTwo, data: remoteColor } = useQuery({
    queryKey: ["remoteColor"],
    queryFn: getRemoteColor,
  });

  useEffect(() => {
    if (null === remoteFen || undefined === remoteFen) {
      return;
    }

    setClientFen(remoteFen);
  }, [remoteFen]);

  useEffect(() => {
    if (null === remoteColor || undefined === remoteColor) {
      return;
    }

    setColor(remoteColor);
  }, [remoteColor]);

  useEffect(() => {
    return onValue(ref(database, `matches/${mid}`), (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }

      const match = snapshot.val() as Match;

      setColor(match.players[user.uid].color);

      if (color === match.latestMove.color) {
        return;
      }

      const gameCopy = new Chess(match.fen);

      setClientFen(gameCopy.fen());
    });
  }, [mid, color, user]);

  const makeAMove = (move: Readonly<Move>): Move | null => {
    const gameCopy = new Chess(clientFen);

    const result = gameCopy.move(move);

    if (!result || color !== result.color) {
      return null;
    }

    setClientFen(gameCopy.fen());
    onLegalMove(gameCopy.fen());

    updateRemoteState(mid, result, gameCopy.fen()).catch((error: unknown) => {
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

  if (isLoading || isLoadingTwo) {
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
