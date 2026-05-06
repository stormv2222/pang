import { useEffect, useRef } from 'react'

const CANVAS_WIDTH = 640
const CANVAS_HEIGHT = 480
const FLOOR_Y = 440
const FLOOR_HEIGHT = CANVAS_HEIGHT - FLOOR_Y

function GameScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const draw = () => {
      // 하늘 그라데이션
      const skyGradient = ctx.createLinearGradient(0, 0, 0, FLOOR_Y)
      skyGradient.addColorStop(0, '#4A90D9')
      skyGradient.addColorStop(0.5, '#87CEEB')
      skyGradient.addColorStop(1, '#D4EDFF')
      ctx.fillStyle = skyGradient
      ctx.fillRect(0, 0, CANVAS_WIDTH, FLOOR_Y)

      // 바닥
      ctx.fillStyle = '#8B7355'
      ctx.fillRect(0, FLOOR_Y, CANVAS_WIDTH, FLOOR_HEIGHT)

      // 바닥 경계선
      ctx.fillStyle = '#5C4A2A'
      ctx.fillRect(0, FLOOR_Y, CANVAS_WIDTH, 3)

      animationId = requestAnimationFrame(draw)
    }

    animationId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
    />
  )
}

export default GameScreen
