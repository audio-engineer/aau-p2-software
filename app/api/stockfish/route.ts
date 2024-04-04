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

export const POST = async (request: Request): Promise<Response> => {
  const response = await fetch("http://stockfish:8000/evaluate-position", {
    method: "POST",
    body: (await request.json()) as string,
  });

  const responseJson = (await response.json()) as StockfishResponse;

  return Response.json({ ...responseJson });
};
