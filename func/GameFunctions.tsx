import { boardStates, gameProperty, moves } from "../pages/games/[gameID]";
import { TMove, TPieceFace, TPieceAll, TPieceIncludeNull, TPieceNari, TBoardState } from "../types/types";

export const createID = () => {
  const EncodeBase32 = (randomArray: Uint32Array): string => {
    const encodingTable: string[] = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
      'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
      'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
      'Y', 'Z', '2', '3', '4', '5', '6', '7'
    ];
    let str = "";
    const ra = randomArray;
    const m = 5;
    const n = 32;
    const l = ra.length;
    let i = 0;
    let j = n;
    while (i < l) {
      let a = ra[i] % (2 ** j);
      let b = 0;
      if (j - m < 0) {
        a <<= m - j;
        i++;
        if (i < l) {
          j = j - m + n;
          b = ra[i] >>> j;
        }
      } else {
        j = j - m;
        a >>>= j;
      }
      const val = a + b;
      if (val < 2 ** m) {
        str += encodingTable[val];
      } else {
        throw new Error("Base32 encode error.");
      }
    }
    return str;
  }
  if (process.browser) {
    const randomArray = new Uint32Array(4);
    window.crypto.getRandomValues(randomArray);
    return EncodeBase32(randomArray);
  }
  return "";
}

export const ordinal = (num: number): string => {
  let result;
  const s1 = +('' + num).slice(-1);
  const s2 = +('' + num).slice(-2);
  if (s2 >= 11 && s2 <= 13) {
    result = num + 'th';
  } else if (s1 === 1) {
    result = num + 'st';
  } else if (s1 === 2) {
    result = num + 'nd';
  } else if (s1 === 3) {
    result = num + 'rd';
  } else {
    result = num + 'th';
  }
  return result;
}

export const canSelectMovingPiece = (move: TMove): boolean => {
  if (boardStates.get(move.back)!.count != move.count - 1) return false;
  let moverCapturedPieces = boardStates.get(move.back)!.senteCapturedPieces;
  let opponentCapturedPieces = boardStates.get(move.back)!.goteCapturedPieces;
  let moverBoard = boardStates.get(move.back)!.senteBoard;
  let opponentBoard = boardStates.get(move.back)!.goteBoard;
  if (move.count % 2 === 1) {
    moverCapturedPieces = boardStates.get(move.back)!.goteCapturedPieces;
    opponentCapturedPieces = boardStates.get(move.back)!.senteCapturedPieces;
    moverBoard = boardStates.get(move.back)!.goteBoard;
    opponentBoard = boardStates.get(move.back)!.senteBoard;
  }

  if (move.before.row % 100 === 0) {
    if (!moverCapturedPieces.includes(move.before.piece as TPieceFace)) return false;
  } else {
    if (move.before.piece === "") return false;
    if (moverBoard[move.before.row][move.before.column] != move.before.piece) return false;
  }
  return true;
}
/**
 * Returns if you can move the piece to the `TMove.after` position.
 * It ignores `TMove.after.piece: TPieceAll` property.
 * @returns 0: can't move, 1: FUNARI only or Already NARI, 2: can choose NARI or FUNARI, 3: NARI only
 */
