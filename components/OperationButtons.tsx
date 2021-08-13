import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import { gameProperty, moves, playerInfo } from '../pages/games/[gameID]'
import { ClassNameList } from 'react-select';
import { faChevronLeft, faChevronRight, faStepBackward, faStepForward } from '@fortawesome/free-solid-svg-icons';
import React, { SetStateAction } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { TInfomation } from './Information';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { getCSAPieceName } from '../func/GameFunctions';
import { TPieceAll } from '../types/types';

export function OperationButton({ className, style, icon, _onClick }: { className?: string, style?: React.CSSProperties, icon: IconProp, _onClick: () => void }) {
  return (
    <div className={cn(styles.operation_button, className)} onClick={_onClick}>
      <FontAwesomeIcon icon={icon} style={style} />
    </div>
  )
}

export function BackToStartButton({ transitionToID, currentID, setInfomation }: { transitionToID: (id: string) => boolean, currentID: string, setInfomation: (value: TInfomation) => void }) {
  const _onClick = () => {
    if (currentID !== "START") {
      transitionToID("START");
      setInfomation({ text: playerInfo.name + " has put the phase back to the first.", ms: 3000 })
    }
  }
  return (
    <OperationButton icon={faStepBackward} _onClick={_onClick} className={cn({
      [styles.disabled]: currentID === "START",
    })} />
  )
}

export function BackButton({ transitionToID, currentID, setInfomation }: { transitionToID: (id: string) => boolean, currentID: string, setInfomation: (value: TInfomation) => void }) {
  const _onClick = () => {
    if (currentID !== "START") {
      const backID = moves.get(currentID)!.back;
      transitionToID(backID);
      setInfomation({ text: playerInfo.name + " has put the phase back to the previous.", ms: 3000 })
    }
  }
  return (
    <OperationButton icon={faChevronLeft} _onClick={_onClick} className={cn({
      [styles.disabled]: currentID === "START",
    })} style={{ left: "-2px", fontSize: "110%" }} />
  )
}

export function ForwardButton({ transitionToID, currentID, setInfomation }: { transitionToID: (id: string) => boolean, currentID: string, setInfomation: (value: TInfomation) => void }) {
  const forwardIDs = moves.get(currentID)!.forward;
  const isDisabled = forwardIDs.length === 0;
  const _onClick = () => {
    if (isDisabled) return;
    transitionToID(forwardIDs[0]);
    setInfomation({ text: playerInfo.name + " has moved the phase to the next.", ms: 3000 })
  }
  return (
    <OperationButton icon={faChevronRight} _onClick={_onClick} className={cn({
      [styles.disabled]: isDisabled,
    })} style={{ left: "2px", fontSize: "110%" }} />
  )
}

export function GoToLatestButton({ transitionToID, currentID, setInfomation }: { transitionToID: (id: string) => boolean, currentID: string, setInfomation: (value: TInfomation) => void }) {
  let currentMove = moves.get(currentID)!;
  let forwardIDs = currentMove.forward;
  const isDisabled = forwardIDs.length === 0;
  const _onClick = () => {
    if (isDisabled) return;
    while (forwardIDs.length !== 0) {
      currentMove = moves.get(currentMove.forward[0])!;
      forwardIDs = currentMove.forward;
    }
    transitionToID(currentMove.id);
    setInfomation({ text: playerInfo.name + " has moved the phase to the latest.", ms: 3000 });
  }
  return (
    <OperationButton icon={faStepForward} _onClick={_onClick} className={cn({
      [styles.disabled]: isDisabled,
    })} />
  )
}

export function ExportKifuButton({ setInfomation, currentID }: { setInfomation: (value: TInfomation) => void, currentID: string }) {
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

    setInfomation({
      text: "Exported the Kifu (CSA Format) to the clipbord.",
      color: "#2d8c0d",
      ms: 3000
    })
  }
  return (
    <OperationButton icon={faClipboard} _onClick={_onClick} />
  )
}