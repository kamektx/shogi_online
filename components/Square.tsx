import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import Piece from './Piece'
import { useState } from 'react';
import { boardStates } from '../pages';
import { TPieceIncludeNull } from '../types/types';
import { TSelection } from './Board';
import { canMovePiece } from '../func/GameFunctions';

export default function Square({ column, row, currentID, _onSquareClick, selection }
  : { column: number, row: number, currentID: string, _onSquareClick: (row: number, column: number, pieceName: TPieceIncludeNull) => void, selection: TSelection }) {

  let isGote = false;
  let pieceName: TPieceIncludeNull = "";

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

  const canClick = (selection.selected && (resultOfCanMovePieceHere || (selection.selectedRow === row && selection.selectedColumn === column))) || (!selection.selected && pieceName !== "" && !(Number(isGote) ^ Number(currentGote)))

  const _onClick = () => {
    if (canClick) _onSquareClick(row, column, pieceName)
  }

  const renderPiece = pieceName === "" ? <></> : <Piece pieceName={pieceName} />;

  return (
    <td onClick={_onClick} className={cn(styles.square, {
      [styles.gote]: isGote,
      [styles.pointer]: canClick,
      [styles.red_light]: resultOfCanMovePieceHere,
      [styles.red]: selection.selectedRow === row && selection.selectedColumn === column,
    })}>
      <div className={styles.inner}>
        {renderPiece}
      </div>
    </td>
  )
}