import { useEffect, useRef } from 'react'

const CANVAS_WIDTH = 640
const CANVAS_HEIGHT = 480
const FLOOR_Y = 440
const FLOOR_HEIGHT = CANVAS_HEIGHT - FLOOR_Y

const PLAYER_SPEED = 4
const PLAYER_INIT_X = 320
const PLAYER_HALF_WIDTH = 15

const WIRE_SPEED = 8

// 캐릭터 부위별 Y 좌표 (FLOOR_Y 기준 위로)
const HEAD_CENTER_Y = FLOOR_Y - 41
const HEAD_RADIUS = 7
const SHOULDER_Y = FLOOR_Y - 30
const HIP_Y = FLOOR_Y - 14
const ARM_END_Y = FLOOR_Y - 20

interface Wire {
  x: number
  tipY: number
}

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  x: number,
  walkFrame: number,
  isWalking: boolean,
  isShooting: boolean
) {
  const poseA = isWalking && walkFrame % 20 < 10

  ctx.lineCap = 'round'

  // 다리
  ctx.strokeStyle = '#C0392B'
  ctx.lineWidth = 3
  ctx.beginPath()
  if (isWalking) {
    if (poseA) {
      ctx.moveTo(x, HIP_Y); ctx.lineTo(x - 12, FLOOR_Y)
      ctx.moveTo(x, HIP_Y); ctx.lineTo(x + 5,  FLOOR_Y)
    } else {
      ctx.moveTo(x, HIP_Y); ctx.lineTo(x - 5,  FLOOR_Y)
      ctx.moveTo(x, HIP_Y); ctx.lineTo(x + 12, FLOOR_Y)
    }
  } else {
    ctx.moveTo(x, HIP_Y); ctx.lineTo(x - 6, FLOOR_Y)
    ctx.moveTo(x, HIP_Y); ctx.lineTo(x + 6, FLOOR_Y)
  }
  ctx.stroke()

  // 몸통
  ctx.strokeStyle = '#E74C3C'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(x, SHOULDER_Y)
  ctx.lineTo(x, HIP_Y)
  ctx.stroke()

  // 팔
  ctx.strokeStyle = '#C0392B'
  ctx.lineWidth = 3
  ctx.beginPath()
  if (isShooting) {
    // 발사 자세: 양팔을 머리 위로
    ctx.moveTo(x, SHOULDER_Y); ctx.lineTo(x - 6, HEAD_CENTER_Y - 4)
    ctx.moveTo(x, SHOULDER_Y); ctx.lineTo(x + 6, HEAD_CENTER_Y - 4)
  } else if (isWalking) {
    if (poseA) {
      ctx.moveTo(x, SHOULDER_Y); ctx.lineTo(x - 8, ARM_END_Y + 4)
      ctx.moveTo(x, SHOULDER_Y); ctx.lineTo(x + 8, ARM_END_Y - 4)
    } else {
      ctx.moveTo(x, SHOULDER_Y); ctx.lineTo(x - 8, ARM_END_Y - 4)
      ctx.moveTo(x, SHOULDER_Y); ctx.lineTo(x + 8, ARM_END_Y + 4)
    }
  } else {
    ctx.moveTo(x, SHOULDER_Y); ctx.lineTo(x - 8, ARM_END_Y)
    ctx.moveTo(x, SHOULDER_Y); ctx.lineTo(x + 8, ARM_END_Y)
  }
  ctx.stroke()

  // 머리
  ctx.beginPath()
  ctx.arc(x, HEAD_CENTER_Y, HEAD_RADIUS, 0, Math.PI * 2)
  ctx.fillStyle = '#F5CBA7'
  ctx.fill()
  ctx.strokeStyle = '#C0392B'
  ctx.lineWidth = 2
  ctx.stroke()
}

function drawWire(ctx: CanvasRenderingContext2D, wire: Wire) {
  // 와이어 선
  ctx.strokeStyle = '#FFD700'
  ctx.lineWidth = 2
  ctx.lineCap = 'butt'
  ctx.beginPath()
  ctx.moveTo(wire.x, SHOULDER_Y)
  ctx.lineTo(wire.x, wire.tipY)
  ctx.stroke()

  // 화살촉 (삼각형)
  ctx.fillStyle = '#FFD700'
  ctx.beginPath()
  ctx.moveTo(wire.x,     wire.tipY - 10)
  ctx.lineTo(wire.x - 4, wire.tipY)
  ctx.lineTo(wire.x + 4, wire.tipY)
  ctx.closePath()
  ctx.fill()
}

function GameScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const playerRef = useRef({ x: PLAYER_INIT_X, walkFrame: 0 })
  const pressedKeysRef = useRef(new Set<string>())
  const wireRef = useRef<Wire | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const handleKeyDown = (e: KeyboardEvent) => {
      pressedKeysRef.current.add(e.key)
      if (e.key === ' ' && wireRef.current === null) {
        wireRef.current = { x: playerRef.current.x, tipY: SHOULDER_Y }
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => pressedKeysRef.current.delete(e.key)

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    let animationId: number

    const draw = () => {
      const keys = pressedKeysRef.current
      const player = playerRef.current
      const isShooting = wireRef.current !== null
      let isWalking = false

      // 와이어 활성화 중에는 이동 불가
      if (!isShooting) {
        if (keys.has('ArrowLeft')) {
          player.x = Math.max(PLAYER_HALF_WIDTH, player.x - PLAYER_SPEED)
          isWalking = true
        }
        if (keys.has('ArrowRight')) {
          player.x = Math.min(CANVAS_WIDTH - PLAYER_HALF_WIDTH, player.x + PLAYER_SPEED)
          isWalking = true
        }
      }

      if (isWalking) player.walkFrame++
      else player.walkFrame = 0

      // 와이어 업데이트
      if (wireRef.current !== null) {
        wireRef.current.tipY -= WIRE_SPEED
        if (wireRef.current.tipY <= 0) {
          wireRef.current = null
        }
      }

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

      // 와이어 렌더링
      if (wireRef.current !== null) {
        drawWire(ctx, wireRef.current)
      }

      // 플레이어 렌더링
      drawPlayer(ctx, player.x, player.walkFrame, isWalking, isShooting)

      animationId = requestAnimationFrame(draw)
    }

    animationId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
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
