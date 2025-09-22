# GitHub Branch Protection Rules for NPM Publish Readiness

## Main Branch Protection Settings

GitHub 저장소의 Settings → Branches에서 main 브랜치에 다음 규칙을 적용하세요:

### Required Status Checks

다음 체크들이 모두 통과해야 병합 가능:

1. **Check NPM Publish Readiness**
   - 모든 패키지 빌드 성공
   - 테스트 통과
   - TypeScript 타입 체크
   - ESLint 검사
   - 퍼블리시 준비 검증

2. **Test Installation Matrix**
   - Node.js 18, 20, 22 버전에서 테스트
   - npm, yarn, pnpm 패키지 매니저로 설치 테스트

3. **Check for Breaking Changes**
   - API 변경사항 확인
   - 제거된 exports 감지

4. **NPM Publish Dry Run**
   - 실제 퍼블리시 시뮬레이션
   - 패키지 크기 확인

### Branch Protection Rule 설정 방법

1. GitHub 저장소 페이지에서 Settings 탭 클릭
2. 왼쪽 메뉴에서 "Branches" 선택
3. "Add rule" 버튼 클릭
4. Branch name pattern: `main` 입력
5. 다음 옵션들 체크:

   ✅ **Require a pull request before merging**
   - ✅ Require approvals (최소 1명)
   - ✅ Dismiss stale pull request approvals when new commits are pushed

   ✅ **Require status checks to pass before merging**
   - ✅ Require branches to be up to date before merging
   - 다음 status checks 선택:
     - `Check NPM Publish Readiness`
     - `Test Installation - 18 / npm`
     - `Test Installation - 18 / yarn`
     - `Test Installation - 18 / pnpm`
     - `Test Installation - 20 / npm`
     - `Test Installation - 20 / yarn`
     - `Test Installation - 20 / pnpm`
     - `Test Installation - 22 / npm`
     - `Test Installation - 22 / yarn`
     - `Test Installation - 22 / pnpm`
     - `Check for Breaking Changes`
     - `NPM Publish Dry Run`

   ✅ **Require conversation resolution before merging**

   ✅ **Include administrators** (선택사항)
   - 관리자도 규칙을 따르도록 강제

6. "Create" 버튼 클릭하여 규칙 생성

### GitHub CLI로 설정하기

```bash
# GitHub CLI로 branch protection rule 설정
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Check NPM Publish Readiness","NPM Publish Dry Run","Check for Breaking Changes"]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false
```

## Workflow 실행 확인 사항

### 자동 실행 조건

PR이 다음 파일들을 수정했을 때 자동으로 실행됩니다:

- `packages/**` - 패키지 코드 변경
- `scripts/**` - 빌드/퍼블리시 스크립트 변경
- `pnpm-lock.yaml` - 의존성 변경
- `.github/workflows/npm-publish-readiness.yml` - 워크플로우 자체 변경

### 수동 실행 방법

필요시 Actions 탭에서 수동으로 실행 가능:

1. Actions 탭 → "NPM Publish Readiness Check" 선택
2. "Run workflow" 버튼 클릭
3. 브랜치 선택 후 실행

## 체크 실패 시 대응 방법

### 1. Build 실패

```bash
pnpm build
```

### 2. Test 실패

```bash
pnpm test
```

### 3. Type Check 실패

```bash
pnpm check-types
```

### 4. Lint 실패

```bash
pnpm lint
# 자동 수정
pnpm lint --fix
```

### 5. Publication Test 실패

```bash
node scripts/prepare-publication.js
node scripts/test-publication.js
node scripts/simulate-external-install.js
```

### 6. Breaking Changes 감지

- 버전 번호를 적절히 업데이트 (major/minor/patch)
- CHANGELOG 업데이트
- Migration guide 작성 (필요시)

## 워크플로우 특징

### 🎯 포괄적인 검증

- 빌드, 테스트, 린트, 타입 체크
- 퍼블리시 준비 상태 검증
- 외부 설치 시뮬레이션
- 다양한 Node.js 버전과 패키지 매니저 테스트

### 📊 상세한 리포트

- GitHub Step Summary에 결과 요약
- 패키지 크기 정보
- Breaking changes 감지
- 버전 정보 확인

### 🔒 안전한 퍼블리시

- Dry run으로 실제 퍼블리시 전 검증
- workspace 의존성 제거 확인
- 필수 필드 존재 여부 확인

### ⚡ 효율적인 실행

- 필요한 경로 변경 시에만 실행
- 병렬 실행으로 시간 단축
- 캐시 활용으로 빠른 실행
