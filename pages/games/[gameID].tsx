import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import Game from '../../components/Game'
import MyHead from '../../components/MyHead'
import { useState } from 'react'
import { TMove, TBoardState, TPieceFace, TPieceAll, TMessage, TAllMessages, TApi, TInformation, TCommandOfChangeCurrentID, TNotification } from '../../types/types'
import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { createID, handleNewMove } from '../../func/GameFunctions'
import { url } from '../../func/url'
import { Howl, Howler } from 'howler'

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
  time: "",
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

export let moveSound: Howl;
if (process.browser) {
  moveSound = new Howl({
    src: url("/move.mp3"),
  });
}
export let selectSound: Howl;
if (process.browser) {
  selectSound = new Howl({
    src: url("/select.mp3"),
    volume: 0.12,
  });
}

export default function Home() {
  const router = useRouter();
  const [currentID, setCurrentID] = useState("START")
  const [mode, setMode] = useState<("main" | "makeDraft" | "playDraft")>("main");
  const [gameID, setGameID] = useState("");
  const [socketID, setSocketID] = useState("");
  const [temporaryInformation, setTemporaryInformation] = useState<TInformation | undefined>(undefined);
  const [notification, setNotification] = useState<TNotification>({
    data: "",
    isActive: false,
  })

  const parseMessage = (message: TMessage, isFromRequestAllMessages = false) => {
    if (message.lastMessageID !== messageIDs[messageIDs.length - 1]) throw new Error("There is messages that this browser haven't received.");
    messageIDs.push(message.messageID);
    for (const data of message.data) {
      switch (data.command) {
        case "newMove":
          if (!handleNewMove(data.move!)) console.error("handleMove() in parseMessage() failed.");
          break;
        case "changeCurrentID":
          SetCurrentIDAndSetCurrentInformationWithoutSending(data.currentID!, data.commandOfChangeCurrentID!, message.name, isFromRequestAllMessages);
          break;
        default:
          break;
      }
    }
  }

  const sendMessage = async (message: TMessage): Promise<boolean> => {
    messageIDs.push(message.messageID);
    const res = await fetch("https://api.techchair.net/shogi/rest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        command: "sendMessage",
        gameID: gameID,
        socketID: socketID,
        message: message,
      } as TApi),
    });
    if (!res.ok) throw new Error("sendMessage api failed.");
    const data = await res.json();
    if (!data.isMessageOK) {
      console.log(data.error);
      requestAllMessages();
      return false;
    }
    return true;
  }

  const requestAllMessages = async () => {
    const res = await fetch("https://api.techchair.net/shogi/rest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        command: "requestAllMessages",
        gameID: gameID,
        socketID: socketID,
      } as TApi),
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
    setCurrentID("START");
    try {
      for (const message of allMessages) {
        parseMessage(message, true);
      }
    } catch (e) {
      console.error("requestAllMessages(): " + e.message);
    }
  }
  const requestNotification = async () => {
    const res = await fetch("https://api.techchair.net/shogi/rest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        command: "requestNotification",
      } as TApi),
    });
    if (!res.ok) throw new Error("requestNotification api failed.");
    const _notification = await res.json() as TNotification;
    console.log(_notification);
    setNotification(_notification);
  }

  useEffect(() => {
    requestNotification();
  }, [])

  useEffect(() => {
    if (router.query["gameID"] == null) return;
    const myGameID = router.query["gameID"] as string;
    setGameID(myGameID);
    if (moves.get("START")?.forward.length !== 0) {
      if (process.browser) {
        window.location.reload();
      }
    }

    const socket = io("https://api.techchair.net", {
      // transports: ["websocket"],
      path: "/shogi/socket",
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

    socket.on("notification", (_notification: TNotification) => {
      setNotification({
        data: _notification.data,
        isActive: _notification.isActive,
      })
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

  const SetCurrentIDAndSetCurrentInformationWithoutSending = (id: string, command: TCommandOfChangeCurrentID, name: string, isFromRequestAllMessages = false) => {
    setCurrentID(id);
    switch (command) {
      case "newMove":
        if (isFromRequestAllMessages) break;
        moveSound.pause();
        moveSound.seek(0);
        moveSound.play();
        break;
      default:
        if (isFromRequestAllMessages) break;
        selectSound.pause();
        selectSound.seek(0);
        selectSound.play();
        break;
    }
    switch (command) {
      case "newMove":
        break;
      case "start":
        setTemporaryInformation({ text: name + " has put the phase back to the first.", ms: 1800 });
        break;
      case "back":
        setTemporaryInformation({ text: name + " has put the phase back to the previous.", ms: 1800 });
        break;
      case "forward":
        setTemporaryInformation({ text: name + " has moved the phase to the next.", ms: 1800 });
        break;
      case "latest":
        setTemporaryInformation({ text: name + " has moved the phase to the latest.", ms: 1800 });
        break;
    }
  }

  const changeCurrentID = async (id: string, command: TCommandOfChangeCurrentID): Promise<boolean> => {
    if (!boardStates.has(id) || !moves.has(id)) return false;
    SetCurrentIDAndSetCurrentInformationWithoutSending(id, command, playerInfo.name);
    const message: TMessage = {
      gameID: gameID,
      messageID: createID(),
      lastMessageID: messageIDs[messageIDs.length - 1],
      name: playerInfo.name,
      data: [
        {
          command: "changeCurrentID",
          currentID: id,
          commandOfChangeCurrentID: command,
        }
      ]
    }
    if (socketID === "") throw new Error("Socket is not connected.");
    const result = await sendMessage(message);
    console.log("sendMessage() returns: " + (result ? "true" : "false"));
    return result;
  }

  const handleNewMoveAndChangeCurrentID = async (move: TMove): Promise<boolean> => {
    const date = new Date();
    move.time = date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0') + ":" + date.getSeconds().toString().padStart(2, '0');
    if (!handleNewMove(move)) return false;
    SetCurrentIDAndSetCurrentInformationWithoutSending(move.id, "newMove", playerInfo.name);
    const message: TMessage = {
      gameID: gameID,
      messageID: createID(),
      lastMessageID: messageIDs[messageIDs.length - 1],
      name: playerInfo.name,
      data: [
        {
          command: "newMove",
          move: move,
        },
        {
          command: "changeCurrentID",
          currentID: move.id,
          commandOfChangeCurrentID: "newMove",
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
      <Game changeCurrentID={changeCurrentID} currentID={currentID} handleNewMoveAndChangeCurrentID={handleNewMoveAndChangeCurrentID} setTemporaryInformation={setTemporaryInformation} temporaryInformation={temporaryInformation} notification={notification} setNotification={setNotification} />
    </>
  )
}