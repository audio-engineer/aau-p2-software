declare module "chess.js" {
  type Color = "b" | "w";

  type Square =
    | "a1"
    | "a2"
    | "a3"
    | "a4"
    | "a5"
    | "a6"
    | "a7"
    | "a8"
    | "b1"
    | "b2"
    | "b3"
    | "b4"
    | "b5"
    | "b6"
    | "b7"
    | "b8"
    | "c1"
    | "c2"
    | "c3"
    | "c4"
    | "c5"
    | "c6"
    | "c7"
    | "c8"
    | "d1"
    | "d2"
    | "d3"
    | "d4"
    | "d5"
    | "d6"
    | "d7"
    | "d8"
    | "e1"
    | "e2"
    | "e3"
    | "e4"
    | "e5"
    | "e6"
    | "e7"
    | "e8"
    | "f1"
    | "f2"
    | "f3"
    | "f4"
    | "f5"
    | "f6"
    | "f7"
    | "f8"
    | "g1"
    | "g2"
    | "g3"
    | "g4"
    | "g5"
    | "g6"
    | "g7"
    | "g8"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "h7"
    | "h8";

  type PieceSymbol = "b" | "k" | "n" | "p" | "q" | "r";

  interface Move {
    color?: Color;
    from: Square;
    to: Square;
    flags?: string;
    piece?: PieceSymbol;
    san?: string;
    promotion: string;
  }

  class Chess {
    public constructor(fen: string = undefined);

    public move(move: Readonly<Move> | string): Move | null;

    public moves(): string[];

    public fen(): string;

    public turn(): Color;

    public game_over(): boolean;

    public in_draw(): boolean;
  }
}
