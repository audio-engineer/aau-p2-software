import type { NextApiRequest, NextApiResponse } from "next";
import { createConnection } from "node:net";

export interface StockfishResponse {
  size: number;
  message: string;
}

const one = 1;

export default function handler(
  /* eslint-disable */
  req: NextApiRequest,
  res: NextApiResponse<StockfishResponse>,
  /* eslint-enable */
): void {
  const client = createConnection({ host: "stockfish", port: 23249 }, () => {
    console.log("Connected to Stockfish");

    client.write(req.body as string);
  });

  let buffer = "";
  let size = 0;
  let timesDataEventTriggered = 0;

  // eslint-disable-next-line
  client.on("data", (data: Buffer) => {
    timesDataEventTriggered++;

    size += data.length;
    buffer += data.toString();

    if (one === timesDataEventTriggered) {
      client.end();
    }
  });

  client.on("end", () => {
    console.log("Disconnected from Stockfish");

    res.json({ size, message: buffer });
  });
}
