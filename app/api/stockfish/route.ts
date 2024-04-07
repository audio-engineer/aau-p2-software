export interface DataResponse<A> {
  data: A;
}

export interface Evaluation {
  type: string;
  value: number;
}

export interface TopMove {
  move: string;
  centipawn: number | null;
  mate: number | null;
  time: string;
  nodes: string;
  multiPvLine: string;
  nodesPerSecond: string;
  selectiveDepth: string;
  wdl: string;
}

export interface EvaluatePositionResponse {
  evaluation: Evaluation;
  wdlStats: number[];
  topThreeMoves: TopMove[];
}

export interface StockfishMessageResponse {
  readonly message: string;
}

export const POST = async (request: Request): Promise<Response> => {
  const response = await fetch("http://stockfish:8000/evaluate-position", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(await request.json()),
  });

  const responseJson =
    (await response.json()) as DataResponse<EvaluatePositionResponse>;

  const firstMoveIndex = 0;
  const secondMoveIndex = 1;
  const thirdMoveIndex = 2;

  const firstMove = responseJson.data.topThreeMoves[firstMoveIndex].move;
  const secondMove = responseJson.data.topThreeMoves[secondMoveIndex].move;
  const thirdMove = responseJson.data.topThreeMoves[thirdMoveIndex].move;

  const messages = [
    "The three best moves from here would be",
    "Consider",
    "Try",
    "Go for",
    "If I were you, I would try",
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  const message = `${randomMessage} ${firstMove}, ${secondMove} or ${thirdMove}!`;

  return Response.json({
    message,
  });
};