export const canMovePiece = (move: TMove): number => {
  if (boardStates.get(move.back)!.count != move.count - 1) return 0;

  if (move.after.row % 100 === 0) return 0;

  let moverCapturedPieces = boardStates.get(move.back)!.senteCapturedPieces;
  let opponentCapturedPieces = boardStates.get(move.back)!.goteCapturedPieces;
  let moverBoard = boardStates.get(move.back)!.senteBoard;
  let opponentBoard = boardStates.get(move.back)!.goteBoard;
  let flip = 1;
  if (move.count % 2 === 1) {
    moverCapturedPieces = boardStates.get(move.back)!.goteCapturedPieces;
    opponentCapturedPieces = boardStates.get(move.back)!.senteCapturedPieces;
    moverBoard = boardStates.get(move.back)!.goteBoard;
    opponentBoard = boardStates.get(move.back)!.senteBoard;
    flip = -1;
  }

  const mba = moverBoard[move.after.row][move.after.column];
  const oba = opponentBoard[move.after.row][move.after.column];

  if (move.before.row % 100 === 0) {
    if (mba !== "") return 0;
    if (oba !== "") return 0;
    if (move.before.piece === "歩") {
      if (move.after.row - 1 * flip < 1 || move.after.row - 1 * flip > 9) return 0;
      for (let i = 1; i <= 9; i++) {
        if (moverBoard[i][move.after.column] === "歩") return 0;
      }
    } else if (move.before.piece === "桂") {
      if (move.after.row - 2 * flip < 1 || move.after.row - 2 * flip > 9) return 0;
    }
    return 1;
  } else {
    if (mba != "") return 0;

    const pieceVSMoveDirection = {
      歩: [[-1, 0]],
      桂: [[-2, -1], [-2, 1]],
      銀: [[-1, 0], [-1, -1], [1, -1], [1, 1], [-1, 1]],
      金: [[-1, 0], [-1, -1], [0, -1], [1, 0], [0, 1], [-1, 1]],
      玉: [[-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1]],
      杏: [[-1, 0], [-1, -1], [0, -1], [1, 0], [0, 1], [-1, 1]],
      圭: [[-1, 0], [-1, -1], [0, -1], [1, 0], [0, 1], [-1, 1]],
      全: [[-1, 0], [-1, -1], [0, -1], [1, 0], [0, 1], [-1, 1]],
      と: [[-1, 0], [-1, -1], [0, -1], [1, 0], [0, 1], [-1, 1]],
      馬: [[-1, 0], [0, -1], [1, 0], [0, 1]],
      龍: [[-1, -1], [1, -1], [1, 1], [-1, 1]]
    } as Record<TPieceAll, number[][]>
    const isDirectionOK = (piece: TPieceAll): boolean => {
      for (const dir of pieceVSMoveDirection[piece]) {
        if (move.before.row + dir[0] * flip === move.after.row && move.before.column + dir[1] * flip === move.after.column) return true;
      }
      return false;
    }
    switch (move.before.piece) {
      case "香":
        if (move.before.column !== move.after.column || Math.sign(move.before.row - move.after.row) !== flip) return 0;
        for (let i = 1; i < Math.abs(move.after.row - move.before.row); i++) {
          if (moverBoard[move.before.row - i * flip][move.before.column] !== "") return 0;
          if (opponentBoard[move.before.row - i * flip][move.before.column] !== "") return 0;
        }
        if (move.after.row - 1 * flip < 1 || move.after.row - 1 * flip > 9) return 3;
        if (move.after.row - 3 * flip < 1 || move.after.row - 3 * flip > 9) return 2;
        return 1;

      case "馬":
        if (isDirectionOK(move.before.piece)) return 1;
      // eslint-disable-next-line no-fallthrough
      case "角":
        if (Math.abs(move.after.row - move.before.row) !== Math.abs(move.after.column - move.before.column)) return 0;
        for (let i = 1; i < Math.abs(move.after.row - move.before.row); i++) {
          if (moverBoard[move.before.row + Math.sign(move.after.row - move.before.row) * i][move.before.column + Math.sign(move.after.column - move.before.column) * i] !== "") return 0;
          if (opponentBoard[move.before.row + Math.sign(move.after.row - move.before.row) * i][move.before.column + Math.sign(move.after.column - move.before.column) * i] !== "") return 0;
        }
        if (move.before.piece === "馬") return 1;
        else if (move.after.row - 3 * flip < 1 || move.after.row - 3 * flip > 9) return 2;

        return 1;

      case "龍":
        if (isDirectionOK(move.before.piece)) return 1;
      // eslint-disable-next-line no-fallthrough
      case "飛":
        if (move.after.row - move.before.row !== 0 && move.after.column - move.before.column !== 0) return 0;
        for (let i = 1; i < Math.abs(move.after.row - move.before.row) + Math.abs(move.after.column - move.before.column); i++) {
          if (moverBoard[move.before.row + Math.sign(move.after.row - move.before.row) * i][move.before.column + Math.sign(move.after.column - move.before.column) * i] !== "") return 0;
          if (opponentBoard[move.before.row + Math.sign(move.after.row - move.before.row) * i][move.before.column + Math.sign(move.after.column - move.before.column) * i] !== "") return 0;
        }
        if (move.before.piece === "龍") return 1;
        else if (move.after.row - 3 * flip < 1 || move.after.row - 3 * flip > 9) return 2;

        return 1;

      default:
        if (move.before.piece === "") return 0;
        if (!isDirectionOK(move.before.piece)) return 0;
        if (move.before.piece === "歩") {
          if (move.after.row - 1 * flip < 1 || move.after.row - 1 * flip > 9) return 3;
        } else if (move.before.piece === "桂") {
          if (move.after.row - 2 * flip < 1 || move.after.row - 2 * flip > 9) return 3;
        }
        switch (move.before.piece) {
          case "金":
          case "玉":
          case "杏":
          case "圭":
          case "全":
          case "と":
            return 1;
          default:
            if (move.after.row - 3 * flip < 1 || move.after.row - 3 * flip > 9) return 2;
            return 1;
        }

    }
  }
}

