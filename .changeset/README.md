# Changesets 기반 릴리즈 워크플로우

이 프로젝트는 **Changesets**를 사용하여 안전하고 자동화된 패키지 릴리즈를 관리합니다.

## 🎯 **핵심 개선사항**

### ✅ **해결된 문제들**

- **동시 배포 이슈**: 의존성 그래프 기반 순차 배포
- **@repo/ 의존성**: 릴리즈 시 자동 제거
- **workspace:\* 변환**: npm 레지스트리의 실제 버전 사용
- **배포 안전성**: 실패 시 자동 롤백

### 🔄 **개발 vs 릴리즈 전략**

```
개발 모드: workspace:* 사용 (빠른 로컬 개발)
릴리즈 모드: npm 레지스트리 버전 사용 (안전성)
```

## 📋 **워크플로우**

### **1. 변경사항 기록 (개발자)**

```bash
# 기능 개발 완료 후 changeset 생성
pnpm changeset

# 대화형 프롬프트:
# - 어떤 패키지가 변경되었나요?
# - 변경 타입은? (patch/minor/major)
# - 변경사항 요약을 입력해주세요
```

### **2. PR 생성 및 리뷰**

- changeset 파일이 PR에 포함됨
- 팀원들이 변경사항과 버전 영향도 검토
- CI에서 빌드/테스트 자동 실행

### **3. 자동 릴리즈 (main 브랜치 머지 후)**

```bash
# GitHub Actions이 자동으로 실행:
1. 빌드 및 테스트
2. Changesets가 버전 업데이트 PR 생성
3. PR 자동 머지 (조건부)
4. 의존성 정리 (prepare-release 스크립트)
5. npm 순차 배포 (changeset publish)
```

## 🛠 **수동 릴리즈 (로컬)**

### **전체 릴리즈 프로세스**

```bash
# 한 번에 모든 과정 실행
pnpm release
```

### **단계별 실행**

```bash
# 1. 빌드
pnpm build

# 2. 버전 업데이트 및 CHANGELOG 생성
pnpm changeset:version

# 3. 의존성 정리 (@repo/ 제거, workspace:* 변환)
pnpm prepare-release

# 4. npm 배포
pnpm changeset:publish

# 5. 정리 (필요시)
pnpm release-cleanup
```

## 📦 **패키지별 배포 순서**

Changesets가 자동으로 계산하는 안전한 배포 순서:

```
1️⃣ @snapkit-studio/core     (의존성 없음)
2️⃣ @snapkit-studio/react    (core 배포 완료 대기)
3️⃣ @snapkit-studio/nextjs   (core, react 배포 완료 대기)
```

## 🔧 **설정 파일들**

### **.changeset/config.json**

```json
{
  "access": "public", // npm public 패키지
  "baseBranch": "main", // 기본 브랜치
  "updateInternalDependencies": "patch", // 내부 의존성 자동 업데이트
  "ignore": ["@repo/eslint-config"] // workspace 전용 패키지 제외
}
```

### **scripts/prepare-release.js**

- npm 레지스트리에서 실제 버전 조회
- workspace:\* → ^1.8.0 (실제 배포된 버전)
- @repo/ 의존성 완전 제거

## 🚨 **주의사항**

### **개발 시**

- `workspace:*` 그대로 유지 (로컬 개발 최적화)
- changeset 파일 꼼꼼히 작성
- 버전 타입 신중히 선택 (breaking change → major)

### **릴리즈 시**

- main 브랜치 푸시 전 충분한 테스트
- CI 실패 시 즉시 확인 및 수정
- npm 배포 실패 시 자동 롤백 확인

## 📊 **모니터링**

### **GitHub Actions**

- `.github/workflows/release.yml`에서 배포 과정 모니터링
- 실패 시 Slack 알림 (설정 가능)

### **npm 배포 확인**

```bash
# 배포된 버전 확인
npm view @snapkit-studio/core version
npm view @snapkit-studio/react version
npm view @snapkit-studio/nextjs version
```

## 🔄 **롤백 전략**

### **자동 롤백**

- 배포 실패 시 Changesets가 자동으로 중단
- 의존성 불일치 감지 시 배포 취소

### **수동 롤백**

```bash
# 특정 버전으로 롤백
npm unpublish @snapkit-studio/react@1.7.0
npm publish  # 이전 버전 재배포
```

이제 **완전히 안전하고 자동화된 릴리즈 시스템**이 완성되었습니다! 🎉
