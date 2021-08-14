import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import { gameProperty, moves, playerInfo } from '../pages/games/[gameID]'
import { ClassNameList } from 'react-select';
import { faChevronLeft, faChevronRight, faStepBackward, faStepForward } from '@fortawesome/free-solid-svg-icons';
import React, { SetStateAction } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { TInformation } from './Information';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { getCSAPieceName } from '../func/GameFunctions';
import { TPieceAll, TState } from '../types/types';

export function OperationButton({ className, style, icon, _onClick }: { className?: string, style?: React.CSSProperties, icon: IconProp, _onClick: () => void }) {
  return (
    <div className={cn(styles.operation_button, className)} onClick={_onClick}>
      <FontAwesomeIcon icon={icon} style={style} />
    </div>
  )
}

export function BackToStartButton({ changeCurrentID, currentID, setInformation }: Pick<TState, "changeCurrentID" | "currentID" | "setInformation">) {
  const _onClick = () => {
    if (currentID !== "START") {
      changeCurrentID("START");
      setInformation({ text: playerInfo.name + " has put the phase back to the first.", ms: 3000 })
    }
  }
  return (
    <OperationButton icon={faStepBackward} _onClick={_onClick} className={cn({
      [styles.disabled]: currentID === "START",
    })} />
  )
}

export function BackButton({ changeCurrentID, currentID, setInformation }: Pick<TState, "changeCurrentID" | "currentID" | "setInformation">) {
  const _onClick = () => {
    if (currentID !== "START") {
      const backID = moves.get(currentID)!.back;
      changeCurrentID(backID);
      setInformation({ text: playerInfo.name + " has put the phase back to the previous.", ms: 3000 })
    }
  }
  return (
    <OperationButton icon={faChevronLeft} _onClick={_onClick} className={cn({
      [styles.disabled]: currentID === "START",
    })} style={{ left: "-2px", fontSize: "110%" }} />
  )
}

export function ForwardButton({ changeCurrentID, currentID, setInformation }: Pick<TState, "changeCurrentID" | "currentID" | "setInformation">) {
  const forwardIDs = moves.get(currentID)!.forward;
  const isDisabled = forwardIDs.length === 0;
  const _onClick = () => {
    if (isDisabled) return;
    changeCurrentID(forwardIDs[0]);
    setInformation({ text: playerInfo.name + " has moved the phase to the next.", ms: 3000 })
  }
  return (
    <OperationButton icon={faChevronRight} _onClick={_onClick} className={cn({
      [styles.disabled]: isDisabled,
    })} style={{ left: "2px", fontSize: "110%" }} />
  )
}

export function GoToLatestButton({ changeCurrentID, currentID, setInformation }: Pick<TState, "changeCurrentID" | "currentID" | "setInformation">) {
  let currentMove = moves.get(currentID)!;
  let forwardIDs = currentMove.forward;
  const isDisabled = forwardIDs.length === 0;
  const _onClick = () => {
    if (isDisabled) return;
    while (forwardIDs.length !== 0) {
      currentMove = moves.get(currentMove.forward[0])!;
      forwardIDs = currentMove.forward;
    }
    changeCurrentID(currentMove.id);
    setInformation({ text: playerInfo.name + " has moved the phase to the latest.", ms: 3000 });
  }
  return (
    <OperationButton icon={faStepForward} _onClick={_onClick} className={cn({
      [styles.disabled]: isDisabled,
    })} />
  )
}

export function ExportKifuButton({ setInformation, currentID }: Pick<TState, "currentID" | "setInformation">) {
  const _onClick = () => {
    let str = "";
    str += gameProperty.csaVersion + "\n";
    str += "N+" + gameProperty.senteName + "\n";
    str += "N-" + gameProperty.goteName + "\n";
    str += "PI\n";

    const arr: string[] = [];
    let currentMove = moves.get(currentID)!;
    while (currentMove.id !== "START") {
      arr.unshift("");
      arr[0] += currentMove.count % 2 === 0 ? "+" : "-";
      arr[0] += "" + currentMove.before.column + currentMove.before.row;
      arr[0] += "" + currentMove.after.column + currentMove.after.row;
      arr[0] += getCSAPieceName(currentMove.after.piece as TPieceAll);
      arr[0] += "\n";
      currentMove = moves.get(currentMove.back)!;
    }
    for (const item of arr) {
      str += item;
    }
    if (process.browser) {
      navigator.clipboard.writeText(str);
    }

    setInformation({
      text: "Exported the Kifu (CSA Format) to the clipbord.",
      color: "#2d8c0d",
      ms: 3000
    })
  }
  return (
    <OperationButton icon={faClipboard} _onClick={_onClick} />
  )
}