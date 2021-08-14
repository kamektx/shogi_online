import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import Game from '../../components/Game'
import MyHead from '../../components/MyHead'
import { useState } from 'react'
import { TMove, TBoardState, TPieceFace, TPieceAll, TMessage, TAllMessages, TNextApi } from '../../types/types'
import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { createID, handleNewMove } from '../../func/GameFunctions'

export const gameProperty = {
  csaVersion: "V2.2",
  senteName: "Pazu",
  goteName: "Sheeta",
  roomName: "default",
}

export const playerInfo = {
  name: "You"
};

export const initialBoardState = {
  id: "START",
  count: 1,
  senteCapturedPieces: [],
  goteCapturedPieces: [],
  senteBoard: [
    [],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "歩", "歩", "歩", "歩", "歩", "歩", "歩", "歩", "歩"],
    ["", "", "飛", "", "", "", "", "", "角", ""],
    ["", "香", "桂", "銀", "金", "玉", "金", "銀", "桂", "香"]
  ],
  goteBoard: [
    [],
    ["", "香", "桂", "銀", "金", "玉", "金", "銀", "桂", "香"],
    ["", "", "角", "", "", "", "", "", "飛", ""],
    ["", "歩", "歩", "歩", "歩", "歩", "歩", "歩", "歩", "歩"],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""]
  ],
  isEnd: false,
} as TBoardState // Note the left-right flip.

export const firstMove = {
  count: 1,
  id: "START",
  name: "System",
  before: {
    row: 0,
    column: 0,
    piece: "",
  },
  after: {
    row: 0,
    column: 0,
    piece: "",
  },
  captured: "",
  natta: false,
  back: "",
  forward: [],
  isDraft: false,
  draft: [],
} as TMove

export const moves = new Map<string, TMove>().set("START", firstMove)

export const boardStates = new Map<string, TBoardState>().set("START", initialBoardState)

export const messageIDs: string[] = ["FIRST"];

export default function Home() {
  const router = useRouter();
  const [currentID, setCurrentID] = useState("START")
  const [mode, setMode] = useState<("main" | "makeDraft" | "playDraft")>("main");
  const [gameID, setGameID] = useState("");
  const [socketID, setSocketID] = useState("");

  const parseMessage = (message: TMessage) => {
    if (message.lastMessageID !== messageIDs[messageIDs.length - 1]) throw new Error("There is messages that this browser haven't received.");
    messageIDs.push(message.messageID);
    for (const data of message.data) {
      switch (data.command) {
        case "newMove":
          if (!handleNewMove(data.move!)) console.error("handleMove() in parseMessage() failed.");
          break;
        case "changeCurrentID":
          setCurrentID(data.currentID!);
          break;
        default:
          break;
      }
    }
  }

  const sendMessage = async (message: TMessage): Promise<boolean> => {
    messageIDs.push(message.messageID);
    const res = await fetch("/api/nextApi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        command: "sendMessage",
        gameID: gameID,
        socketID: socketID,
        message: message,
      } as TNextApi),
    });
    if (!res.ok) throw new Error("sendMessage api failed.");
    const data = await res.json();
    if (!data.isMessageOK) {
      console.log(data.error)
      console.log(data.result)
      requestAllMessages();
      return false;
    }
    return true;
  }

  const requestAllMessages = async () => {
    const res = await fetch("/api/nextApi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        command: "requestAllMessages",
        gameID: gameID,
        socketID: socketID,
      } as TNextApi),
    });
    if (!res.ok) throw new Error("requestAllMessages api failed.");
    const allMessages = await res.json() as TAllMessages;
    console.log(allMessages);
    moves.clear();
    moves.set("START", firstMove);
    boardStates.clear();
    boardStates.set("START", initialBoardState);
    messageIDs.splice(0);
    messageIDs.push("FIRST");
    try {
      for (const message of allMessages) {
        parseMessage(message);
      }
    } catch (e) {
      console.error("requestAllMessages(): " + e.message);
    }
  }

  useEffect(() => {
    if (router.query["gameID"] == null) return;
    const myGameID = router.query["gameID"] as string;
    setGameID(myGameID);
    if (moves.get("START")?.forward.length !== 0) {
      if (process.browser) {
        window.location.reload();
      }
    }


    const socket = io(process.env.BASE_URL as string, {
      // transports: ["websocket"],
      path: "/api/socket",
      query: {
        gameID: myGameID,

      },
    })

    socket.on("connect", () => {
      console.log("Socket Connected!");
      console.log(socket);
      setSocketID(socket.id);
    })

    socket.on("message", (message: TMessage) => {
      try {
        parseMessage(message);
      } catch (e) {
        console.error('socket.on("message"): ' + e.message);
      }
    })

    socket.on("disconnect", () => {
      setSocketID("");
    })

    if (socket) return () => {
      socket.disconnect()
      setSocketID("");
    };
  }, [router]);

  useEffect(() => {
    if (socketID === "") return;
    requestAllMessages();
  }, [socketID]);

  const changeCurrentID = async (id: string): Promise<boolean> => {
    if (!boardStates.has(id) || !moves.has(id)) return false;
    setCurrentID(id);
    const message: TMessage = {
      messageID: createID(),
      lastMessageID: messageIDs[messageIDs.length - 1],
      data: [
        {
          command: "changeCurrentID",
          currentID: id,
        }
      ]
    }
    if (socketID === "") throw new Error("Socket is not connected.");
    const result = await sendMessage(message);
    console.log("sendMessage() returns: " + (result ? "true" : "false"));
    return result;
  }

  const handleNewMoveAndChangeCurrentID = async (move: TMove): Promise<boolean> => {
    if (!handleNewMove(move)) return false;
    setCurrentID(move.id);
    const message: TMessage = {
      messageID: createID(),
      lastMessageID: messageIDs[messageIDs.length - 1],
      data: [
        {
          command: "newMove",
          move: move,
        },
        {
          command: "changeCurrentID",
          currentID: move.id,
        }
      ]
    }
    if (socketID === "") throw new Error("Socket is not connected.");
    const result = await sendMessage(message);
    console.log("sendMessage() returns: " + (result ? "true" : "false"));
    return result;
  }

  return (
    <>
      <MyHead />
      <Game changeCurrentID={changeCurrentID} currentID={currentID} handleNewMoveAndChangeCurrentID={handleNewMoveAndChangeCurrentID} />
    </>
  )
}