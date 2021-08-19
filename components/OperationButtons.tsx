import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import { gameProperty, moves, playerInfo } from '../pages/games/[gameID]'
import { ClassNameList } from 'react-select';
import { faChevronLeft, faChevronRight, faStepBackward, faStepForward, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import React, { SetStateAction } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { getCSAPieceName } from '../func/GameFunctions';
import { TPieceAll, TState } from '../types/types';
import { useState } from 'react';
import { useEffect } from 'react';

export function OperationButton({ className, style, icon, _onClick }: { className?: string, style?: React.CSSProperties, icon: IconProp, _onClick: () => void }) {
  return (
    <div className={cn(styles.operation_button, className)} onPointerDown={_onClick}>
      <FontAwesomeIcon icon={icon} style={style} />
    </div>
  )
}

export function BackToStartButton({ changeCurrentID, currentID }: Pick<TState, "changeCurrentID" | "currentID">) {
  const _onClick = () => {
    if (currentID !== "START") {
      changeCurrentID("START", "start");
    }
  }
  return (
    <OperationButton icon={faStepBackward} _onClick={_onClick} className={cn({
      [styles.disabled]: currentID === "START",
    })} />
  )
}

export function BackButton({ changeCurrentID, currentID }: Pick<TState, "changeCurrentID" | "currentID">) {
  const _onClick = () => {
    if (currentID !== "START") {
      const backID = moves.get(currentID)!.back;
      changeCurrentID(backID, "back");
    }
  }
  return (
    <OperationButton icon={faChevronLeft} _onClick={_onClick} className={cn({
      [styles.disabled]: currentID === "START",
    })} style={{ left: "-2px", fontSize: "110%" }} />
  )
}

export function ForwardButton({ changeCurrentID, currentID, forwardMenuOpened, setForwardMenuOpened }: Pick<TState, "changeCurrentID" | "currentID" | "forwardMenuOpened" | "setForwardMenuOpened">) {

  useEffect(() => {
    setForwardMenuOpened(false);
  }, [currentID]);
  const forwardIDs = moves.get(currentID)!.forward;
  const isDisabled = forwardIDs.length === 0;
  const _onClick = () => {
    if (isDisabled) return;
    if (forwardMenuOpened) {
      setForwardMenuOpened(false);
      return;
    }
    if (forwardIDs.length === 1) {
      changeCurrentID(forwardIDs[0], "forward");
      return;
    }
    setForwardMenuOpened(true);
    return;
  }
  return (
    <OperationButton icon={faChevronRight} _onClick={_onClick} className={cn({
      [styles.disabled]: isDisabled,
      [styles.menu_opened]: forwardMenuOpened,
    })} style={{ left: "2px", fontSize: "110%" }} />
  )
}

export function GoToLatestButton({ changeCurrentID, currentID }: Pick<TState, "changeCurrentID" | "currentID">) {
  let currentMove = moves.get(currentID)!;
  let forwardIDs = currentMove.forward;
  const isDisabled = forwardIDs.length === 0;
  const _onClick = () => {
    if (isDisabled) return;
    while (forwardIDs.length !== 0) {
      currentMove = moves.get(currentMove.forward[0])!;
      forwardIDs = currentMove.forward;
    }
    changeCurrentID(currentMove.id, "latest");
  }
  return (
    <OperationButton icon={faStepForward} _onClick={_onClick} className={cn({
      [styles.disabled]: isDisabled,
    })} />
  )
}

export function ReverseButton({ isReversed, setIsReversed }: Pick<TState, "isReversed" | "setIsReversed">) {
  const _onClick = () => {
    setIsReversed(isReversed ? false : true);
  }
  return (
    <OperationButton icon={faSyncAlt} _onClick={_onClick} />
  )
}

export function ExportKifuButton({ setTemporaryInformation, currentID }: Pick<TState, "currentID" | "setTemporaryInformation">) {
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
      arr[0] += "" + (currentMove.before.column % 100) + (currentMove.before.row % 100);
      arr[0] += "" + (currentMove.after.column % 100) + (currentMove.after.row % 100);
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

    setTemporaryInformation({
      text: "Exported the Kifu (CSA Format) to the clipbord.",
      color: "#2d8c0d",
      ms: 3000
    })
  }
  return (
    <OperationButton icon={faClipboard} _onClick={_onClick} />
  )
}