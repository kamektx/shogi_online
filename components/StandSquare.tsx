import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import Piece from './Piece'

export default function StandSquare({ colSpan, multiply, pieceName, position }: { colSpan: number, multiply: number, pieceName: string, position: number }) {

  return (
    <td className={cn(styles.stand_square, {
      [styles.hidden]: multiply == 0
    })} colSpan={colSpan} style={{
      borderWidth:
        ((position & 0b1000) == 0b1000 ? "1.5px" : "0") + " " +
        ((position & 0b0100) == 0b0100 ? "1.5px" : "0") + " " +
        ((position & 0b0010) == 0b0010 ? "1.5px" : "0") + " " +
        ((position & 0b0001) == 0b0001 ? "1.5px" : "0"),
      borderColor: "rgba(0, 0, 0, 0.4)",
      borderStyle: "solid"
    }}>
      <div className={styles.inner}>
        <Piece pieceName={pieceName} />
        <div className={styles.multiply}><span style={{ fontSize: "70%", margin: "0 6px" }}>×</span>{multiply}</div>
      </div>
    </td>
  )
}