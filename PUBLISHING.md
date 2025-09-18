# 📦 Publishing Guide

이 문서는 @snapkit-studio 패키지의 자동화된 발행 시스템에 대한 완전한 가이드입니다.

## 🎯 개요

- **자동화된 발행**: Semantic Release를 통한 완전 자동화
- **Git 기반 변경 감지**: Turbo 없이 순수 Git diff를 사용한 스마트 감지
- **듀얼 레지스트리**: NPM Registry와 GitHub Packages 동시 발행
- **Conventional Commits**: 표준화된 커밋 메시지로 자동 버전 관리

## 🔄 발행 워크플로우

### 1. 트리거 조건

- **자동 트리거**: CI 워크플로우 성공 후 (main 브랜치)
- **수동 트리거**: GitHub Actions의 workflow_dispatch

### 2. 변경사항 감지 로직

#### Git 기반 스마트 감지 (`scripts/update-versions.js`)

```bash
# 이전 커밋과 비교하여 변경된 패키지 감지
git diff --name-only HEAD^
```

**감지 규칙:**

- **개별 패키지 변경**: `packages/core/` → `core` 패키지만 업데이트
- **여러 패키지 변경**: `packages/core/`, `packages/react/` → 해당 패키지들만 업데이트
- **루트 레벨 변경**: `package.json`, `turbo.json` 등 → 모든 패키지 업데이트

**제외 파일:**
- `.github/` (CI 설정)
- `scripts/` (빌드 스크립트)
- `CHANGELOG`, `README` (문서)
- `.git*` (Git 설정)

### 3. 발행 프로세스

#### 3.1 버전 업데이트 (Semantic Release)

```bash
# Conventional Commits 기반 자동 버전 결정
semantic-release
```

#### 3.2 NPM Registry 발행 (`scripts/publish-selective.sh`)

**인증 및 권한 확인:**
```bash
# NPM 토큰 검증
npm whoami --registry https://registry.npmjs.org

# 조직 접근 권한 확인
npm access list packages @snapkit-studio
```

**패키지별 발행:**
```bash
# 각 변경된 패키지에 대해:
1. 디렉터리 존재 확인
2. 빌드 실행 (pnpm build --filter "@snapkit-studio/$package")
3. 현재 버전 확인
4. NPM 발행 (pnpm publish --filter "@snapkit-studio/$package")
5. 기존 버전 중복 확인
```

#### 3.3 GitHub Packages 발행 (`scripts/publish-github-packages.sh`)

**조건부 실행:**
- `PUBLISH_GITHUB_PACKAGES=true` 환경변수로 제어

**인증 방식:**
```bash
# GitHub Token 기반 인증
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
@snapkit-studio:registry=https://npm.pkg.github.com/
```

## 🛠️ 스크립트 상세

### `scripts/update-versions.js`

**주요 기능:**
- Git diff 기반 변경 패키지 감지
- 패키지 버전 업데이트
- 워크스페이스 의존성 동기화
- 드라이런 모드 지원

**사용법:**
```bash
# 드라이런 (변경사항 확인만)
node scripts/update-versions.js --dry-run

# 특정 버전으로 업데이트
node scripts/update-versions.js 1.3.0

# 특정 커밋부터 변경사항 감지
node scripts/update-versions.js 1.3.0 --since=HEAD~3
```

### `scripts/publish-selective.sh`

**에러 처리:**
- NPM 토큰 존재 확인
- 인증 테스트
- 조직 접근 권한 확인
- 패키지별 빌드 검증
- 기존 패키지 중복 확인

### `scripts/publish-github-packages.sh`

**GitHub Packages 전용:**
- 별도 레지스트리 설정
- GitHub Token 인증
- 실패 시 전체 워크플로우 중단 방지

### `scripts/check-npm-permissions.sh`

**권한 진단 도구:**
- NPM 토큰 유효성 검사
- 조직 접근 권한 확인
- 패키지별 발행 권한 확인
- 토큰 타입 분석

## 🔍 문제 해결

### NPM 발행 실패 (E404 에러)

**원인:**
- NPM 토큰에 @snapkit-studio 조직 접근 권한 없음
- 패키지가 존재하지 않거나 권한 없음

**해결 방법:**
```bash
# 권한 확인
bash scripts/check-npm-permissions.sh

# 조직 멤버 추가 필요 시
npm org set @snapkit-studio <username> developer
```

### GitHub Packages 인증 실패

**원인:**
- GITHUB_TOKEN 권한 부족
- packages:write 권한 누락

**해결 방법:**
- GitHub Actions에서 packages:write 권한 확인
- Personal Access Token 사용 시 repo + packages 권한 필요

### 변경사항 감지 오류

**원인:**
- Console 출력이 패키지명으로 인식됨
- Git diff 실행 실패

**해결 방법:**
- Silent 모드 사용: `getChangedPackages('HEAD^', true)`
- Git 히스토리 확인

## 🎮 수동 테스트

### 개발 환경에서 테스트

```bash
# 1. 변경사항 감지 테스트
node scripts/update-versions.js --dry-run

# 2. 빌드 테스트
pnpm build

# 3. 린트 및 타입 체크
pnpm lint && pnpm check-types

# 4. NPM 권한 확인
bash scripts/check-npm-permissions.sh

# 5. 로컬 발행 테스트 (실제 발행은 안 됨)
# NPM_TOKEN을 설정한 후:
bash scripts/publish-selective.sh
```

### CI 환경 변수

**필수 설정:**
- `NPM_TOKEN`: NPM 발행용 토큰
- `GITHUB_TOKEN`: GitHub Packages 발행용 (자동 제공)
- `PUBLISH_GITHUB_PACKAGES`: "true" (GitHub Packages 발행 활성화)

## 📊 발행 현황

### 최근 버전
- `@snapkit-studio/core@1.2.0`
- `@snapkit-studio/react@1.2.0`
- `@snapkit-studio/nextjs@1.2.0`

### 지원 레지스트리
- **NPM Registry**: https://www.npmjs.com/org/snapkit-studio
- **GitHub Packages**: https://github.com/orgs/snapkit-studio/packages

## 🔧 유지보수

### 정기 확인 사항
1. NPM 토큰 만료일 확인
2. GitHub Actions 권한 상태
3. 패키지 의존성 업데이트
4. Semantic Release 설정 검토

### 스크립트 업데이트 시 주의사항
- Silent 모드 유지 (console 출력 오염 방지)
- 에러 처리 로직 보존
- 테스트 환경에서 검증 후 적용