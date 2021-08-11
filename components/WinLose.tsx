import styles from '../styles/Home.module.scss'
import cn from 'classnames'

export default function WinLose({ colSpan, winOrLose, position }: { colSpan: number, winOrLose: ("" | "win" | "lose"), position: number }) {

  let str = "";
  switch (winOrLose) {
    case "win":
      str = "勝"
      break;
    case "lose":
      str = "負"
      break;
    default:
      break;
  }

  return (
    <td className={cn(styles.stand_square, styles.win_lose, {
      [styles.hidden]: winOrLose == "",
      [styles.win]: winOrLose == "win",
      [styles.lose]: winOrLose == "lose"
    })} colSpan={colSpan} style={{
      borderStyle:
        ((position & 0b1000) == 0b1000 ? "solid" : "none") + " " +
        ((position & 0b0100) == 0b0100 ? "solid" : "none") + " " +
        ((position & 0b0010) == 0b0010 ? "solid" : "none") + " " +
        ((position & 0b0001) == 0b0001 ? "solid" : "none"),
    }}>
      <div className={styles.inner}>
        <div>
          <div className={styles.inner}>
            {str}
          </div>
        </div>
      </div>
    </td>
  )
}