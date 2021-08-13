import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import Game from '../../components/Game'
import MyHead from '../../components/MyHead'
import { useState } from 'react'
import { TMove, TBoardState, TPieceFace, TPieceAll } from '../../types/types'
import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'

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

export default function Home() {
  const router = useRouter();
  const [currentID, setCurrentID] = useState("START")
  const [mode, setMode] = useState<("main" | "makeDraft" | "playDraft")>("main");

  useEffect(() => {
    if (router.query["gameID"] == null) return;
    console.log(router.query.gameID);
    if (moves.get("START")?.forward.length !== 0) {
      if (process.browser) {
        window.location.reload();
      }
    }
  }, [router]);

  const transitionToID = (id: string): boolean => {
    if (!boardStates.has(id) || !moves.has(id)) return false;
    setCurrentID(id);
    return true;
  }

  return (
    <>
      <MyHead />
      <Game transitionToID={transitionToID} currentID={currentID} />
    </>
  )
}