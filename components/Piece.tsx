import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import React from 'react'

export default function Piece({ pieceName, className }: { pieceName?: string, className?: string }) {
  return (
    <div className={cn(styles.piece, className)}>
      <div className={styles.inner}>
        {pieceName ?? ""}
      </div>
    </div>
  )
}