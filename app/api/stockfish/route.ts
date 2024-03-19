export interface BestMove {
  readonly Move: string;
  readonly centipawn: number;
  readonly mate: null;
}

export interface StockfishResponse {
  readonly data: BestMove[];
}

export async function GET(): Response.json {
  const response = await fetch("http://stockfish:8000");
  const responseJson = (await response.json()) as StockfishResponse;

  return Response.json({ ...responseJson });
}
