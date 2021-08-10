import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import StandSquare from './StandSquare'
import Square from './Square';
import { ReactElement } from 'react';
import BoardIndex from './BoardIndex';

export default function Board() {


  const renderBoardRow = (row: number) => {
    const list: JSX.Element[] = [];
    list.push(<th className={cn(styles.holpad, styles.padding)} key={100 * row + 10} />)
    for (let i = 9; i >= 1; i--) {
      list.push(
        <Square column={i} row={row} key={100 * row + i} />
      )
    }
    list.push(<BoardIndex forRow={true} index={row} key={100 * row} />)
    return list
  }
  const renderIndexRow = () => {
    const list: JSX.Element[] = [];
    list.push(<th className={cn(styles.padding, styles.holpad, styles.verpad)} key={10} />)
    for (let i = 9; i >= 1; i--) {
      list.push(
        <BoardIndex forRow={false} index={i} key={i} />
      )
    }
    list.push(<th className={cn(styles.padding, styles.holpad, styles.verpad)} key={0} />)
    return list
  }

  const renderPaddingRow = () => {
    const list: JSX.Element[] = [];
    list.push(<th className={cn(styles.padding, styles.holpad, styles.verpad)} key={1010} />)
    for (let i = 9; i >= 1; i--) {
      list.push(
        <th className={cn(styles.padding, styles.verpad)} key={1000 + i} />
      )
    }
    list.push(<th className={cn(styles.padding, styles.holpad, styles.verpad)} key={1000} />)
    return list
  }


  const renderMainBoard = () => {
    const mainBoard: JSX.Element[] = [];
    mainBoard.push(
      <tr key={1100}>
        {renderIndexRow()}
      </tr>
    )
    for (let i = 1; i <= 9; i++) {
      mainBoard.push(
        <tr key={1100 + i}>
          {renderBoardRow(i)}
        </tr>
      )
    }
    mainBoard.push(
      <tr key={1110}>
        {renderPaddingRow()}
      </tr>
    )
    return mainBoard
  }

  return (
    <table className={styles.board_wrap}>
      <thead className={cn(styles.stand, styles.gote)}>
        <tr>
          <th className={cn(styles.holpad, styles.padding)} />
          <StandSquare colSpan={2} multiply={2} pieceName="金" position={0b1001} />
          <StandSquare colSpan={2} multiply={2} pieceName="銀" position={0b1000} />
          <StandSquare colSpan={2} multiply={2} pieceName="桂" position={0b1000} />
          <StandSquare colSpan={2} multiply={2} pieceName="香" position={0b1100} />
          <th className={cn(styles.blank, styles.padding)} />
          <th className={cn(styles.holpad, styles.padding)} />

        </tr>
        <tr>
          <th className={cn(styles.holpad, styles.padding)} />
          <StandSquare colSpan={2} multiply={2} pieceName="飛" position={0b0011} />
          <StandSquare colSpan={2} multiply={2} pieceName="角" position={0b0010} />
          <StandSquare colSpan={4} multiply={4} pieceName="歩" position={0b0110} />
          <th className={cn(styles.blank, styles.padding)} />
          <th className={cn(styles.holpad, styles.padding)} />
        </tr>
      </thead>
      <tbody className={styles.board}>
        {renderMainBoard()}
      </tbody>
      <thead className={cn(styles.stand, styles.sente)}>
        <tr>
          <th className={cn(styles.holpad, styles.padding)} />
          <th className={cn(styles.blank, styles.padding)} />
          <StandSquare colSpan={2} multiply={2} pieceName="金" position={0b1001} />
          <StandSquare colSpan={2} multiply={2} pieceName="銀" position={0b1000} />
          <StandSquare colSpan={2} multiply={2} pieceName="桂" position={0b1000} />
          <StandSquare colSpan={2} multiply={2} pieceName="香" position={0b1100} />
          <th className={cn(styles.holpad, styles.padding)} />
        </tr>
        <tr>
          <th className={cn(styles.holpad, styles.padding)} />
          <th className={cn(styles.blank, styles.padding)} />
          <StandSquare colSpan={2} multiply={2} pieceName="飛" position={0b0011} />
          <StandSquare colSpan={2} multiply={2} pieceName="角" position={0b0010} />
          <StandSquare colSpan={4} multiply={4} pieceName="歩" position={0b0110} />
          <th className={cn(styles.holpad, styles.padding)} />
        </tr>
      </thead>
    </table>
  )
}