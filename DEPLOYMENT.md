# 배포 가이드

## Vercel 배포

### 1. GitHub 저장소 준비

```bash
# Git 초기화
git init
git add .
git commit -m "Initial commit"

# GitHub 저장소 생성 후 연결
git remote add origin https://github.com/yourusername/ai-mkt-app.git
git push -u origin main
```

### 2. Vercel 배포

1. [Vercel](https://vercel.com)에 접속하여 GitHub 계정으로 로그인
2. "New Project" 클릭
3. GitHub 저장소 선택
4. 프로젝트 설정:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (기본값)
   - **Output Directory**: `.next` (기본값)

### 3. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정:

```bash
# 필수 환경 변수
OPENAI_API_KEY=your_actual_openai_api_key_here

# 선택적 환경 변수
NEXT_PUBLIC_API_URL=https://your-app.vercel.app/api
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10
```

### 4. 도메인 설정 (선택사항)

1. Vercel 대시보드 → Settings → Domains
2. 커스텀 도메인 추가
3. DNS 설정 완료

## Docker 배포

### 1. Dockerfile 생성

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. Docker Compose 설정

```yaml
version: '3.8'

services:
  ai-mkt-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - NODE_ENV=production
    restart: unless-stopped
```

### 3. 배포 실행

```bash
# Docker 이미지 빌드
docker build -t ai-mkt-app .

# Docker Compose로 실행
docker-compose up -d
```

## 환경 변수

### 필수 환경 변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `OPENAI_API_KEY` | OpenAI API 키 | `sk-...` |

### 선택적 환경 변수

| 변수명 | 기본값 | 설명 |
|--------|--------|------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000/api` | API 기본 URL |
| `ALLOWED_ORIGINS` | - | CORS 허용 도메인 |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limiting 윈도우 (밀리초) |
| `RATE_LIMIT_MAX_REQUESTS` | `10` | 최대 요청 수 |

## 성능 최적화

### 1. 번들 분석

```bash
# 번들 분석 실행
npm run build:analyze

# 분석 결과 확인
open .next/analyze/bundle-analysis.html
```

### 2. 이미지 최적화

- WebP/AVIF 포맷 사용
- 적절한 이미지 크기 설정
- Lazy loading 적용

### 3. 코드 스플리팅

- 동적 import 사용
- 페이지별 코드 분할
- 컴포넌트 지연 로딩

## 모니터링

### 1. 로그 모니터링

- Vercel Analytics 사용
- 에러 추적 (Sentry 등)
- 성능 모니터링

### 2. 알림 설정

- API 오류 알림
- Rate limit 초과 알림
- 서버 상태 모니터링

## 보안 체크리스트

- [ ] OpenAI API 키 보안 설정
- [ ] CORS 정책 적용
- [ ] Rate limiting 활성화
- [ ] HTTPS 강제 사용
- [ ] 보안 헤더 설정
- [ ] 입력 데이터 검증
- [ ] 에러 메시지 보안

## 트러블슈팅

### 일반적인 문제

1. **빌드 실패**
   - Node.js 버전 확인 (18+)
   - 의존성 재설치
   - 환경 변수 확인

2. **API 오류**
   - OpenAI API 키 유효성 확인
   - Rate limit 확인
   - 네트워크 연결 상태 확인

3. **CORS 오류**
   - ALLOWED_ORIGINS 설정 확인
   - 도메인 정확성 확인

### 로그 확인

```bash
# Vercel 로그 확인
vercel logs

# Docker 로그 확인
docker logs ai-mkt-app
```

## 백업 및 복구

### 1. 코드 백업
- GitHub 저장소 사용
- 정기적인 커밋 및 푸시

### 2. 환경 변수 백업
- Vercel 대시보드에서 환경 변수 내보내기
- 안전한 곳에 백업 저장

### 3. 데이터베이스 백업
- 현재는 로컬 스토리지 사용
- 필요시 외부 데이터베이스 연동 고려
