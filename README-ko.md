# @snapkit-studio/nextjs

[![npm version](https://img.shields.io/npm/v/@snapkit-studio/nextjs.svg)](https://www.npmjs.com/package/@snapkit-studio/nextjs)
[![npm downloads](https://img.shields.io/npm/dm/@snapkit-studio/nextjs.svg)](https://www.npmjs.com/package/@snapkit-studio/nextjs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

[![English](https://img.shields.io/badge/docs-English-blue)](./README.md) [![한국어](https://img.shields.io/badge/docs-한국어-blue)](./README-ko.md)

Next.js를 위한 고성능 이미지 최적화 라이브러리입니다. Snapkit 이미지 프록시 서비스와 완벽하게 통합되어 자동 포맷 최적화, 실시간 이미지 변환, 지연 로딩 등의 기능을 제공합니다.

## 특징

✅ **자동 포맷 최적화** - AVIF, WebP, JPEG 자동 선택  
✅ **실시간 이미지 변환** - 리사이징, 크롭, 필터 등  
✅ **Next.js Image 호환** - 기존 API와 완벽 호환  
✅ **지연 로딩** - Intersection Observer 기반  
✅ **TypeScript 지원** - 완전한 타입 안전성  
✅ **반응형 이미지** - srcset, sizes 자동 생성  
✅ **네트워크 최적화** - 연결 상태별 품질 조정

## 설치

```bash
npm install @snapkit-studio/nextjs
# or
yarn add @snapkit-studio/nextjs
# or
pnpm add @snapkit-studio/nextjs
```

## 빠른 시작

### 1. Provider 설정 (선택사항)

```tsx
// app/layout.tsx or _app.tsx
import { SnapkitProvider } from "@snapkit-studio/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <SnapkitProvider
          baseUrl="https://image-proxy.snapkit.com"
          organizationName="your-org"
          defaultQuality={85}
          defaultFormat="auto"
        >
          {children}
        </SnapkitProvider>
      </body>
    </html>
  );
}
```

### 2. 기본 사용법

```tsx
import { Image } from "@snapkit-studio/nextjs";

export default function MyComponent() {
  return (
    <Image
      src="/project/hero.jpg"
      alt="Hero Image"
      width={800}
      height={600}
      priority
    />
  );
}
```

## API 레퍼런스

### Image 컴포넌트

Next.js의 `Image` 컴포넌트와 호환되는 API를 제공합니다.

```tsx
import { Image } from "@snapkit-studio/nextjs";

<Image
  src="/path/to/image.jpg"
  alt="이미지 설명"
  width={800}
  height={600}
  // Next.js Image 호환 props
  quality={90}
  priority={true}
  placeholder="blur"
  sizes="(max-width: 768px) 100vw, 50vw"
  // Snapkit 전용 기능
  organizationName="your-org"
  baseUrl="https://your-cdn.com"
  optimizeFormat="avif" // auto | avif | webp | off
  transforms={{
    blur: 20,
    grayscale: true,
    fit: "cover",
  }}
/>;
```

#### Props

| Prop             | Type                                  | 기본값    | 설명                  |
| ---------------- | ------------------------------------- | --------- | --------------------- |
| `src`            | `string`                              | -         | 이미지 경로 (필수)    |
| `alt`            | `string`                              | -         | 대체 텍스트 (필수)    |
| `width`          | `number`                              | -         | 이미지 너비           |
| `height`         | `number`                              | -         | 이미지 높이           |
| `fill`           | `boolean`                             | `false`   | 부모 요소 크기에 맞춤 |
| `sizes`          | `string`                              | -         | 반응형 크기 설정      |
| `quality`        | `number`                              | `85`      | 이미지 품질 (1-100)   |
| `priority`       | `boolean`                             | `false`   | 우선 로딩 여부        |
| `placeholder`    | `'blur' \| 'empty'`                   | `'empty'` | 플레이스홀더 타입     |
| `loading`        | `'lazy' \| 'eager'`                   | `'lazy'`  | 로딩 방식             |
| `optimizeFormat` | `'auto' \| 'avif' \| 'webp' \| 'off'` | `'auto'`  | 포맷 최적화           |
| `transforms`     | `ImageTransforms`                     | `{}`      | 이미지 변환 옵션      |


## 이미지 변환 옵션

### 크기 조정

```tsx
<Image
  src="/image.jpg"
  alt="리사이즈"
  width={400}
  height={300}
  transforms={{
    fit: "cover", // contain | cover | fill | inside | outside
  }}
/>
```

### 시각 효과

```tsx
<Image
  src="/image.jpg"
  alt="효과"
  width={400}
  height={300}
  transforms={{
    blur: 20, // 블러 효과
    grayscale: true, // 흑백 변환
    brightness: 120, // 밝기 조정
    flip: true, // 상하 뒤집기
    flop: true, // 좌우 뒤집기
  }}
/>
```

### 영역 추출 (크롭)

```tsx
<Image
  src="/image.jpg"
  alt="크롭"
  width={400}
  height={300}
  transforms={{
    extract: {
      x: 100,
      y: 100,
      width: 300,
      height: 200,
    },
  }}
/>
```

## 고급 기능

### Progressive Loading

점진적 이미지 로딩으로 더 나은 사용자 경험을 제공합니다.

```tsx
import { useProgressiveLoading } from "@snapkit-studio/nextjs";

function ProgressiveImage({ src, ...props }) {
  const { currentSrc, stage, progress } = useProgressiveLoading({
    src,
    width: 800,
    height: 600,
    enabled: true,
    placeholderWidth: 40,
    lowQualityWidth: 400,
  });

  return (
    <div>
      <img src={currentSrc} {...props} />
      <div>
        Loading: {progress}% ({stage})
      </div>
    </div>
  );
}
```

### 커스텀 Hook 활용

```tsx
import { useImageOptimization, useResponsiveSrcSet } from "@snapkit-studio/nextjs";

function CustomImage({ src }) {
  const { avif, webp, original } = useImageOptimization({
    src,
    width: 800,
    quality: 85,
    optimizeFormat: "auto",
  });

  const srcSet = useResponsiveSrcSet(src, [400, 800, 1200]);

  return (
    <picture>
      <source srcSet={avif} type="image/avif" />
      <source srcSet={webp} type="image/webp" />
      <img src={original} srcSet={srcSet} />
    </picture>
  );
}
```

### 배치 이미지 사전 로딩

```tsx
import { useBatchImagePreload } from "@snapkit-studio/nextjs";

function Gallery({ images }) {
  const { preloadedCount, progress, isAllPreloaded } = useBatchImagePreload(
    images.map((img) => img.src),
  );

  if (!isAllPreloaded) {
    return <div>이미지 로딩 중... {Math.round(progress * 100)}%</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((image, i) => (
        <Image
          key={i}
          src={image.src}
          alt={image.alt}
          width={300}
          height={200}
        />
      ))}
    </div>
  );
}
```

## Next.js Image Loader 통합

@snapkit-studio/nextjs는 Next.js Image 컴포넌트와 직접 사용할 수 있는 커스텀 loader 함수들을 제공하여 완벽한 통합을 지원합니다.

### 기본 Loader 사용법

```tsx
import Image from 'next/image';
import { snapkitLoader } from '@snapkit-studio/nextjs';

export default function MyComponent() {
  return (
    <Image
      loader={snapkitLoader}
      src="/hero.jpg"
      width={800}
      height={600}
      alt="Hero image"
    />
  );
}
```

### 설정이 포함된 커스텀 Loader

```tsx
import Image from 'next/image';
import { createSnapkitLoader } from '@snapkit-studio/nextjs';

const customLoader = createSnapkitLoader({
  baseUrl: 'https://custom-proxy.snapkit.com',
  organizationName: 'my-org',
  optimizeFormat: 'webp',
});

export default function MyComponent() {
  return (
    <Image
      loader={customLoader}
      src="/image.jpg"
      width={800}
      height={600}
      alt="최적화된 이미지"
    />
  );
}
```

### next.config.js에서 글로벌 설정

loader 파일을 생성합니다 (예: `snapkit-loader.js`):

```js
const { createSnapkitLoader } = require('@snapkit-studio/nextjs');

module.exports = createSnapkitLoader({
  baseUrl: 'https://image-proxy.snapkit.com',
  organizationName: 'your-org',
  optimizeFormat: 'auto',
});
```

`next.config.js`에서 설정:

```js
/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    loader: 'custom',
    loaderFile: './snapkit-loader.js',
  },
};
```

### 미리 구성된 Loader들

일반적인 용도로 최적화된 loader들을 사용하세요:

```tsx
import Image from 'next/image';
import { defaultSnapkitLoaders } from '@snapkit-studio/nextjs';

// 고품질 이미지
<Image
  loader={defaultSnapkitLoaders.highQuality}
  src="/photo.jpg"
  width={1200}
  height={800}
  alt="고품질 사진"
/>

// 압축된 썸네일
<Image
  loader={defaultSnapkitLoaders.compressed}
  src="/thumb.jpg"
  width={150}
  height={150}
  alt="썸네일"
/>

// 흑백 이미지
<Image
  loader={defaultSnapkitLoaders.grayscale}
  src="/profile.jpg"
  width={200}
  height={200}
  alt="프로필 사진"
/>
```

### 고급 Loader 기능들

#### 이미지 변환이 포함된 Loader

```tsx
import { createSnapkitLoaderWithTransforms } from '@snapkit-studio/nextjs';

const blurredLoader = createSnapkitLoaderWithTransforms({
  blur: 20,
  brightness: 110,
  saturation: 120,
});

<Image
  loader={blurredLoader}
  src="/background.jpg"
  width={1920}
  height={1080}
  alt="블러 배경"
/>
```

#### 반응형 Loader

```tsx
import { createResponsiveSnapkitLoader } from '@snapkit-studio/nextjs';

const responsiveLoader = createResponsiveSnapkitLoader([
  400, 800, 1200, 1600, 2000
]);

<Image
  loader={responsiveLoader}
  src="/responsive.jpg"
  sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
  width={1200}
  height={800}
  alt="반응형 이미지"
/>
```

#### 조직별 전용 Loader

```tsx
import { createSnapkitLoaderForOrganization } from '@snapkit-studio/nextjs';

const orgLoader = createSnapkitLoaderForOrganization(
  'client-org',
  'https://client-cdn.snapkit.com'
);

<Image
  loader={orgLoader}
  src="/client-asset.jpg"
  width={600}
  height={400}
  alt="클라이언트 자산"
/>
```

## 설정 옵션

### SnapkitProvider Props

| Prop                    | Type                         | 기본값   | 설명                    |
| ----------------------- | ---------------------------- | -------- | ----------------------- |
| `baseUrl`               | `string`                     | -        | 이미지 프록시 서버 URL  |
| `organizationName`      | `string`                     | -        | 조직 이름               |
| `defaultQuality`        | `number`                     | `85`     | 기본 이미지 품질        |
| `defaultFormat`         | `'auto' \| 'avif' \| 'webp'` | `'auto'` | 기본 포맷               |
| `enableBlurPlaceholder` | `boolean`                    | `true`   | blur placeholder 활성화 |

### 환경별 최적화

네트워크 상태에 따라 자동으로 품질이 조정됩니다:

- **4G/WiFi**: 원본 품질 (85%)
- **3G**: 품질 20% 감소 (68%)
- **2G/Slow**: 품질 40% 감소 (51%)
- **Data Saver 모드**: 품질 30% 감소 (60%)

## 성능 팁

### 1. 적절한 크기 설정

```tsx
// ❌ 너무 큰 이미지
<Image src="/image.jpg" width={4000} height={3000} />

// ✅ 적절한 크기
<Image src="/image.jpg" width={800} height={600} />
```

### 2. priority 속성 활용

```tsx
// 위에서 보이는 중요한 이미지
<Image src="/hero.jpg" width={1200} height={600} priority />

// 스크롤 해야 보이는 이미지들
<Image src="/content.jpg" width={400} height={300} loading="lazy" />
```

### 3. 적절한 포맷 선택

```tsx
// 사진: AVIF/WebP 자동 선택
<Image src="/photo.jpg" optimizeFormat="auto" />

// 일러스트/로고: PNG 유지 필요시
<Image src="/logo.png" optimizeFormat="off" />
```

### 4. sizes 속성으로 반응형 최적화

```tsx
<Image
  src="/responsive.jpg"
  width={800}
  height={600}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
/>
```

## 브라우저 지원

- **AVIF**: Chrome 85+, Firefox 93+
- **WebP**: Chrome 23+, Firefox 65+, Safari 14+
- **지연 로딩**: Chrome 76+, Firefox 75+, Safari 15.4+

구형 브라우저에서는 자동으로 JPEG/PNG로 fallback됩니다.

## 문제 해결

### 이미지가 로드되지 않는 경우

1. **organizationName 확인**

```tsx
<SnapkitProvider organizationName="correct-org-name">
```

2. **이미지 경로 확인**

```tsx
// 절대 경로 사용
<Image src="/project/image.jpg" />

// 또는 전체 URL
<Image src="https://cdn.snapkit.com/org/project/image.jpg" />
```

3. **네트워크 요청 확인**
   브라우저 개발자 도구에서 이미지 요청 URL과 응답을 확인하세요.

### 타입 에러가 발생하는 경우

```tsx
// tsconfig.json에 추가
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  }
}
```

## 라이선스

MIT

## 릴리즈 프로세스

이 프로젝트는 **Semantic Versioning**과 **Conventional Commits**를 사용하여 패키지별 자동화된 릴리즈를 제공합니다.

### 자동 버전 관리

- `fix:` → patch 릴리즈 (1.0.0 → 1.0.1) 🩹
- `feat:` → minor 릴리즈 (1.0.0 → 1.1.0) ✨
- `feat!:` 또는 `BREAKING CHANGE:` → major 릴리즈 (1.0.0 → 2.0.0) 💥

### 커밋 메시지 규칙

표준 Conventional Commits 형식을 따라주세요:

```
type(scope): description

[optional body]

[optional footer]
```

#### 커밋 타입

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 스타일 변경 (포맷팅 등)
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드 프로세스나 도구 변경

#### 예시

```bash
feat(core): add support for AVIF format
fix(nextjs): resolve image loading issue in Safari
docs: update API documentation
feat(react)!: change default quality from 75 to 85

# BREAKING CHANGE가 포함된 경우
feat(nextjs): update Image component API

BREAKING CHANGE: remove deprecated `lazy` prop, use `loading` instead
```

### 패키지별 릴리즈 워크플로우

1. **개발**: 패키지 폴더 (`packages/core/`, `packages/react/`, `packages/nextjs/`) 내용 수정
2. **자동 감지**: 해당 패키지에 변경사항이 있을 때만 워크플로우 실행
3. **CI 검증**: 자동 테스트, 린팅, 타입 체크 실행
4. **자동 릴리즈**: CI 통과 시 GitHub Actions가:
   - 커밋 히스토리 분석하여 해당 패키지 버전 결정
   - GitHub Release 생성 (릴리즈 노트 포함)
   - npm에 자동 배포
   - Git 태그 생성 (`core-v1.0.1`, `react-v2.1.0` 등)

### 수동 릴리즈 (필요시)

```bash
# 로컬에서 개별 패키지 릴리즈
./scripts/publish-local.sh --package=core --version=1.0.1 --dry-run

# GitHub Actions에서 수동 실행
# Repository → Actions → Release Core/React/NextJS → Run workflow
```

### 최신 버전 확인

[![npm version](https://img.shields.io/npm/v/@snapkit-studio/nextjs.svg)](https://www.npmjs.com/package/@snapkit-studio/nextjs)
[![GitHub Release](https://img.shields.io/github/release/snapkit/snapkit-nextjs.svg)](https://github.com/snapkit/snapkit-nextjs/releases)

## 예제

@snapkit-studio/nextjs를 실제로 사용하는 예제 프로젝트들을 확인해보세요:

- **[기본 예제](./examples/basic-nextjs/)** - 기본 사용법을 보여주는 간단한 Next.js 애플리케이션
- **[고급 기능](./examples/advanced-features/)** - Progressive loading, 커스텀 훅, 배치 사전 로딩
- **[온라인 데모](https://codesandbox.io/s/snapkit-nextjs-basic)** - CodeSandbox에서 바로 체험해보기

## 기여하기

버그 리포트나 기능 제안은 [GitHub Issues](https://github.com/snapkit/snapkit-nextjs/issues)에 등록해 주세요.

자세한 기여 가이드는 [CONTRIBUTING.md](./CONTRIBUTING.md)를 참고하세요.
