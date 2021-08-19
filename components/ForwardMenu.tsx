import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import { TState } from '../types/types'
import { moves } from '../pages/games/[gameID]'

export default function ForwardMenu({ currentID, forwardMenuOpened, setForwardMenuOpened, changeCurrentID }: Pick<TState, "currentID" | "forwardMenuOpened" | "setForwardMenuOpened" | "changeCurrentID">) {

  const currentMove = moves.get(currentID)!;

  const columnChar = (column: number) => {
    return "１２３４５６７８９".charAt(column - 1);
  }
  const rowChar = (row: number) => {
    return "一二三四五六七八九".charAt(row - 1);
  }

  const _onPointerDown = (index: number) => {
    changeCurrentID(currentMove.forward[index], "forward");
    setForwardMenuOpened(false);
  }

  const renderMenuItem = (index: number, forwardArray: string[]) => {
    if (index >= forwardArray.length) throw new Error('Argument "index" is invalid.');
    if (!moves.has(forwardArray[index])) throw new Error('moves.has(currentMove.forward[index]) returned false.');
    const targetMove = moves.get(forwardArray[index])!;
    const isBottom = index === forwardArray.length - 1;
    return (
      <div key={index} onPointerDown={() => _onPointerDown(index)} className={cn(styles.menu_item, {
        [styles.bottom_item]: isBottom,
      })}>{"From " + (targetMove.before.column % 100 === 0 ? "駒台" : columnChar(targetMove.before.column) + rowChar(targetMove.before.row) + targetMove.before.piece) + "  to " + columnChar(targetMove.after.column) + rowChar(targetMove.after.row) + targetMove.after.piece + (targetMove.time == undefined ? "" : "  at " + targetMove.time) + "\nby " + targetMove.name}</div>
    )
  }

  const renderMenuItems = () => {
    const menuItems: JSX.Element[] = [];
    const forwardArray = currentMove.forward;
    for (let index = 0; index < forwardArray.length; index++) {
      menuItems.push(renderMenuItem(index, forwardArray));
    }
    return menuItems;
  }

  return (
    <div className={cn(styles.wrap, styles.menu_wrap)}>
      <div className={cn(styles.menu_popup, {
        [styles.menu_opened]: forwardMenuOpened
      })}>
        {renderMenuItems()}
      </div>
    </div>
  )
}