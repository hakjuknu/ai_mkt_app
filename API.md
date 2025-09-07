# API 문서

## 개요

AI 마케팅 문구 생성기 API는 OpenAI GPT-3.5-turbo를 사용하여 사용자 정의 마케팅 문구를 생성하는 RESTful API입니다.

## 기본 정보

- **Base URL**: `http://localhost:3000/api` (개발), `https://your-domain.com/api` (프로덕션)
- **Content-Type**: `application/json`
- **Rate Limiting**: 15분당 10회 (일반), 15분당 3회 (배치 생성)

## 엔드포인트

### 1. 단일 마케팅 문구 생성

**POST** `/api/generate-marketing-copy`

선택한 옵션 조합으로 하나의 마케팅 문구를 생성합니다.

#### 요청 본문

```json
{
  "input": {
    "valueProposition": "피부를 건강하게 지켜주는 순한 성분의 선크림",
    "gender": "여성",
    "ageGroup": "20대",
    "platform": "Instagram",
    "tone": "감성적",
    "length": "짧음",
    "goal": "구매 전환 유도"
  }
}
```

#### 필드 설명

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `valueProposition` | string | ✅ | 제품/서비스의 핵심 가치 제언 (10-500자) |
| `gender` | string | ✅ | 타겟 성별: "남성", "여성", "무관" |
| `ageGroup` | string | ✅ | 타겟 연령대: "10대", "20대", "30대", "40대", "50대 이상" |
| `platform` | string | ✅ | 플랫폼: "Instagram", "Facebook", "TikTok", "YouTube", "LinkedIn", "Twitter(X)", "Email" |
| `tone` | string | ✅ | 톤/어조: "감성적", "직설적", "전문적", "유머러스", "고급스러움", "친근함" |
| `length` | string | ✅ | 문구 길이: "짧음", "중간", "길음" |
| `goal` | string | ✅ | 목적: "브랜드 인지도 제고", "구매 전환 유도", "클릭 유도 (CTA 강조)", "이벤트/프로모션 홍보" |

#### 응답

**성공 (200 OK)**
```json
{
  "input": {
    "valueProposition": "피부를 건강하게 지켜주는 순한 성분의 선크림",
    "gender": "여성",
    "ageGroup": "20대",
    "platform": "Instagram",
    "tone": "감성적",
    "length": "짧음",
    "goal": "구매 전환 유도"
  },
  "output": {
    "marketing_copy": "햇살 아래서도 당신의 피부는 빛나야 하니까. 부드럽고 순한 선크림으로 매일을 지켜드려요. #선크림 #피부관리 #자연성분"
  }
}
```

**에러 (400 Bad Request)**
```json
{
  "error": "입력 데이터가 올바르지 않습니다."
}
```

**에러 (401 Unauthorized)**
```json
{
  "error": "OpenAI API 키가 올바르게 설정되지 않았습니다."
}
```

**에러 (429 Too Many Requests)**
```json
{
  "error": "요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요."
}
```

### 2. 배치 마케팅 문구 생성

**POST** `/api/generate-all-marketing-copy`

제한된 옵션 조합으로 여러 마케팅 문구를 생성합니다.

#### 요청 본문

```json
{
  "input": {
    "valueProposition": "피부를 건강하게 지켜주는 순한 성분의 선크림"
  }
}
```

#### 응답

**성공 (200 OK)**
```json
{
  "input": {
    "valueProposition": "피부를 건강하게 지켜주는 순한 성분의 선크림"
  },
  "results": [
    {
      "input": {
        "valueProposition": "피부를 건강하게 지켜주는 순한 성분의 선크림",
        "gender": "남성",
        "ageGroup": "10대",
        "platform": "Instagram",
        "tone": "감성적",
        "length": "짧음",
        "goal": "브랜드 인지도 제고"
      },
      "output": {
        "marketing_copy": "생성된 문구..."
      }
    }
  ],
  "totalCombinations": 8,
  "successCount": 8,
  "errorCount": 0
}
```

### 3. TTS (Text-to-Speech) 음성 변환

**POST** `/api/tts`

생성된 마케팅 문구를 음성으로 변환합니다.

#### 요청 본문

```json
{
  "text": "햇살 아래서도 당신의 피부는 빛나야 하니까. 부드럽고 순한 선크림으로 매일을 지켜드려요.",
  "voice": "alloy",
  "model": "tts-1"
}
```

#### 필드 설명

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `text` | string | ✅ | 음성으로 변환할 텍스트 (최대 4096자) |
| `voice` | string | ❌ | 음성 타입: "alloy", "echo", "fable", "onyx", "nova", "shimmer" (기본값: "alloy") |
| `model` | string | ❌ | TTS 모델: "tts-1", "tts-1-hd" (기본값: "tts-1") |

#### 응답

**성공 (200 OK)**
```json
{
  "success": true,
  "audio": "base64_encoded_mp3_data",
  "format": "mp3",
  "voice": "alloy",
  "model": "tts-1",
  "textLength": 45
}
```

**에러 (400 Bad Request)**
```json
{
  "error": "텍스트가 필요합니다."
}
```

**에러 (400 Bad Request)**
```json
{
  "error": "텍스트가 너무 깁니다. 4096자 이하로 입력해주세요."
}
```

### 4. 환경 변수 상태 확인

**GET** `/api/check-env`

OpenAI API 키 설정 상태를 확인합니다.

#### 응답

**성공 (200 OK)**
```json
{
  "isSetup": true,
  "missingVars": [],
  "warnings": []
}
```

**에러 (200 OK)**
```json
{
  "isSetup": false,
  "missingVars": ["OPENAI_API_KEY"],
  "warnings": []
}
```

## 에러 코드

| 코드 | 설명 |
|------|------|
| 400 | 잘못된 요청 (입력 데이터 오류) |
| 401 | 인증 실패 (API 키 오류) |
| 429 | 요청 한도 초과 |
| 500 | 서버 내부 오류 |

## Rate Limiting

- **일반 생성**: 15분당 10회
- **배치 생성**: 15분당 3회
- **IP 기반 제한**: 동일 IP에서의 요청 제한

## CORS 설정

- **개발**: 모든 origin 허용
- **프로덕션**: 설정된 도메인만 허용

## 사용 예시

### JavaScript (Fetch API)

```javascript
const response = await fetch('/api/generate-marketing-copy', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    input: {
      valueProposition: "건강한 식단을 위한 유기농 채소",
      gender: "여성",
      ageGroup: "30대",
      platform: "Instagram",
      tone: "친근함",
      length: "중간",
      goal: "브랜드 인지도 제고"
    }
  })
});

const data = await response.json();
console.log(data.output.marketing_copy);
```

### cURL

```bash
curl -X POST http://localhost:3000/api/generate-marketing-copy \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "valueProposition": "건강한 식단을 위한 유기농 채소",
      "gender": "여성",
      "ageGroup": "30대",
      "platform": "Instagram",
      "tone": "친근함",
      "length": "중간",
      "goal": "브랜드 인지도 제고"
    }
  }'
```

## 주의사항

1. **API 키 보안**: OpenAI API 키는 서버에서만 사용하고 클라이언트에 노출하지 마세요.
2. **Rate Limiting**: 과도한 요청을 피하고 적절한 간격을 두고 요청하세요.
3. **에러 처리**: 모든 API 호출에 대해 적절한 에러 처리를 구현하세요.
4. **입력 검증**: 클라이언트에서 입력 데이터를 검증한 후 API를 호출하세요.
