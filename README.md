#기능명세서: AI 기반 마케팅 문구 자동 생성 웹서비스
1. 개요
Next.js 기반으로 OpenAI API를 활용하여 **입력한 가치 제언(Value Proposition)**과 타겟팅 옵션을 기반으로 자동으로 마케팅 문구를 생성하는 웹서비스를 구축한다.
사용자는 웹 화면에서 다양한 옵션을 선택하고, "문구 생성" 버튼 클릭 시 AI가 작성한 결과를 JSON 형식으로 확인할 수 있다.

2. 주요 기능
2.1 TTS (Text-to-Speech) 음성 변환
- 생성된 마케팅 문구를 자연스러운 음성으로 변환
- 6가지 음성 옵션 (Alloy, Echo, Fable, Onyx, Nova, Shimmer)
- 브라우저에서 바로 음성 재생 및 MP3 다운로드
- 실시간 재생 컨트롤 (재생, 일시정지, 정지)

2.2 입력 영역
가치 제언 입력 필드 (필수)

TextArea 형태

예시 placeholder: "제품의 핵심 가치나 메시지를 입력하세요"

2.2 타겟팅 옵션 (선택 가능)
성별: 남성 / 여성 / 무관

연령대: 10대 / 20대 / 30대 / 40대 / 50대 이상

플랫폼:

Instagram

Facebook

TikTok

YouTube

LinkedIn

Twitter(X)

Email

톤/어조:

감성적 / 직설적 / 전문적 / 유머러스 / 고급스러움 / 친근함

문구 길이:

짧음(한 문장) / 중간(2~3문장) / 길음(단락 수준)

목적 옵션 (추가 제안)

브랜드 인지도 제고

구매 전환 유도

클릭 유도 (CTA 강조)

이벤트/프로모션 홍보

2.3 생성 버튼
"마케팅 문구 생성" 버튼 클릭 시 OpenAI API 호출

옵션값 + 입력된 가치 제언을 프롬프트로 구성

결과는 JSON 형식으로 화면에 출력

3. 출력 형식 (예시 JSON)
{
  "input": {
    "value_proposition": "피부를 건강하게 지켜주는 순한 성분의 선크림",
    "gender": "여성",
    "age_group": "20대",
    "platform": "Instagram",
    "tone": "감성적",
    "length": "짧음",
    "goal": "구매 전환 유도"
  },
  "output": {
    "marketing_copy": "햇살 아래서도 당신의 피부는 빛나야 하니까. 부드럽고 순한 선크림으로 매일을 지켜드려요."
  }
}
4. 기술 스택 및 구현 사항
프론트엔드: Next.js, React, Tailwind CSS, Shadcn UI

백엔드: Next.js API Routes

AI 연동: OpenAI API (text generation endpoint)

상태관리: React Query or Zustand (선택사항)

UI 기능:

입력 폼 (TextArea + Select Box + Radio Button)

JSON 출력 영역 (Pretty Print 가능하도록 코드 블럭 스타일 적용)

5. 사용자 플로우
사용자가 가치 제언 입력

타겟팅 및 옵션 선택

"문구 생성" 버튼 클릭

OpenAI API 호출 및 결과 반환

JSON 형식 결과를 화면에 출력

## 개발구현계획

### Phase 1: 프로젝트 기반 설정
1. **필수 의존성 설치**
   - Shadcn UI (깔끔한 컴포넌트 라이브러리)
   - OpenAI SDK
   - React Hook Form (폼 상태 관리)
   - Lucide React (미니멀 아이콘)

2. **Shadcn UI 초기 설정**
   - 깔끔한 디자인 시스템 구축
   - 필요한 컴포넌트들 설치 (Card, Input, Textarea, Select, RadioGroup, Button, Badge)

### Phase 2: 타입 정의 및 디자인 시스템
3. **TypeScript 타입 정의**
   - 입력 데이터 타입 (가치제언, 타겟팅 옵션)
   - API 응답 타입
   - 폼 상태 관리 타입

