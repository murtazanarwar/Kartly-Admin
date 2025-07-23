import type { NextApiRequest, NextApiResponse } from "next";
import initSocket from "../../lib/socket";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  initSocket(res);
  res.status(200).end();
}
