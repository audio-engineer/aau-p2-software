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
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STOCKFISH_API_HOST ?? "http://stockfish:8000"}/evaluate-position`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(await request.json()),
    },
  );

  const responseJson =
    (await response.json()) as DataResponse<EvaluatePositionResponse>;

  const firstMoveIndex = 0;
  const secondMoveIndex = 1;
  const thirdMoveIndex = 2;

  const firstMove = responseJson.data.topThreeMoves[firstMoveIndex].move;
  const secondMove = responseJson.data.topThreeMoves[secondMoveIndex].move;
  const thirdMove = responseJson.data.topThreeMoves[thirdMoveIndex].move;

  const messages = [
    "The next three best moves from here would probably be:",
    "You could consider these 3 moves for your next move:",
    "Maybe try one of these moves for your next move:",
  ];

  const randomBeginningMessage =
    messages[Math.floor(Math.random() * messages.length)];

  const firstMoveMessage = `\n- ${firstMove}: [LLM explanation]`;
  const secondMoveMessage = `\n- ${secondMove}: [LLM explanation]`;
  const thirdMoveMessage = `\n- ${thirdMove}: [LLM explanation]`;

  const message = `${randomBeginningMessage}${firstMoveMessage}${secondMoveMessage}${thirdMoveMessage}`;

  return Response.json({
    message,
  });
};
