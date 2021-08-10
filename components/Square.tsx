import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import Piece from './Piece'

export default function Square({ column, row, pieceName }: { column: number, row: number, pieceName?: string }) {
  return (
    <td className={styles.square}>
      <div className={styles.inner}>
        <Piece />
      </div>
    </td>
  )
}