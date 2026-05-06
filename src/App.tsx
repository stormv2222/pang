import { useState } from 'react'
import MainScreen from './screens/MainScreen'
import GameScreen from './screens/GameScreen'

type Screen = 'main' | 'game'

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('main')

  const handleStart = () => {
    setCurrentScreen('game')
  }

  const handleQuit = () => {
    const confirmed = window.confirm('게임을 종료하시겠습니까?')
    if (confirmed) {
      window.close()
      // window.close()가 동작하지 않는 경우 안내 문구 표시
      alert('브라우저 탭을 직접 닫아주세요.')
    }
  }

  return (
    <div style={styles.wrapper}>
      {currentScreen === 'main' && (
        <MainScreen onStart={handleStart} onQuit={handleQuit} />
      )}
      {currentScreen === 'game' && (
        <GameScreen />
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#0d0d0d',
    margin: 0,
  },
}

export default App