export const getCapturedPiece = (move: TMove): TPieceIncludeNull => {
  let opponentBoard = boardStates.get(move.back)!.goteBoard;
  if (move.count % 2 === 1) {
    opponentBoard = boardStates.get(move.back)!.senteBoard;
  }
  return opponentBoard[move.after.row][move.after.column];
}

export const getNariPiece = (pieceFace: TPieceFace): TPieceNari | "" => {
  const table = {
    歩: "と",
    香: "杏",
    桂: "圭",
    銀: "全",
    金: "",
    玉: "",
    角: "馬",
    飛: "龍"
  } as Record<TPieceFace, TPieceNari | "">
  return table[pieceFace]
}

export const getFunariPiece = (pieceName: TPieceIncludeNull): TPieceFace | "" => {
  const table = {
    と: "歩",
    杏: "香",
    圭: "桂",
    全: "銀",
    馬: "角",
    龍: "飛",
    歩: "歩",
    香: "香",
    桂: "桂",
    銀: "銀",
    金: "金",
    角: "角",
    飛: "飛",
    玉: "玉",
    "": "",
  } as Record<TPieceIncludeNull, TPieceFace | "">
  return table[pieceName]
}

export const getCSAPieceName = (pieceName: TPieceAll): string => {
  const table = {
    と: "TO",
    杏: "NY",
    圭: "NK",
    全: "NG",
    馬: "UM",
    龍: "RY",
    歩: "FU",
    香: "KY",
    桂: "KE",
    銀: "GI",
    金: "KI",
    角: "KA",
    飛: "HI",
    玉: "OU",
  } as Record<TPieceAll, string>;
  return table[pieceName];
}

export const isNariOK = (move: TMove): boolean => {
  let flip = 1;
  if (move.count % 2 === 1) {
    flip = -1;
  }

  if (move.natta) {
    if (getNariPiece(move.before.piece as TPieceFace) !== move.after.piece) return false;
    if (move.after.row - 3 * flip < 1 || move.after.row - 3 * flip > 9) return true;
    return false;
  }

  if (move.before.piece !== move.after.piece) return false;
  switch (move.after.piece) {
    case "歩":
    case "香":
      if (move.after.row - 1 * flip < 1 || move.after.row - 1 * flip > 9) return false;
      return true;

    case "桂":
      if (move.after.row - 2 * flip < 1 || move.after.row - 2 * flip > 9) return false;
      return true;

    default:
      return true;
  }
}

