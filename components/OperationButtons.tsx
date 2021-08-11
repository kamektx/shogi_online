import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import { moves } from '../pages'
import { ClassNameList } from 'react-select';
import { faChevronLeft, faStepBackward } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export function OperationButton({ className, style, icon, onClick }: { className?: string, style?: React.CSSProperties, icon: IconProp, onClick: () => void }) {
  return (
    <div className={cn(styles.operation_button, className)} onClick={onClick}>
      <FontAwesomeIcon icon={icon} style={style} />
    </div>
  )
}

export function BackToStartButton({ transitionToID }: { transitionToID: (id: string) => boolean }) {
  const onClick = () => {
    transitionToID("START");
  }
  return (
    <OperationButton icon={faStepBackward} onClick={onClick} />
  )
}