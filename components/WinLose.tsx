import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import { boardStates } from '../pages/games/[gameID]';

export default function WinLose({ position, currentID, sente }: { position: number, currentID: string, sente: boolean }) {
  const currentBoardState = boardStates.get(currentID)!;
  const isEnd = currentBoardState.isEnd;
  let winOrLose: ("" | "win" | "lose");
  if (isEnd) {
    winOrLose = ((currentBoardState.count % 2) ^ Number(sente)) === 1 ? "win" : "lose";
  } else {
    winOrLose = "";
  }
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
    <td className={cn(styles.stand_square, styles.win_lose, styles.square, {
      [styles.win]: winOrLose == "win",
      [styles.lose]: winOrLose == "lose"
    })} colSpan={1} style={{
      borderStyle:
        ((position & 0b1000) == 0b1000 ? "solid" : "none") + " " +
        ((position & 0b0100) == 0b0100 ? "solid" : "none") + " " +
        ((position & 0b0010) == 0b0010 ? "solid" : "none") + " " +
        ((position & 0b0001) == 0b0001 ? "solid" : "none"),
    }}>
      <div className={styles.inner}>
        {str}
      </div>
    </td>
  )
}