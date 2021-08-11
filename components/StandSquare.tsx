import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import Piece from './Piece'
import { boardStates } from '../pages'

export default function StandSquare({ colSpan, currentID, pieceName, position, sente }: { colSpan: number, currentID: string, pieceName: string, position: number, sente: boolean }) {

  let myCapturedPieces = boardStates.get(currentID)!.goteCapturedPieces;
  if (sente) {
    myCapturedPieces = boardStates.get(currentID)!.senteCapturedPieces;
  }

  const multiply = myCapturedPieces.filter((elem) => elem === pieceName).length;

  return (
    <td className={cn(styles.stand_square, {
      [styles.hidden]: multiply === 0,
      [styles.pointer]: multiply !== 0,
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