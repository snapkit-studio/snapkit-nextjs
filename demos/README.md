# Snapkit.js Demo Showcase Videos

이 디렉토리에는 Snapkit.js 라이브러리의 데모 애플리케이션 쇼케이스 영상이 포함되어 있습니다.

## 📹 데모 영상

### Next.js Demo
- **파일**: `videos/nextjs-demo-showcase.webm`
- **크기**: 2.5MB
- **내용**:
  - React Server Components (RSC) 지원
  - ServerImage와 ClientImage 자동 선택
  - DPR 최적화
  - 이미지 변환 기능

### React Demo
- **파일**: `videos/react-demo-showcase.webm`
- **크기**: 4.4MB
- **내용**:
  - Pure React 컴포넌트
  - 반응형 디자인 (데스크톱/태블릿/모바일)
  - 이미지 최적화 기능
  - 네트워크 적응형 품질 조정

## 🎬 영상 재생

WebM 형식은 대부분의 최신 브라우저에서 지원됩니다:
- Chrome, Firefox, Edge에서 직접 재생 가능
- Safari의 경우 MP4 변환 필요

## 🔄 MP4로 변환

ffmpeg가 설치되어 있다면 다음 명령어로 MP4로 변환할 수 있습니다:

```bash
# ffmpeg 설치 (macOS)
brew install ffmpeg

# WebM to MP4 변환
ffmpeg -i videos/nextjs-demo-showcase.webm videos/nextjs-demo-showcase.mp4
ffmpeg -i videos/react-demo-showcase.webm videos/react-demo-showcase.mp4
```

## 🚀 라이브 데모

실제 동작하는 데모는 다음에서 확인할 수 있습니다:
- Next.js Demo: [Vercel에 배포 예정]
- React Demo: [Vercel에 배포 예정]

## 📝 영상 재생성

새로운 쇼케이스 영상을 만들려면:

```bash
# 데모 앱 실행
cd apps/nextjs-demo && pnpm dev  # 별도 터미널
cd apps/react-demo && pnpm dev    # 별도 터미널

# 영상 녹화
node scripts/record-demo-videos.js
```

포트가 다른 경우 환경 변수로 지정:

```bash
NEXTJS_PORT=3004 REACT_PORT=5174 node scripts/record-demo-videos.js
```