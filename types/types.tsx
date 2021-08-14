import { Server as NetServer, Socket as NetSocket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { TInformation } from "../components/Information";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: NetSocket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};


export type TPieceFace = ("玉" | "金" | "銀" | "桂" | "香" | "角" | "飛" | "歩")

export type TPieceNari = ("全" | "圭" | "杏" | "馬" | "龍" | "と")

export type TPieceAll = TPieceFace | TPieceNari

export type TPieceIncludeNull = TPieceAll | ""

export type TBoardState = {
  id: string,
  count: number,
  senteCapturedPieces: Array<TPieceFace>,
  goteCapturedPieces: Array<TPieceFace>,
  senteBoard: Array<Array<TPieceIncludeNull>>,
  goteBoard: Array<Array<TPieceIncludeNull>>,
  isEnd: boolean,
}

export type TMove = {
  count: number,
  id: string,
  name: string,
  before: {
    row: number, // START: 0, senteStand: 100, goteStand: 200
    column: number, // START: 0, senteStand: 100, goteStand: 200
    piece: TPieceIncludeNull, // START: ""
  },
  after: {
    row: number, // START: 0, senteStand: 100, goteStand: 200
    column: number, // START: 0, senteStand: 100, goteStand: 200
    piece: TPieceIncludeNull, // START: ""
  },
  captured: TPieceIncludeNull, // Not captured: "", Let NARI pieces be. 
  natta: boolean, // true if the piece becomes NARI at this movement.
  back: string, // move ID
  forward: string[], // move ID, forward[0] is newest move.
  isDraft: boolean,
  draft: string[], // move ID, forward[0] is newest move.
}

export type TMessageData = {
  command: ("newMove" | "changeCurrentID"),
  move?: TMove,
  currentID?: string,
}

export type TMessage = {
  lastMessageID: string,
  messageID: string,
  data: TMessageData[],
}

export type TAllMessages = TMessage[]

export type TNextApi = {
  command: ("sendMessage" | "requestAllMessages"),
  gameID: string,
  socketID: string,
  message?: TMessage,
}

export type TState = {
  currentID: string,
  changeCurrentID: (id: string) => Promise<boolean>,
  sendMessage: (message: TMessage) => Promise<boolean>,
  handleNewMoveAndChangeCurrentID: (move: TMove) => Promise<boolean>,
  _onSelectNariFunari: (move: TMove, callback: (move: TMove) => void) => void,
  setInformation: (value: TInformation) => void
}