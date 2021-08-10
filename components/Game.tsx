import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faDownload, faStepBackward, faStepForward } from '@fortawesome/free-solid-svg-icons'
import { faClipboard, faLightbulb } from '@fortawesome/free-regular-svg-icons'
import Select from 'react-select'
import MyHead from '../components/MyHead'
import Board from '../components/Board'

export default function Game() {

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]


  return (
    <div className={styles.container}>

      <header className={cn(styles.header, styles.header_footer)}>
        <div className={styles.header_footer_main}>
          <div className={styles.operation_button}><Icon icon={faStepBackward} /></div>
          <div className={styles.operation_button}><Icon icon={faChevronLeft} style={{ left: "-2px", fontSize: "110%" }} /></div>
          <div className={styles.condition}>▽ 32</div>
          <div className={styles.operation_button}><Icon icon={faChevronRight} style={{ left: "2px", fontSize: "110%" }} /></div>
          <div className={styles.operation_button}><Icon icon={faStepForward} /></div>
        </div>
      </header>

      <main className={styles.main}>
        <Board />
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
