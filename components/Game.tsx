import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faDownload, faStepBackward, faStepForward } from '@fortawesome/free-solid-svg-icons'
import { faClipboard, faLightbulb } from '@fortawesome/free-regular-svg-icons'
import Select from 'react-select'
import MyHead from '../components/MyHead'
import Board from '../components/Board'
import TurnCounter from './TurnCounter'
import { BackToStartButton } from './OperationButtons'

export default function Game({ transitionToID, currentID }: { transitionToID: (id: string) => boolean, currentID: string }) {

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]


  return (
    <div className={styles.container}>

      <header className={cn(styles.header, styles.header_footer)}>
        <div className={styles.header_footer_main}>
          <BackToStartButton transitionToID={transitionToID} />
          <div className={styles.operation_button}><Icon icon={faChevronLeft} style={{ left: "-2px", fontSize: "110%" }} /></div>
          <TurnCounter currentID={currentID}></TurnCounter>
          <div className={styles.operation_button}><Icon icon={faChevronRight} style={{ left: "2px", fontSize: "110%" }} /></div>
          <div className={styles.operation_button}><Icon icon={faStepForward} /></div>
        </div>
      </header>

      <main className={styles.main}>
        <Board transitionToID={transitionToID} currentID={currentID} />
      </main>

      <footer className={cn(styles.footer, styles.header_footer)}>
        <div className={styles.header_footer_main}>
          <div className={styles.operation_button}><Icon icon={faClipboard} /></div>
          <div className={styles.operation_button}><Icon icon={faLightbulb} /></div>
          <Select className={styles.select} options={options} menuPlacement="top"></Select>
        </div>
      </footer>
    </div>
  )
}
