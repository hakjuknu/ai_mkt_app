import { z } from "zod";
import type { MarketingFormData } from "@/types/marketing";

// 마케팅 폼 유효성 검사 스키마
export const marketingFormSchema = z.object({
  valueProposition: z
    .string()
    .min(10, "가치 제언은 최소 10자 이상 입력해주세요")
    .max(500, "가치 제언은 500자를 초과할 수 없습니다")
    .trim(),
  
  gender: z.enum(["남성", "여성", "무관"], {
    required_error: "성별을 선택해주세요",
  }),
  
  ageGroup: z.enum(["10대", "20대", "30대", "40대", "50대 이상"], {
    required_error: "연령대를 선택해주세요",
  }),
  
  platform: z.enum([
    "Instagram", 
    "Facebook", 
    "TikTok", 
    "YouTube", 
    "LinkedIn", 
    "Twitter(X)", 
    "Email"
  ], {
    required_error: "플랫폼을 선택해주세요",
  }),
  
  tone: z.enum([
    "감성적", 
    "직설적", 
    "전문적", 
    "유머러스", 
    "고급스러움", 
    "친근함"
  ], {
    required_error: "톤/어조를 선택해주세요",
  }),
  
  length: z.enum(["짧음", "중간", "길음"], {
    required_error: "문구 길이를 선택해주세요",
  }),
  
  goal: z.enum([
    "브랜드 인지도 제고", 
    "구매 전환 유도", 
    "클릭 유도 (CTA 강조)", 
    "이벤트/프로모션 홍보"
  ], {
    required_error: "목적을 선택해주세요",
  }),
});

// 타입 추출
export type MarketingFormSchema = z.infer<typeof marketingFormSchema>;

// 폼 데이터 변환 함수
export function transformFormData(data: MarketingFormSchema): MarketingFormData {
  return {
    valueProposition: data.valueProposition,
    gender: data.gender,
    ageGroup: data.ageGroup,
    platform: data.platform,
    tone: data.tone,
    length: data.length,
    goal: data.goal,
  };
}

// 에러 메시지 매핑
export const getFieldErrorMessage = (error: string | undefined): string => {
  if (!error) return "";
  
  const errorMap: Record<string, string> = {
    "String must contain at least 10 character(s)": "가치 제언은 최소 10자 이상 입력해주세요",
    "String must contain at most 500 character(s)": "가치 제언은 500자를 초과할 수 없습니다",
    "Required": "필수 입력 항목입니다",
  };
  
  return errorMap[error] || error;
};

