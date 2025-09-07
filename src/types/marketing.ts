// 마케팅 문구 생성 관련 타입 정의

// 성별 옵션
export type Gender = "남성" | "여성" | "무관";

// 연령대 옵션
export type AgeGroup = "10대" | "20대" | "30대" | "40대" | "50대 이상";

// 플랫폼 옵션
export type Platform = 
  | "Instagram" 
  | "Facebook" 
  | "TikTok" 
  | "YouTube" 
  | "LinkedIn" 
  | "Twitter(X)" 
  | "Email";

// 톤/어조 옵션
export type Tone = 
  | "감성적" 
  | "직설적" 
  | "전문적" 
  | "유머러스" 
  | "고급스러움" 
  | "친근함";

// 문구 길이 옵션
export type Length = "짧음" | "중간" | "길음";

// 목적 옵션
export type Goal = 
  | "브랜드 인지도 제고" 
  | "구매 전환 유도" 
  | "클릭 유도 (CTA 강조)" 
  | "이벤트/프로모션 홍보";

// 폼 입력 데이터 타입
export interface MarketingFormData {
  valueProposition: string;
  gender: Gender;
  ageGroup: AgeGroup;
  platform: Platform;
  tone: Tone;
  length: Length;
  goal: Goal;
}

// API 요청 타입
export interface MarketingRequest {
  input: MarketingFormData;
}

// API 응답 타입 (기능명세서 JSON 구조)
export interface MarketingResponse {
  input: MarketingFormData;
  output: {
    marketing_copy: string;
  };
}

// 폼 상태 타입
export interface FormState {
  isLoading: boolean;
  error: string | null;
  result: MarketingResponse | null;
}

// 폼 유효성 검사 스키마를 위한 타입
export interface FormValidationErrors {
  valueProposition?: string;
  gender?: string;
  ageGroup?: string;
  platform?: string;
  tone?: string;
  length?: string;
  goal?: string;
}

