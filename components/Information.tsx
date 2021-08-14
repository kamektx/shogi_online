import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import React, { useEffect, useMemo, useState } from 'react'
import { ordinal } from '../func/GameFunctions'
import { moves } from '../pages/games/[gameID]'

export type TInformation = {
  text: string,
  color?: string,
  ms: number
}

let prevTemporaryInformation: TInformation | undefined = undefined;

export default function Information({ temporaryInformation, currentID }: { temporaryInformation?: TInformation, currentID: string }) {
  const initialInformation = {
    text: "　",
    color: "#e43342",
    ms: 0,
  } as TInformation;

  const [information, setInformation] = useState(initialInformation);

  useEffect(() => {
    const defaultInformation = {
      text: moves.get(currentID)!.count !== 1 ? moves.get(currentID)!.name + " has made the " + ordinal(moves.get(currentID)!.count - 1) + " move." : "　",
      color: "#e43342",
      ms: 0,
    } as TInformation;
    if (prevTemporaryInformation != temporaryInformation) {
      prevTemporaryInformation = temporaryInformation;
      if (temporaryInformation != undefined) {
        setInformation(temporaryInformation);
        if (temporaryInformation.ms == 0) {
          return;
        }
        const timerID = setTimeout(() => {
          setInformation(defaultInformation);
        }, temporaryInformation.ms);
        return () => { clearTimeout(timerID) };
      }
      setInformation(defaultInformation);
    } else {
      setInformation(defaultInformation);
      return;
    }
  }, [temporaryInformation, currentID]);

  const myStyle = information.color ? { color: information.color } : {};
  const myText = information.text !== "" ? information.text : "　";

  return (
    <div className={styles.information} style={myStyle}>
      {myText}
    </div>
  )
}