import type { Gender, AgeGroup, Platform, Tone, Length, Goal } from "@/types/marketing";

// 성별 옵션
export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "남성", label: "남성" },
  { value: "여성", label: "여성" },
  { value: "무관", label: "무관" },
];

// 연령대 옵션
export const AGE_GROUP_OPTIONS: { value: AgeGroup; label: string }[] = [
  { value: "10대", label: "10대" },
  { value: "20대", label: "20대" },
  { value: "30대", label: "30대" },
  { value: "40대", label: "40대" },
  { value: "50대 이상", label: "50대 이상" },
];

// 플랫폼 옵션
export const PLATFORM_OPTIONS: { value: Platform; label: string }[] = [
  { value: "Instagram", label: "Instagram" },
  { value: "Facebook", label: "Facebook" },
  { value: "TikTok", label: "TikTok" },
  { value: "YouTube", label: "YouTube" },
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "Twitter(X)", label: "Twitter(X)" },
  { value: "Email", label: "Email" },
];

// 톤/어조 옵션
export const TONE_OPTIONS: { value: Tone; label: string }[] = [
  { value: "감성적", label: "감성적" },
  { value: "직설적", label: "직설적" },
  { value: "전문적", label: "전문적" },
  { value: "유머러스", label: "유머러스" },
  { value: "고급스러움", label: "고급스러움" },
  { value: "친근함", label: "친근함" },
];

// 문구 길이 옵션
export const LENGTH_OPTIONS: { value: Length; label: string }[] = [
  { value: "짧음", label: "짧음 (한 문장)" },
  { value: "중간", label: "중간 (2~3문장)" },
  { value: "길음", label: "길음 (단락 수준)" },
];

// 목적 옵션
export const GOAL_OPTIONS: { value: Goal; label: string }[] = [
  { value: "브랜드 인지도 제고", label: "브랜드 인지도 제고" },
  { value: "구매 전환 유도", label: "구매 전환 유도" },
  { value: "클릭 유도 (CTA 강조)", label: "클릭 유도 (CTA 강조)" },
  { value: "이벤트/프로모션 홍보", label: "이벤트/프로모션 홍보" },
];

// 기본 폼 값
export const DEFAULT_FORM_VALUES = {
  valueProposition: "",
  gender: "무관" as Gender,
  ageGroup: "20대" as AgeGroup,
  platform: "Instagram" as Platform,
  tone: "친근함" as Tone,
  length: "중간" as Length,
  goal: "브랜드 인지도 제고" as Goal,
};

// API 엔드포인트
export const API_ENDPOINTS = {
  GENERATE_MARKETING_COPY: "/api/generate-marketing-copy",
} as const;

// 폼 라벨
export const FORM_LABELS = {
  VALUE_PROPOSITION: "가치 제언",
  GENDER: "성별",
  AGE_GROUP: "연령대",
  PLATFORM: "플랫폼",
  TONE: "톤/어조",
  LENGTH: "문구 길이",
  GOAL: "목적",
} as const;

// 폼 플레이스홀더
export const FORM_PLACEHOLDERS = {
  VALUE_PROPOSITION: "제품의 핵심 가치나 메시지를 입력하세요",
} as const;

