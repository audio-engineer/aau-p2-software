export interface StockfishResponse {
  data: Data;
}

export interface Data {
  "best-move": BestMove[];
}

export interface BestMove {
  Move: string;
  Centipawn: number;
  Mate: null;
}

// TODO Due to issues with finding the correct return type
// eslint-disable-next-line
export const GET = async () => {
  const response = await fetch("http://stockfish:8000");
  const responseJson = (await response.json()) as StockfishResponse;

  return Response.json({ ...responseJson });
};
