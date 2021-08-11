import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import Piece from './Piece'
import { useState } from 'react';
import { boardStates } from '../pages';

export default function Square({ column, row, currentID }: { column: number, row: number, currentID: string }) {
  let isGote = false;
  let pieceName = "";

  if (boardStates.get(currentID)!.goteBoard[row][column] !== "") {
    isGote = true;
    pieceName = boardStates.get(currentID)!.goteBoard[row][column];
  } else {
    pieceName = boardStates.get(currentID)!.senteBoard[row][column];
  }

  const renderPiece = pieceName === "" ? <></> : <Piece pieceName={pieceName} />;

  return (
    <td className={cn(styles.square, {
      [styles.gote]: isGote,
      [styles.pointer]: pieceName !== "",
    })}>
      <div className={styles.inner}>
        {renderPiece}
      </div>
    </td>
  )
}