export const makeNewMove = (currentID: string, beforeRow: number, beforeColumn: number, beforePiece: TPieceIncludeNull, name?: string): TMove => {
  let name2: string;
  if (name == undefined) name2 = (boardStates.get(currentID)!.count % 2 == 1) ? gameProperty.senteName : gameProperty.goteName;
  else name2 = name;

  return {
    count: boardStates.get(currentID)!.count + 1,
    id: createID()!,
    name: name2,
    time: "",
    before: {
      row: beforeRow, // START: 0, senteStand: 100, goteStand: 200
      column: beforeColumn, // START: 0, senteStand: 100, goteStand: 200
      piece: beforePiece, // START: ""
    },
    after: {
      row: 0, // START: 0, senteStand: 100, goteStand: 200
      column: 0, // START: 0, senteStand: 100, goteStand: 200
      piece: "", // START: ""
    },
    captured: "", // Not captured: "", Let NARI pieces be. 
    natta: false, // true if the piece becomes NARI at this movement.
    back: currentID, // move ID
    forward: [], // move ID, forward[0] is newest move.
    isDraft: false,
    draft: [],
  }
}

export const makeNewBoardState = (move: TMove) => {
  const state = JSON.parse(JSON.stringify(boardStates.get(move.back)!)) as TBoardState;

  let moverCapturedPieces = state.senteCapturedPieces;
  let opponentCapturedPieces = state.goteCapturedPieces;
  let moverBoard = state.senteBoard;
  let opponentBoard = state.goteBoard;
  let flip = 1;
  if (move.count % 2 === 1) {
    moverCapturedPieces = state.goteCapturedPieces;
    opponentCapturedPieces = state.senteCapturedPieces;
    moverBoard = state.goteBoard;
    opponentBoard = state.senteBoard;
    flip = -1;
  }
  state.count = move.count;
  state.id = move.id;
  if (move.captured == "玉") state.isEnd = true;

  if (move.captured !== "") {
    moverCapturedPieces.push(getFunariPiece(move.captured) as TPieceFace);
    opponentBoard[move.after.row][move.after.column] = "";
  }
  if (move.before.row % 100 === 0) {
    moverCapturedPieces.splice(moverCapturedPieces.indexOf(move.before.piece as TPieceFace), 1);
  } else {
    moverBoard[move.before.row][move.before.column] = "";
  }
  moverBoard[move.after.row][move.after.column] = move.after.piece;

  return state;
}

export const checkNewMove = (move: TMove): boolean => {
  if (move.count === 1) return true;
  if (!boardStates.has(move.back)) return false;

  let moverCapturedPieces = boardStates.get(move.back)!.senteCapturedPieces;
  let opponentCapturedPieces = boardStates.get(move.back)!.goteCapturedPieces;
  let moverBoard = boardStates.get(move.back)!.senteBoard;
  let opponentBoard = boardStates.get(move.back)!.goteBoard;
  if (move.count % 2 == 1) {
    moverCapturedPieces = boardStates.get(move.back)!.goteCapturedPieces;
    opponentCapturedPieces = boardStates.get(move.back)!.senteCapturedPieces;
    moverBoard = boardStates.get(move.back)!.goteBoard;
    opponentBoard = boardStates.get(move.back)!.senteBoard;
  }

  if (!canSelectMovingPiece(move)) return false;
  if (!canMovePiece(move)) return false;
  if (!isNariOK(move)) return false;
  if (move.captured !== getCapturedPiece(move)) return false;
  return true;
}

export const handleNewMove = (move: TMove): boolean => {
  if (move.count === 1) return true;
  if (!checkNewMove(move)) return false;

  moves.set(move.id, move);

  if (move.isDraft) {
    moves.get(move.back)!.draft.unshift(move.id);
  } else {
    moves.get(move.back)!.forward.unshift(move.id);
    let currentMove = move;
    let prevMove = moves.get(currentMove.back)!
    while (prevMove.id !== "START") {
      currentMove = prevMove;
      prevMove = moves.get(currentMove.back)!;
      const index = prevMove.forward.indexOf(currentMove.id);
      if (index === -1) return false;
      if (index !== 0) {
        prevMove.forward.splice(index, 1).unshift(currentMove.id);
      }
    }
  }

  boardStates.set(move.id, makeNewBoardState(move));

  return true;
}