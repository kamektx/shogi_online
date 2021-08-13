import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import React, { useEffect, useMemo, useState } from 'react'
import { ordinal } from '../func/GameFunctions'
import { moves } from '../pages/games/[gameID]'

export type TInfomation = {
  text: string,
  color?: string,
  ms: number
}

let prevTemporaryInfomation: TInfomation | undefined = undefined;

export default function Information({ temporaryInfomation, currentID }: { temporaryInfomation?: TInfomation, currentID: string }) {
  const initialInformation = useMemo(() => {
    return {
      text: moves.get(currentID)!.count !== 1 ? moves.get(currentID)!.name + " has made the " + ordinal(moves.get(currentID)!.count - 1) + " move." : "　",
      color: "#e43342",
      ms: 0,
    } as TInfomation;
  }, [currentID]);

  const [infomation, setInfomation] = useState(initialInformation);

  useEffect(() => {
    if (prevTemporaryInfomation != temporaryInfomation) {
      prevTemporaryInfomation = temporaryInfomation;
      if (temporaryInfomation != undefined) {
        setInfomation(temporaryInfomation);
        if (temporaryInfomation.ms == 0) {
          return;
        }
        const timerID = setTimeout(() => {
          setInfomation(initialInformation);
        }, temporaryInfomation.ms);
        return () => { clearTimeout(timerID) };
      }
    } else {
      setInfomation(initialInformation);
      return;
    }
    return;
  }, [temporaryInfomation, currentID, initialInformation]);

  const myStyle = infomation.color ? { color: infomation.color } : {};
  const myText = infomation.text !== "" ? infomation.text : "　";

  return (
    <div className={styles.infomation} style={myStyle}>
      {myText}
    </div>
  )
}