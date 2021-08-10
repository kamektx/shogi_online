import styles from '../styles/Home.module.scss'
import cn from 'classnames'

export default function Piece({ pieceName }: { pieceName?: string }) {
  return (
    <div className={styles.piece}>
      <div className={styles.inner}>
        {pieceName ?? ""}
      </div>
    </div>
  )
}