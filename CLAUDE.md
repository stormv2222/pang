# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 기술 스택

- **프레임워크**: React 18 + Vite 6
- **언어**: TypeScript 5.6
- **빌드 도구**: Vite (`@vitejs/plugin-react` 사용)

## 주요 명령어

```bash
npm run dev       # 개발 서버 실행 (기본 포트: http://localhost:5173)
npm run build     # 프로덕션 빌드 (tsc 타입 체크 후 Vite 번들링)
npm run preview   # 프로덕션 빌드 결과물 로컬 미리보기
```

## 타입 체크

별도의 테스트 프레임워크는 없으며, TypeScript 컴파일러로 타입 오류를 검증한다.

```bash
npx tsc -b        # 전체 타입 체크 (tsconfig.app.json + tsconfig.node.json 기준)
```

## 프로젝트 구조

```
src/
  main.tsx        # React 앱 진입점, #root에 마운트
  App.tsx         # 루트 컴포넌트
  vite-env.d.ts   # Vite 클라이언트 타입 선언
index.html        # Vite HTML 진입점
vite.config.ts    # Vite 설정
tsconfig.json     # TypeScript 프로젝트 참조 루트 (app + node 분리 구조)
```

## TypeScript 설정 구조

`tsconfig.json`은 두 개의 하위 설정을 참조하는 루트 파일이다.

- `tsconfig.app.json` — `src/` 대상, JSX(`react-jsx`), strict 모드
- `tsconfig.node.json` — `vite.config.ts` 대상, Node 환경 설정

## 기획 문서

| 파일 | 설명 |
|------|------|
| `docs/PRD.md` | 게임 전체 요구사항 및 구현 범위 |
| `docs/PLAN.md` | Phase별 개발 목표 및 계획 |
| `docs/FEATURES/main.md` | 메인 화면 구성 |
| `docs/FEATURES/game_rule.md` | 게임 룰 상세 (공 시스템, 플레이어, 점수 등) |
| `docs/FEATURES/mission1.md` | Mission 1 난이도 및 스테이지별 규칙 |

## 설계 문서

`docs/design/` 디렉토리에 Phase별 설계 문서를 관리한다.  
각 파일은 `phase{N}.md` 형식으로 작성되며, 개발 전 검토 후 구현에 진입한다.  
파일 내 **검토 요청 사항** 항목을 고객이 확인하고 피드백을 준다.
