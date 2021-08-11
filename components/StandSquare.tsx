import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import Piece from './Piece'
import { boardStates } from '../pages'
import { TSelection } from './Board';
import { TPieceFace, TPieceIncludeNull } from '../types/types';

export default function StandSquare({ colSpan, currentID, pieceName, position, sente, _onSquareClick, selection }: { colSpan: number, currentID: string, pieceName: TPieceFace, position: number, sente: boolean, _onSquareClick: (row: number, column: number, pieceName: TPieceIncludeNull) => void, selection: TSelection }) {
  let myCapturedPieces = boardStates.get(currentID)!.goteCapturedPieces;
  if (sente) {
    myCapturedPieces = boardStates.get(currentID)!.senteCapturedPieces;
  }

  const index = sente ? 100 : 200;
  const currentGote = boardStates.get(currentID)!.count % 2 === 0;
  const multiply = myCapturedPieces.filter((elem) => elem === pieceName).length;
  const canClick = (selection.selected && selection.selectedRow === index && selection.selectedPiece === pieceName) || (!selection.selected && multiply > 0 && (Number(sente) ^ Number(currentGote)))

  const _onClick = () => {
    if (canClick) _onSquareClick(index, index, pieceName)
  }

  return (
    <td onClick={_onClick} className={cn(styles.stand_square, {
      [styles.hidden]: multiply === 0,
      [styles.pointer]: canClick,
      [styles.red]: selection.selected && selection.selectedRow === index && selection.selectedPiece === pieceName,
    })} colSpan={colSpan} style={{
      borderStyle:
        ((position & 0b1000) == 0b1000 ? "solid" : "none") + " " +
        ((position & 0b0100) == 0b0100 ? "solid" : "none") + " " +
        ((position & 0b0010) == 0b0010 ? "solid" : "none") + " " +
        ((position & 0b0001) == 0b0001 ? "solid" : "none"),
    }}>
      <div className={styles.inner}>
        <Piece pieceName={pieceName} />
        <div className={styles.multiply}><span style={{ fontSize: "0.7em", margin: "0 6px" }}>×</span>{multiply}</div>
      </div>
    </td>
  )
}