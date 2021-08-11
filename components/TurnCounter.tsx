import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import { moves } from '../pages'

export default function TurnCounter({ currentID }: { currentID: string }) {
  const count = moves.get(currentID)!.count;
  const senteGote = count % 2 === 1 ? "▲" : "▽";

  return (
    <div className={styles.condition}>{senteGote} {count}</div>
  )
}