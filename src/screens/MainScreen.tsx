import { useState, useEffect, useCallback } from 'react'
import styles from './MainScreen.module.css'

interface MainScreenProps {
  onStart: () => void
  onQuit: () => void
}

const MENU_ITEMS = ['게임 시작', '게임 종료']

function MainScreen({ onStart, onQuit }: MainScreenProps) {
  const [focusedIndex, setFocusedIndex] = useState(0)

  const handleSelect = useCallback((index: number) => {
    if (index === 0) onStart()
    else onQuit()
  }, [onStart, onQuit])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        setFocusedIndex(1)
      } else if (e.key === 'ArrowUp') {
        setFocusedIndex(0)
      } else if (e.key === 'Enter') {
        handleSelect(focusedIndex)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [focusedIndex, handleSelect])

  return (
    <div className={styles.container}>
      <div className={`${styles.cloud} ${styles.cloud1}`} />
      <div className={`${styles.cloud} ${styles.cloud2}`} />
      <div className={`${styles.cloud} ${styles.cloud3}`} />
      <h1 className={styles.title}>PANG</h1>
      <div className={styles.buttonGroup}>
        {MENU_ITEMS.map((label, index) => (
          <button
            key={label}
            className={`${styles.button} ${focusedIndex === index ? styles.buttonFocused : ''}`}
            onClick={() => handleSelect(index)}
            onMouseEnter={() => setFocusedIndex(index)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default MainScreen
