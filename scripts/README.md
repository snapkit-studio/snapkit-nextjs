# Release Scripts

이 디렉터리에는 Changesets 기반 릴리즈 시스템을 지원하는 스크립트들이 포함되어 있습니다.

## 🦋 **Changesets 통합 시스템**

이제 **Changesets**를 메인 릴리즈 도구로 사용하며, 여기의 스크립트들은 보조 역할을 합니다.

## 🚀 prepare-release.js

Changesets와 통합된 릴리즈 준비 스크립트입니다.

### 주요 기능

1. **@repo/ 의존성 제거**: 릴리즈 시 `@repo/eslint-config` 등 workspace 전용 의존성을 완전히 제거
2. **workspace:* 변환**: `workspace:*`를 해당 패키지의 최신 버전으로 자동 변환
3. **릴리즈 준비 파일 생성**: `.release.json` 파일로 릴리즈 준비된 package.json 생성

### 사용법

```bash
# 릴리즈 준비 (기본 명령어)
npm run prepare-release
# 또는
node scripts/prepare-release.js prepare

# 임시 파일 정리
npm run release-cleanup
# 또는
node scripts/prepare-release.js cleanup

# 도움말
node scripts/prepare-release.js help
```

### 작동 과정

1. **의존성 매핑 구축**: 각 패키지의 최신 버전을 자동으로 감지
   ```
   📋 Mapped @snapkit-studio/core → ^1.8.0
   📋 Mapped @snapkit-studio/react → ^1.6.5
   📋 Mapped @snapkit-studio/nextjs → ^1.6.0
   ```

2. **패키지별 변환 실행**:
   - `@repo/eslint-config` 등 @repo/ 의존성 제거
   - `workspace:*` → 구체적 버전으로 변환
   - 빈 dependency 객체 제거

3. **결과 파일 생성**:
   - `packages/core/package.release.json`
   - `packages/react/package.release.json`
   - `packages/nextjs/package.release.json`

### 예시 변환

**변환 전 (개발용)**:
```json
{
  "dependencies": {
    "@snapkit-studio/core": "workspace:*"
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*"
  }
}
```

**변환 후 (릴리즈용)**:
```json
{
  "dependencies": {
    "@snapkit-studio/core": "^1.8.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tsup": "8.5.0"
  }
}
```

## 📋 릴리즈 워크플로우

### 1. 릴리즈 준비
```bash
npm run prepare-release
```

### 2. 릴리즈 파일 검토
생성된 `.release.json` 파일들을 검토하여 의존성이 올바르게 변환되었는지 확인

### 3. 릴리즈 실행
```bash
# 각 패키지에서 실행
cd packages/core
cp package.release.json package.json
npm publish
git restore package.json
```

### 4. 정리
```bash
npm run release-cleanup
```

## 🔧 기존 스크립트들

### prepare-publication.js (기존)
- 하드코딩된 버전 매핑 사용
- @repo/ 의존성 처리 불완전

### prepare-release.js (신규)
- 동적 버전 감지
- 완전한 @repo/ 의존성 제거
- 더 간단한 CLI 인터페이스

## 📝 설정

`PUBLISHABLE_PACKAGES` 배열에서 릴리즈할 패키지 목록을 관리합니다:

```javascript
const PUBLISHABLE_PACKAGES = [
  {
    name: '@snapkit-studio/core',
    directory: 'packages/core'
  },
  {
    name: '@snapkit-studio/react',
    directory: 'packages/react'
  },
  {
    name: '@snapkit-studio/nextjs',
    directory: 'packages/nextjs'
  }
];
```

새로운 패키지를 추가하려면 이 배열에 항목을 추가하면 됩니다.