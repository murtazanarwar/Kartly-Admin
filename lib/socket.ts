// lib/socket.ts
import { Server } from "socket.io";
import type { NextApiResponse } from "next";

export default function initSocket(res: NextApiResponse) {
  // @ts-ignore
  if (!res.socket.server.io) {
    // @ts-ignore
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
    });
    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);
      socket.on("joinProduct", (productId: string) => {
        socket.join(`product_${productId}`);
      });
    });
    // @ts-ignore
    res.socket.server.io = io;
  }
  // @ts-ignore
  return res.socket.server.io as Server;
}
