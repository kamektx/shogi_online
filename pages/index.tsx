import styles from '../styles/Home.module.scss'
import cn from 'classnames'
import MyHead from '../components/MyHead'
import { createID } from '../func/GameFunctions'
import { useRouter } from 'next/dist/client/router'

export default function Home() {
  const router = useRouter()
  const _onCreateRoom = () => {
    const gameID = createID();
    router.push("/games/" + gameID);
  }

  return (
    <>
      <MyHead />
      <div className={styles.container}>
        <div className={cn(styles.create_room_popup, styles.popup)}>
          <div className={styles.wrap}>
            <div className={cn(styles.button)}
              onClick={() => _onCreateRoom()}>
              <div>Create new room</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}