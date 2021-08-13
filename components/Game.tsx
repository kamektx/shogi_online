import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faDownload, faStepBackward, faStepForward } from '@fortawesome/free-solid-svg-icons'
import { faClipboard, faLightbulb } from '@fortawesome/free-regular-svg-icons'
import Select from 'react-select'
import MyHead from '../components/MyHead'
import Board from '../components/Board'
import TurnCounter from './TurnCounter'
import { BackButton, BackToStartButton, ExportKifuButton, ForwardButton, GoToLatestButton } from './OperationButtons'
import { useCallback, useState } from 'react'
import { TMove, TPieceFace } from '../types/types'
import { getNariPiece, makeNewMove, ordinal } from '../func/GameFunctions'
import { moves, playerInfo } from '../pages/games/[gameID]'
import Information, { TInfomation } from './Information'

export default function Game({ transitionToID, currentID }: { transitionToID: (id: string) => boolean, currentID: string }) {
  const [selectionNariFunari, setSelectionNariFunari] = useState<{
    isSelecting: boolean,
    move?: TMove,
    callback?: (move: TMove) => void;
  }>({ isSelecting: false });

  const [isEnteringName, setIsEnteringName] = useState(true);
  const [nameValue, setNameValue] = useState("");

  const [infomation, setInfomation] = useState<TInfomation | undefined>(undefined);

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]

  const _onSelectNariFunari = (move: TMove, callback: (move: TMove) => void) => {
    setSelectionNariFunari({
      isSelecting: true,
      move: move,
      callback: callback,
    });
  }

  const _onClickNariFunariButton = (natta: boolean) => {
    if (!selectionNariFunari.isSelecting) return;
    const move = selectionNariFunari.move!;
    move.natta = natta;
    if (natta) {
      move.after.piece = getNariPiece(move.before.piece as TPieceFace);
    } else {
      move.after.piece = move.before.piece;
    }
    selectionNariFunari.callback!(move);
    setSelectionNariFunari({ isSelecting: false });
  }

  const _onEnterName = () => {
    playerInfo.name = nameValue;
    setIsEnteringName(false);
  }

  return (
    <div className={styles.container}>

      <header className={cn(styles.header, styles.header_footer)}>
        <div className={styles.wrap}>
          <div className={styles.header_footer_main}>
            <BackToStartButton setInfomation={setInfomation} transitionToID={transitionToID} currentID={currentID} />
            <BackButton setInfomation={setInfomation} transitionToID={transitionToID} currentID={currentID}></BackButton>
            <TurnCounter currentID={currentID}></TurnCounter>
            <ForwardButton setInfomation={setInfomation} transitionToID={transitionToID} currentID={currentID} />
            <GoToLatestButton setInfomation={setInfomation} transitionToID={transitionToID} currentID={currentID} />
          </div>
        </div>
        <Information temporaryInfomation={infomation} currentID={currentID} />
      </header>

      <main className={cn(styles.main, styles.wrap)}>
        <Board transitionToID={transitionToID} currentID={currentID} _onSelectNariFunari={_onSelectNariFunari} />
      </main>

      <footer className={cn(styles.footer, styles.header_footer)}>
        <div className={styles.wrap}>
          <div className={styles.header_footer_main}>
            <ExportKifuButton setInfomation={setInfomation} currentID={currentID} />
            <div className={styles.operation_button}><Icon icon={faLightbulb} /></div>
            <Select className={styles.select} options={options} menuPlacement="top" isSearchable={false}></Select>
          </div>
        </div>
      </footer>
      <div className={cn(styles.nari_funari_popup, styles.popup, {
        [styles.disabled]: !selectionNariFunari.isSelecting,
      })}>
        <div className={styles.wrap}>
          <div className={cn(styles.nari_funari_button, styles.button)} onClick={() => _onClickNariFunariButton(true)}>
            <div>{selectionNariFunari.move != undefined ? getNariPiece(selectionNariFunari.move?.before.piece as TPieceFace) : ""}</div>
          </div>
          <div className={cn(styles.nari_funari_button, styles.button)} onClick={() => _onClickNariFunariButton(false)}>
            <div>{selectionNariFunari.move?.before.piece}</div>
          </div>
        </div>
      </div>
      <div className={cn(styles.enter_name_popup, styles.popup, {
        [styles.disabled]: !isEnteringName,
      })}>
        <div className={styles.wrap}>
          <div className={styles.label}>Input your name:</div>
          <div className={styles.text_input_wrap}>
            <input type="text" className={cn(styles.name_field, styles.text_field)} value={nameValue}
              onChange={
                e => setNameValue(e.target.value)
              }
              onKeyPress={
                e => {
                  if (e.key == 'Enter') {
                    e.preventDefault()
                    _onEnterName();
                  }
                }
              } />
          </div>
          <div className={cn(styles.enter_button, styles.button)}
            onClick={() => _onEnterName()}>
            <div>Enter</div>
          </div>
        </div>
      </div>
    </div >
  )
}