4. **깔끔한 레이아웃 디자인**
   - 카드 기반 레이아웃
   - 그리드 시스템 활용
   - 일관된 간격과 타이포그래피
   - 미니멀한 색상 팔레트

### Phase 3: 핵심 컴포넌트 구현
5. **세련된 입력 폼 컴포넌트**
   - 가치 제언 입력 (TextArea, 깔끔한 스타일)
   - 타겟팅 옵션들 (Select, RadioGroup, 깔끔한 그룹핑)
   - 폼 유효성 검사 (미니멀한 에러 표시)

6. **API 연동**
   - OpenAI API 라우트 구현
   - 프롬프트 엔지니어링
   - 에러 처리 및 응답 검증

### Phase 4: 결과 출력 및 통합
7. **JSON 결과 출력 컴포넌트**
   - 코드 블록 스타일 (깔끔한 문법 하이라이팅)
   - 복사 기능
   - 미니멀한 디자인

8. **메인 페이지 통합**
   - 폼과 결과 영역의 깔끔한 분리
   - 로딩 상태 (심플한 스피너)
   - 반응형 레이아웃

### Phase 5: 최종 완성
9. **에러 처리 및 사용자 경험**
   - 미니멀한 에러 메시지
   - 로딩 상태 표시
   - 성공/실패 피드백

10. **반응형 최적화**
    - 모바일/태블릿/데스크톱 대응
    - 터치 친화적 인터페이스
    - 최종 UI/UX 완성

### UI 디자인 원칙
- **미니멀리즘**: 불필요한 요소 제거, 깔끔한 공백 활용
- **일관성**: 통일된 간격, 색상, 타이포그래피
- **가독성**: 명확한 계층 구조, 적절한 대비
- **접근성**: 키보드 네비게이션, 스크린 리더 지원
- **반응형**: 모든 디바이스에서 최적화된 경험

## 환경 변수 설정

### 1. .env.local 파일 생성
프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# OpenAI API 설정
OPENAI_API_KEY=your_openai_api_key_here

# API 설정
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# CORS 설정 (프로덕션용)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Rate Limiting 설정
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10
```

### 2. OpenAI API 키 발급
1. [OpenAI 웹사이트](https://platform.openai.com/)에 접속
2. 계정 생성 또는 로그인
3. API Keys 섹션에서 새 키 생성
4. 생성된 키를 `.env.local` 파일의 `OPENAI_API_KEY`에 입력

### 3. 환경 변수 확인
개발 서버 실행 후 브라우저 콘솔에서 환경 변수 설정 상태를 확인할 수 있습니다.

### 4. 프로덕션 배포 환경 변수
Vercel 배포 시 다음 환경 변수를 설정하세요:

```bash
# OpenAI API 키 (필수)
OPENAI_API_KEY=your_actual_openai_api_key

# API URL (자동 설정됨)
NEXT_PUBLIC_API_URL=https://your-app.vercel.app/api

# CORS 설정 (선택사항)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Rate Limiting 설정 (선택사항)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10
```

**주의사항:**
- `.env.local` 파일은 Git에 커밋하지 마세요 (보안상 중요)
- API 키는 절대 공개하지 마세요
- 프로덕션 배포 시 환경 변수를 올바르게 설정하세요
- Vercel에서는 환경 변수를 대시보드에서 설정할 수 있습니다

## 배포 가이드

### Vercel 배포
1. **GitHub에 코드 푸시**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Vercel 연결**
   - [Vercel](https://vercel.com)에 접속
   - GitHub 저장소 연결
   - 자동 배포 설정

3. **환경 변수 설정**
   - Vercel 대시보드 → Settings → Environment Variables
   - `OPENAI_API_KEY` 추가
   - 기타 필요한 환경 변수 추가

4. **도메인 설정**
   - Custom Domain 설정 (선택사항)
   - HTTPS 자동 적용

### 로컬 빌드 테스트
```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 번들 분석
npm run build:analyze
```




















