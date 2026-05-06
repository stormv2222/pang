# Phase 5 설계 - 공(버블) 등장 및 바운스 물리

## 목표

게임 화면에 대(Large) 공 1개가 등장하여  
중력과 반사를 적용한 포물선 궤도로 자연스럽게 튀어다닌다.

---

## 공 스펙 (Large)

| 항목 | 값 |
|------|-----|
| 크기 | 반지름 24px |
| 색상 | `#FF6B35` (주황) / 테두리 `#CC4400` |
| 초기 위치 | x: 160, y: FLOOR_Y - 24 (바닥 위) |
| 초기 수평 속도 (vx) | 2px / 프레임 (오른쪽 방향) |
| 초기 수직 속도 (vy) | -10px / 프레임 (위쪽 방향) |
| 중력 (gravity) | +0.3px / 프레임² |

---

## 물리 규칙

### 매 프레임 업데이트

```
vy += gravity          // 중력 적용
x  += vx               // 수평 이동
y  += vy               // 수직 이동
```

### 반사 조건

| 충돌 대상 | 조건 | 처리 |
|-----------|------|------|
| 바닥 | `y + radius >= FLOOR_Y` | `y = FLOOR_Y - radius`, `vy = -bouncePower` |
| 천장 | `y - radius <= 0` | `y = radius`, `vy = Math.abs(vy)` |
| 왼쪽 벽 | `x - radius <= 0` | `x = radius`, `vx = Math.abs(vx)` |
| 오른쪽 벽 | `x + radius >= CANVAS_WIDTH` | `x = CANVAS_WIDTH - radius`, `vx = -Math.abs(vx)` |

- **바닥 반사**: 매번 동일한 높이로 튀도록 `vy`를 고정값(`-bouncePower`)으로 리셋
- `bouncePower`: 10 (초기 수직 속도와 동일)

---

## 좌표 기준

```
y=0       ──────────────────── 천장
           ↗         ↘
          ↗    공 궤도  ↘
         ↗              ↘
y=416  ──────────────────── 바닥 (FLOOR_Y - radius = 440 - 24)
```

- 공의 y는 중심점 기준
- 바닥 접촉: `y = FLOOR_Y - radius`

---

## 상태 관리

```ts
interface Ball {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

const ballsRef = useRef<Ball[]>([
  { x: 160, y: FLOOR_Y - 24, vx: 2, vy: -10, radius: 24 }
])
```

- 추후 분열 시 배열에 공 추가 방식으로 확장 가능하도록 배열로 관리

---

## 렌더링

```ts
// 공 그리기
ctx.beginPath()
ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
ctx.fillStyle = '#FF6B35'
ctx.fill()
ctx.strokeStyle = '#CC4400'
ctx.lineWidth = 2
ctx.stroke()
```

---

## 게임 루프 흐름

```
draw() 매 프레임
  ├── 플레이어 이동
  ├── 와이어 업데이트
  ├── 공 물리 업데이트 (gravity, 이동, 반사)
  ├── 배경 렌더링
  ├── 공 렌더링
  ├── 와이어 렌더링
  └── 플레이어 렌더링
```

---

## 파일 구조

```
src/
  App.tsx                    (변경 없음)
  screens/
    GameScreen.tsx           (수정)
    MainScreen.tsx           (변경 없음)
    MainScreen.module.css    (변경 없음)
```

### GameScreen.tsx 변경 내용
- `Ball` 인터페이스 추가
- `ballsRef` 추가 (배열로 관리)
- 게임 루프에 공 물리 업데이트 및 렌더링 추가

---

## 검토 요청 사항

- 공의 초기 수평 속도 **2px/프레임**, 수직 속도 **10px/프레임**이 적절한가?
- 중력값 **0.3px/프레임²**이 자연스러운가?
- 공 크기(반지름 **24px**)와 색상(`#FF6B35`)이 적절한가?
