import type { FC, ReactElement } from "react";
import { useState } from "react";
import type { Square } from "chess.js";
import { Chess, type Move } from "chess.js";
import { Chessboard } from "react-chessboard";

const ChessboardGame: FC = (): ReactElement | null => {
  const noPossibleMoves = 0;
  const timeoutLength = 200;

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

  const makeRandomMove = (): void => {
    const possibleMoves = game.moves();

    if (
      game.game_over() ||
      game.in_draw() ||
      noPossibleMoves === possibleMoves.length
    ) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);

    makeAMove(possibleMoves[randomIndex]);
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

    setTimeout(makeRandomMove, timeoutLength);

    return true;
  };

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
