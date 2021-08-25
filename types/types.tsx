import { Server as NetServer, Socket as NetSocket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

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
  time: string,
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

export type TCommandOfChangeCurrentID = ("newMove" | "start" | "back" | "forward" | "latest")

export type TMessageData = {
  command: ("newMove" | "changeCurrentID"),
  move?: TMove,
  currentID?: string,
  commandOfChangeCurrentID?: TCommandOfChangeCurrentID,
}

export type TMessage = {
  gameID: string,
  lastMessageID: string,
  messageID: string,
  name: string,
  data: TMessageData[],
}

export type TAllMessages = TMessage[]

export type TApi = {
  command: ("sendMessage" | "requestAllMessages" | "requestNotification"),
  gameID?: string,
  socketID?: string,
  message?: TMessage,
}

export type TInformation = {
  text: string,
  color?: string,
  ms: number
}

export type TNotification = {
  data: string,
  isActive: boolean,
}

export type TState = {
  currentID: string,
  changeCurrentID: (id: string, command: TCommandOfChangeCurrentID) => Promise<boolean>,
  sendMessage: (message: TMessage) => Promise<boolean>,
  handleNewMoveAndChangeCurrentID: (move: TMove) => Promise<boolean>,
  _onSelectNariFunari: (move: TMove, callback: (move: TMove) => void) => void,
  setTemporaryInformation: (value: TInformation) => void,
  temporaryInformation: TInformation | undefined,
  forwardMenuOpened: boolean,
  setForwardMenuOpened: (value: boolean) => void,
  isReversed: boolean,
  setIsReversed: (value: boolean) => void,
  notification: TNotification,
  setNotification: (value: TNotification) => void,
}