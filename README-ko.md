# Snapkit

React와 Next.js 애플리케이션을 위한 차세대 이미지 최적화

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/built%20with-Turborepo-blueviolet)](https://turbo.build/)

[![English](https://img.shields.io/badge/docs-English-blue)](./README.md) [![한국어](https://img.shields.io/badge/docs-한국어-blue)](./README-ko.md)

## Snapkit이란 무엇인가요?

Snapkit은 현대적인 웹 애플리케이션을 위한 자동 이미지 최적화, 포맷 변환, 반응형 로딩을 제공합니다. 향상된 기능을 갖춘 Next.js Image의 드롭인 대체제이며 모든 React 애플리케이션을 지원합니다.

- **자동 포맷 최적화** - 브라우저 감지를 통한 AVIF, WebP, JPEG
- **실시간 변환** - 크기 조정, 자르기, 필터 및 효과
- **Next.js 호환성** - 기존 Next.js Image API와 호환
- **성능 중심** - 지연 로딩, 네트워크 인식 품질, 반응형 이미지

## 빠른 시작

```tsx
// Next.js
import { Image } from '@snapkit-studio/nextjs';

<Image
  src="/hero.jpg"
  alt="히어로 이미지"
  width={800}
  height={600}
  transforms={{ format: 'auto', fit: 'cover' }}
/>;
```

```tsx
// React
import { Image, SnapkitProvider } from '@snapkit-studio/react';

<SnapkitProvider organizationName="your-org">
  <Image
    src="/hero.jpg"
    alt="히어로 이미지"
    width={800}
    height={600}
    transforms={{ format: 'auto', fit: 'cover' }}
  />
</SnapkitProvider>;
```

## 설치

```bash
# Next.js 프로젝트용
npm install @snapkit-studio/nextjs

# React 프로젝트용
npm install @snapkit-studio/react

# 코어 유틸리티만
npm install @snapkit-studio/core
```

## 문서

- **[@snapkit-studio/nextjs](./packages/nextjs/README.md)** - Next.js 통합 가이드
- **[@snapkit-studio/react](./packages/react/README.md)** - React 컴포넌트와 훅
- **[@snapkit-studio/core](./packages/core/README.md)** - 코어 유틸리티와 타입

## 예제

- **[Next.js 데모](./apps/nextjs-demo)** - 포괄적인 Next.js 통합 예제
- **[React 데모](./apps/react-demo)** - 인터랙티브 React 컴포넌트 쇼케이스

## 개발

```bash
# 의존성 설치
pnpm install

# 개발 시작
pnpm exec turbo dev

# 테스트 실행
pnpm exec turbo test

# 패키지 빌드
pnpm exec turbo build
```

## 기여하기

기여 가이드라인은 [CONTRIBUTING.md](./CONTRIBUTING.md)를 참조하세요.

## 라이센스

MIT
