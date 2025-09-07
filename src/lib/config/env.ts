// 환경 변수 설정 및 검증

export const env = {
  // OpenAI API 키
  OPENAI_API_KEY: process.env.OPENAI_API_KEY?.trim().replace(/\n/g, '') || "",
  
  // API URL
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  
  // 개발 환경 여부
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
  
  // 프로덕션 환경 여부
  IS_PRODUCTION: process.env.NODE_ENV === "production",
} as const;

// API 키 유효성 검사
export function validateOpenAIKey(): boolean {
  // 환경 변수에서 API 키 가져오기 (줄바꿈 제거)
  const apiKey = process.env.OPENAI_API_KEY?.trim().replace(/\n/g, '') || "";
  
  console.log("🔍 API 키 검증 중...");
  console.log("Raw API Key:", process.env.OPENAI_API_KEY);
  console.log("Processed API Key:", apiKey);
  console.log("Length:", apiKey.length);
  
  if (!apiKey) {
    console.error("❌ OPENAI_API_KEY가 설정되지 않았습니다.");
    return false;
  }
  
  if (apiKey === "your_openai_api_key_here") {
    console.error("❌ OPENAI_API_KEY를 실제 키로 변경해주세요.");
    return false;
  }
  
  if (!apiKey.startsWith("sk-")) {
    console.error("❌ 올바른 OpenAI API 키 형식이 아닙니다. 현재 키:", apiKey.substring(0, 10) + "...");
    return false;
  }
  
  console.log("✅ OpenAI API 키가 올바르게 설정되었습니다.");
  return true;
}

// 환경 변수 설정 상태 확인
export function checkEnvSetup(): {
  isSetup: boolean;
  missingVars: string[];
  warnings: string[];
} {
  const missingVars: string[] = [];
  const warnings: string[] = [];
  
  if (!env.OPENAI_API_KEY || env.OPENAI_API_KEY === "") {
    missingVars.push("OPENAI_API_KEY");
  } else if (env.OPENAI_API_KEY === "your_openai_api_key_here") {
    warnings.push("OPENAI_API_KEY가 기본값으로 설정되어 있습니다.");
  } else if (!env.OPENAI_API_KEY.startsWith("sk-")) {
    warnings.push("OPENAI_API_KEY 형식이 올바르지 않을 수 있습니다.");
  }
  
  return {
    isSetup: missingVars.length === 0 && warnings.length === 0,
    missingVars,
    warnings,
  };
}
