import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import Piece from './Piece'
import { useState } from 'react';
import { boardStates, moves } from '../pages/games/[gameID]';
import { TPieceIncludeNull } from '../types/types';
import { TSelection } from './Board';
import { canMovePiece } from '../func/GameFunctions';

export default function Square({ column, row, currentID, _onSquareClick, selection }
  : { column: number, row: number, currentID: string, _onSquareClick: (row: number, column: number, pieceName: TPieceIncludeNull) => void, selection: TSelection }) {

  let isGote = false;
  let pieceName: TPieceIncludeNull = "";

  const lastMove = moves.get(currentID)!;

  if (boardStates.get(currentID)!.goteBoard[row][column] !== "") {
    isGote = true;
    pieceName = boardStates.get(currentID)!.goteBoard[row][column];
  } else {
    pieceName = boardStates.get(currentID)!.senteBoard[row][column];
  }

  const currentGote = boardStates.get(currentID)!.count % 2 === 0;

  const canMovePieceHere = (): boolean => {
    if (!selection.selected) return false;
    const move = { ...selection.move };
    move.after = {
      row: row,
      column: column,
      piece: pieceName,
    }
    if (canMovePiece(move) > 0) return true;
    return false;
  }
  const resultOfCanMovePieceHere = canMovePieceHere();

  const canClick = !boardStates.get(currentID)!.isEnd && ((selection.selected && (resultOfCanMovePieceHere || (selection.selectedRow === row && selection.selectedColumn === column))) || (!selection.selected && pieceName !== "" && !(Number(isGote) ^ Number(currentGote))))

  const isGreenLight = (lastMove.before.row === row && lastMove.before.column === column && lastMove.id !== "START")

  const isGreen = (lastMove.after.row === row && lastMove.after.column === column && lastMove.id !== "START")

  const _onClick = () => {
    if (canClick) _onSquareClick(row, column, pieceName)
  }

  const renderPiece = pieceName === "" ? <></> : <Piece pieceName={pieceName} className={cn({
    [styles.font_gray]: Number(isGote) ^ Number(currentGote),
  })} />;

  return (
    <td onClick={_onClick} className={cn(styles.board_square, styles.square, {
      [styles.gote]: isGote,
      [styles.pointer]: canClick,
      [styles.red]: selection.selectedRow === row && selection.selectedColumn === column,
      [styles.red_light]: resultOfCanMovePieceHere,
      [styles.green]: isGreen,
      [styles.green_light]: isGreenLight,
    })}>
      <div className={styles.inner}>
        {renderPiece}
      </div>
    </td>
  )
}