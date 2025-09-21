# Slack 알림 설정 가이드

릴리즈 성공/실패에 대한 Slack 알림을 받기 위한 설정 방법입니다.

## 🔧 **Slack Webhook 설정**

### 1. Slack 앱 생성
1. [Slack API](https://api.slack.com/apps) 페이지 접속
2. "Create New App" → "From scratch" 선택
3. 앱 이름: `SnapKit Release Bot`
4. 워크스페이스 선택

### 2. Incoming Webhooks 활성화
1. 생성된 앱의 "Incoming Webhooks" 메뉴 선택
2. "Activate Incoming Webhooks" 토글 활성화
3. "Add New Webhook to Workspace" 클릭
4. 알림을 받을 채널 선택 (예: `#releases`)
5. Webhook URL 복사

### 3. GitHub Secrets 설정
1. GitHub 저장소 → Settings → Secrets and variables → Actions
2. "New repository secret" 클릭
3. Name: `SLACK_WEBHOOK_URL`
4. Secret: 복사한 Webhook URL 붙여넣기

## 📱 **Slack 채널 설정**

### 권장 채널 구조
```
#releases          # 실제 릴리즈 알림
#releases-dev      # 개발/테스트 릴리즈
#alerts            # 실패 알림 (선택사항)
```

### 알림 설정 변경
워크플로우에서 다른 채널을 사용하려면 `.github/workflows/release.yml` 파일 수정:

```yaml
# 현재 설정
channel: '#releases'

# 변경 예시
channel: '#your-channel'
```

## 🎨 **알림 메시지 커스터마이징**

### 성공 알림 예시
```
🎉 **Release Success!**
📦 **NPM Registry**: @snapkit-studio/core@1.8.1, @snapkit-studio/react@1.6.6
📦 **GitHub Package Registry**: Published successfully
🔗 **Commit**: abc1234
👤 **Author**: doong-jo
```

### 실패 알림 예시
```
❌ **Release Failed!**
🚫 **Workflow**: Release Packages
🔗 **Run**: View Details
🔗 **Commit**: abc1234
👤 **Author**: doong-jo

Please check the workflow logs and fix any issues.
```

## 🔕 **알림 비활성화**

Slack 알림을 일시적으로 비활성화하려면:

1. GitHub Secrets에서 `SLACK_WEBHOOK_URL` 제거
2. 또는 워크플로우 파일에서 Slack 단계 주석 처리

## 🧪 **테스트 방법**

1. **수동 테스트**: Changeset 생성 후 릴리즈 실행
   ```bash
   pnpm changeset  # 테스트용 패치 버전
   git add . && git commit -m "test: trigger release"
   git push origin main
   ```

2. **Slack 메시지 확인**: #releases 채널에서 알림 수신 확인

## 🚨 **트러블슈팅**

### Slack 알림이 오지 않는 경우
1. **Webhook URL 확인**: GitHub Secrets에 올바른 URL 설정됨
2. **채널 권한**: Bot이 해당 채널에 메시지 전송 권한 있음
3. **워크플로우 로그**: GitHub Actions에서 Slack 단계 에러 확인

### 알림이 너무 많은 경우
1. **필터링**: 특정 브랜치나 조건에서만 알림 전송
2. **채널 분리**: 중요한 릴리즈만 메인 채널로, 나머지는 개발 채널로

## 📊 **고급 설정**

### 조건부 알림
```yaml
# 메이저 버전만 알림
if: contains(steps.changesets.outputs.publishedPackages, 'major')

# 특정 패키지만 알림
if: contains(steps.changesets.outputs.publishedPackages, '@snapkit-studio/core')
```

### 멀티 채널 알림
```yaml
# 성공은 #releases, 실패는 #alerts
- name: Notify success
  if: success()
  # channel: '#releases'

- name: Notify failure
  if: failure()
  # channel: '#alerts'
```

이제 릴리즈마다 실시간 Slack 알림을 받을 수 있습니다! 🎉