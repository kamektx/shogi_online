import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import StandSquare from './StandSquare'
import Square from './Square';
import { ReactElement, useState } from 'react';
import BoardIndex from './BoardIndex';
import WinLose from './WinLose';
import { TMove, TPieceFace, TPieceIncludeNull } from '../types/types';
import { canMovePiece, canSelectMovingPiece, getCapturedPiece, getNariPiece, handleNewMove, makeNewMove } from '../func/GameFunctions';
import { playerName } from '../pages';

export type TSelection = {
  selected: boolean,
  movementChecked: boolean,
  selectedRow: number,
  selectedColumn: number,
  selectedPiece: TPieceIncludeNull,
  move: TMove,
}

export default function Board({ transitionToID, currentID }: { transitionToID: (id: string) => boolean, currentID: string }) {
  const initialSelection = {
    selected: false,
    movementChecked: false,
    selectedRow: 0,
    selectedColumn: 0,
    selectedPiece: "",
    move: makeNewMove(currentID, 0, 0, "", playerName),
  } as TSelection;
  const [selection, setSelection] = useState<TSelection>(initialSelection);

  const _onSquareClick = (row: number, column: number, pieceName: TPieceIncludeNull) => {
    if (selection.selected) {
      const move = { ...selection.move };
      move.after = {
        row: row,
        column: column,
        piece: pieceName,
      }
      switch (canMovePiece(move)) {
        case 0:
          setSelection(initialSelection);
          return;

        case 1:
          move.captured = getCapturedPiece(move);
          move.natta = false;
          move.after.piece = move.before.piece
          setSelection(initialSelection);
          handleNewMove(move);
          transitionToID(move.id);
          return;

        case 2:
        case 3:
          move.captured = getCapturedPiece(move);
          move.natta = true;
          move.after.piece = getNariPiece(move.before.piece as TPieceFace);
          setSelection(initialSelection);
          handleNewMove(move);
          transitionToID(move.id);
          return;

        default:
          return;
      }
    } else {
      const move = makeNewMove(currentID, row, column, pieceName, playerName);
      if (!canSelectMovingPiece(move)) return;
      setSelection({
        selected: true,
        movementChecked: false,
        selectedRow: row,
        selectedColumn: column,
        selectedPiece: pieceName,
        move: move
      });
      return;
    }
  }

  const renderBoardRow = (row: number) => {
    const list: JSX.Element[] = [];
    list.push(<th className={cn(styles.holpad, styles.padding)} key={100 * row + 10} />)
    for (let i = 9; i >= 1; i--) {
      list.push(
        <Square _onSquareClick={_onSquareClick} selection={selection} currentID={currentID} column={i} row={row} key={100 * row + i} />
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
          <StandSquare _onSquareClick={_onSquareClick} selection={selection} sente={false} colSpan={2} currentID={currentID} pieceName="金" position={0b1001} />
          <StandSquare _onSquareClick={_onSquareClick} selection={selection} sente={false} colSpan={2} currentID={currentID} pieceName="銀" position={0b1000} />
          <StandSquare _onSquareClick={_onSquareClick} selection={selection} sente={false} colSpan={2} currentID={currentID} pieceName="桂" position={0b1000} />
          <StandSquare _onSquareClick={_onSquareClick} selection={selection} sente={false} colSpan={2} currentID={currentID} pieceName="香" position={0b1100} />
          <th className={cn(styles.blank, styles.padding)} />
          <th className={cn(styles.holpad, styles.padding)} />

        </tr>
        <tr>
          <th className={cn(styles.holpad, styles.padding)} />
          <StandSquare _onSquareClick={_onSquareClick} selection={selection} sente={false} colSpan={2} currentID={currentID} pieceName="飛" position={0b0011} />
          <StandSquare _onSquareClick={_onSquareClick} selection={selection} sente={false} colSpan={2} currentID={currentID} pieceName="角" position={0b0010} />
          <StandSquare _onSquareClick={_onSquareClick} selection={selection} sente={false} colSpan={3} currentID={currentID} pieceName="歩" position={0b0010} />
          <WinLose colSpan={1} winOrLose={"win"} position={0b0110} />
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
          <StandSquare _onSquareClick={_onSquareClick} selection={selection} sente={true} colSpan={2} currentID={currentID} pieceName="金" position={0b1001} />
          <StandSquare _onSquareClick={_onSquareClick} selection={selection} sente={true} colSpan={2} currentID={currentID} pieceName="銀" position={0b1000} />
          <StandSquare _onSquareClick={_onSquareClick} selection={selection} sente={true} colSpan={2} currentID={currentID} pieceName="桂" position={0b1000} />
          <StandSquare _onSquareClick={_onSquareClick} selection={selection} sente={true} colSpan={2} currentID={currentID} pieceName="香" position={0b1100} />
          <th className={cn(styles.holpad, styles.padding)} />
        </tr>
        <tr>
          <th className={cn(styles.holpad, styles.padding)} />
          <th className={cn(styles.blank, styles.padding)} />
          <StandSquare _onSquareClick={_onSquareClick} selection={selection} sente={true} colSpan={2} currentID={currentID} pieceName="飛" position={0b0011} />
          <StandSquare _onSquareClick={_onSquareClick} selection={selection} sente={true} colSpan={2} currentID={currentID} pieceName="角" position={0b0010} />
          <StandSquare _onSquareClick={_onSquareClick} selection={selection} sente={true} colSpan={3} currentID={currentID} pieceName="歩" position={0b0010} />
          <WinLose colSpan={1} winOrLose={"lose"} position={0b0110} />
          <th className={cn(styles.holpad, styles.padding)} />
        </tr>
      </thead>
    </table>
  )
}