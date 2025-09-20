# Snapkit Studio에 기여하기

[![English](https://img.shields.io/badge/docs-English-blue)](./CONTRIBUTING.md) [![한국어](https://img.shields.io/badge/docs-한국어-blue)](./CONTRIBUTING-ko.md)

여러분의 참여를 환영합니다! Snapkit Studio monorepo에 기여하는 것을 최대한 쉽고 투명하게 만들고자 합니다.

- 버그 신고
- 코드 현황 논의
- 수정 사항 제출
- 새로운 기능 제안
- 메인테이너 되기

## 개발 프로세스

우리는 GitHub를 사용하여 코드를 호스팅하고, 이슈와 기능 요청을 추적하며, 풀 리퀘스트를 수락합니다.

### 1. Fork와 Clone

```bash
# GitHub에서 저장소를 Fork하세요
# 그 다음 fork를 clone하세요
git clone https://github.com/YOUR_USERNAME/web.git
cd web

# upstream 원격 저장소 추가
git remote add upstream https://github.com/snapkit-studio/web.git
```

### 2. 의존성 설치

```bash
pnpm install
```

### 3. Git 커밋 템플릿 설정 (선택사항)

```bash
git config commit.template .gitmessage
```

## 프로젝트 구조

이것은 Snapkit 이미지 최적화 생태계를 위한 여러 패키지를 포함하는 monorepo입니다:

### 패키지
- **`@snapkit-studio/core`**: 핵심 이미지 변환 및 URL 빌딩 유틸리티
- **`@snapkit-studio/nextjs`**: App Router 지원을 포함한 Next.js Image 컴포넌트 통합
- **`@snapkit-studio/react`**: 자동 최적화 기능을 가진 React 이미지 컴포넌트

### 애플리케이션
- **`apps/nextjs-demo`**: Next.js 통합을 보여주는 데모 애플리케이션
- **`apps/react-demo`**: React 통합을 보여주는 데모 애플리케이션

### 시스템 요구사항
- Node.js >= 22.0.0
- pnpm >= 10.0.0
- Git >= 2.28.0

## 개발 워크플로우

### 로컬 환경 설정

1. **의존성 설치**:
   ```bash
   pnpm install
   ```

2. **모든 패키지 빌드**:
   ```bash
   pnpm build
   ```

3. **테스트 실행**:
   ```bash
   # 모든 테스트
   pnpm test

   # 특정 패키지
   pnpm --filter @snapkit-studio/core test
   ```

4. **개발 시작**:
   ```bash
   # 모든 개발 서버 시작
   pnpm dev

   # 특정 데모 앱 시작
   pnpm --filter react-demo dev
   pnpm --filter nextjs-demo dev
   ```

5. **타입 검사 실행**:
   ```bash
   pnpm check-types
   ```

6. **린팅 실행**:
   ```bash
   pnpm lint
   ```

### 변경사항 만들기

1. **브랜치 생성** `main`에서:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **코딩 표준을 따라 변경사항 작성**

3. **해당되는 경우 테스트 추가**

4. **모든 테스트 통과 확인**:
   ```bash
   pnpm test
   pnpm check-types
   pnpm lint
   ```

### 변경사항 커밋하기

일관된 커밋 메시지와 자동화된 버전 관리를 위해 [Conventional Commits](https://conventionalcommits.org/)을 사용합니다.

#### Commitizen 사용 (권장)

```bash
# 가이드된 프롬프트로 대화형 커밋
pnpm commit
```

#### 수동 커밋 형식

```
type[optional scope]: description

[optional body]

[optional footer(s)]
```

**타입:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서만 변경
- `style`: 코드 의미에 영향을 주지 않는 변경
- `refactor`: 버그를 수정하지도 기능을 추가하지도 않는 코드 변경
- `perf`: 성능을 개선하는 코드 변경
- `test`: 누락된 테스트를 추가하거나 기존 테스트를 수정
- `chore`: 빌드 프로세스나 보조 도구에 대한 변경

**예시:**
```bash
feat: 이미지 압축 옵션 추가
fix: TypeScript 컴파일 오류 해결
docs: 새로운 API 예제로 README 업데이트
test: 이미지 변환에 대한 단위 테스트 추가
```

**Breaking Changes:**
Breaking changes의 경우, 커밋 본문에 `BREAKING CHANGE:`를 추가하거나 타입 뒤에 `!`를 사용하세요:

```bash
feat!: 기본 압축 품질을 80으로 변경
```

## 풀 리퀘스트 프로세스

1. **fork 업데이트**:
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. **변경사항 푸시**:
   ```bash
   git push origin your-branch
   ```

3. **GitHub에서 풀 리퀘스트 생성**

4. **PR 템플릿을 완전히 채우기**

5. **CI 통과 확인** - 모든 테스트, 린팅, 타입 검사가 통과해야 합니다

6. **리뷰 대기** - 메인테이너가 PR을 리뷰할 것입니다

### PR 요구사항

- [ ] 모든 테스트 통과
- [ ] 코드가 스타일 가이드라인 준수
- [ ] 코드 자체 리뷰
- [ ] 문서 업데이트 (해당되는 경우)
- [ ] Breaking changes 없음 (의도적이고 문서화된 경우 제외)
- [ ] Conventional commit 메시지 사용

## 패키지별 가이드라인

### @snapkit-studio/core
- 이미지 최적화를 위한 핵심 변환 로직
- 브라우저 호환성 유틸리티
- URL 빌딩 및 매개변수 관리
- **테스팅**: 변환 정확성과 URL 생성에 중점

### @snapkit-studio/nextjs
- Next.js Image 컴포넌트 통합
- App Router와 Pages Router 지원
- SSR/SSG 호환성
- **테스팅**: 두 라우터 타입이 올바르게 작동하는지 확인

### @snapkit-studio/react
- 순수 React 이미지 컴포넌트
- 프레임워크에 구애받지 않는 구현
- 클라이언트 측 최적화
- **테스팅**: 브라우저 호환성과 React 버전 지원

## 코드 스타일 가이드라인

### TypeScript

- 모든 코드에 TypeScript 사용
- `any`보다는 명시적 타입 선호
- 객체 형태에는 인터페이스 사용
- 엄격 모드 설정 사용

### 포맷팅

- 코드 포맷팅에 Prettier 사용
- 포맷팅 문제 자동 수정을 위해 `pnpm lint` 실행
- 들여쓰기는 2칸 공백
- 유효한 곳에 trailing comma 사용
- 문자열에는 단일 따옴표 사용

### 테스팅

- 새로운 기능과 버그 수정에 대한 테스트 작성
- 설명적인 테스트 이름 사용
- `describe` 블록으로 관련 테스트 그룹화
- 테스팅에 Vitest 사용

예시:
```typescript
describe('Image component', () => {
  it('should render with correct src attribute', () => {
    // 테스트 구현
  });

  it('should apply compression settings', () => {
    // 테스트 구현
  });
});
```

## 릴리즈 프로세스

이 프로젝트는 시맨틱 버전 관리와 자동화된 릴리즈를 사용합니다:

1. **Conventional commits**이 자동으로 버전 증가를 결정합니다
2. **CI/CD 파이프라인**이 빌드와 테스트를 처리합니다
3. **Semantic Release**가 릴리즈를 생성하고 npm에 배포합니다
4. **Changelog**가 자동으로 생성됩니다

### 버전 증가

- `fix:` → patch 릴리즈 (1.0.0 → 1.0.1)
- `feat:` → minor 릴리즈 (1.0.0 → 1.1.0)
- `feat!:` 또는 `BREAKING CHANGE:` → major 릴리즈 (1.0.0 → 2.0.0)

## 도움 받기

- **Issues**: 버그 신고와 기능 요청에 GitHub Issues 사용
- **Discussions**: 질문과 일반적인 논의에 GitHub Discussions 사용
- **문서**: README와 인라인 문서 확인

## 행동 강령

이 프로젝트는 [기여자 행동 강령](https://www.contributor-covenant.org/)을 따릅니다. 참여함으로써 이 강령을 지킬 것으로 기대됩니다.

### 우리의 서약

우리는 나이, 체형, 장애, 민족성, 성 정체성과 표현, 경험 수준, 국적, 외모, 인종, 종교, 또는 성적 정체성과 지향에 관계없이 모든 사람에게 괴롭힘 없는 프로젝트 참여 경험을 만들 것을 서약합니다.

## 라이선스

기여함으로써 당신의 기여가 프로젝트와 동일한 라이선스(MIT 라이선스) 하에 라이선스될 것에 동의합니다.

## 인정

기여자들은 자동으로 README와 릴리즈에 추가됩니다. 크고 작은 모든 기여를 감사히 여깁니다!

---

Snapkit Studio에 기여해 주셔서 감사합니다! 🚀