import styles from '../styles/Home.module.scss'
import cn from 'classnames'

export default function BoardIndex({ forRow, index }: { forRow: boolean, index: number }) {
  let char = index.toString();
  if (forRow) {
    char = "一二三四五六七八九".charAt(index - 1);
  }
  return (
    <th className={cn(styles.padding, styles.board_index, {
      [styles.holpad]: forRow,
      [styles.verpad]: !forRow
    })}>
      <div className={styles.inner}>
        {char}
      </div>
    </th>
  )
}