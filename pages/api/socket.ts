import type { NextApiRequest, NextApiResponse } from 'next'
import { Server, Socket } from 'socket.io';
import { NextApiResponseServerIO } from '../../types/types'

export const config = {
  api: {
    bodyParser: false,
  },
};

const MySocket = async (
  req: NextApiRequest,
  res: NextApiResponseServerIO
) => {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    // adapt Next's net Server to http Server
    const httpServer = res.socket.server;
    const io = new Server(httpServer as any, {
      path: "/api/socket",
    });
    io.on("connection", (socket) => {
      socket.join(socket.handshake.query.gameID as string);
    })
    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;
  }
  res.end();
}

export default MySocket;