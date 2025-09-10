import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
// import { env, validateOpenAIKey } from "@/lib/config/env";
import { rateLimit } from "@/lib/rate-limit";
import { setCorsHeaders, handleCors } from "@/lib/cors";
import { apiLogger, marketingLogger } from "@/lib/logger";
import type { MarketingRequest } from "@/types/marketing";
import { 
  GENDER_OPTIONS, 
  AGE_GROUP_OPTIONS, 
  PLATFORM_OPTIONS, 
  TONE_OPTIONS, 
  LENGTH_OPTIONS, 
  GOAL_OPTIONS 
} from "@/lib/constants/marketing";

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY?.trim().replace(/\n/g, ''),
});

// 모든 옵션 조합 생성 (현재는 사용하지 않음)

// 제한된 옵션 조합 생성 (성능을 위해 일부 옵션만 선택)
function generateLimitedCombinations(valueProposition: string) {
  const combinations = [];
  
  // 매우 제한된 옵션들만 선택하여 조합 수를 크게 제한
  const limitedGenders = GENDER_OPTIONS.slice(0, 2); // 남성, 여성만
  const limitedAgeGroups = AGE_GROUP_OPTIONS.slice(0, 2); // 10대, 20대만
  const limitedPlatforms = PLATFORM_OPTIONS.slice(0, 2); // Instagram, Facebook만
  const limitedTones = TONE_OPTIONS.slice(0, 2); // 감성적, 직설적만
  const limitedLengths = LENGTH_OPTIONS.slice(0, 1); // 짧음만
  const limitedGoals = GOAL_OPTIONS.slice(0, 1); // 브랜드 인지도만
  
  for (const gender of limitedGenders) {
    for (const ageGroup of limitedAgeGroups) {
      for (const platform of limitedPlatforms) {
        for (const tone of limitedTones) {
          for (const length of limitedLengths) {
            for (const goal of limitedGoals) {
              combinations.push({
                valueProposition,
                gender: gender.value,
                ageGroup: ageGroup.value,
                platform: platform.value,
                tone: tone.value,
                length: length.value,
                goal: goal.value,
              });
            }
          }
        }
      }
    }
  }
  
  return combinations;
}

// 프롬프트 생성 함수
function createPrompt(input: MarketingRequest["input"]): string {
  const {
    valueProposition,
    gender,
    ageGroup,
    platform,
    tone,
    length,
    goal,
  } = input;

  const lengthInstruction = {
    "짧음": "한 문장으로 간결하게",
    "중간": "2-3문장으로 적당한 길이로",
    "길음": "단락 수준으로 자세하게"
  }[length];

  const toneInstruction = {
    "감성적": "감정을 자극하고 마음을 움직이는 따뜻한 톤으로",
    "직설적": "명확하고 직접적인 메시지로",
    "전문적": "신뢰감을 주는 전문적이고 신중한 톤으로",
    "유머러스": "재미있고 유쾌한 톤으로",
    "고급스러움": "세련되고 고급스러운 톤으로",
    "친근함": "친근하고 편안한 톤으로"
  }[tone];

  const platformInstruction = {
    "Instagram": "Instagram에 최적화된 해시태그와 함께",
    "Facebook": "Facebook에 적합한 커뮤니티 중심의",
    "TikTok": "TikTok에 맞는 짧고 임팩트 있는",
    "YouTube": "YouTube에 적합한 설명적인",
    "LinkedIn": "LinkedIn에 맞는 전문적인 비즈니스",
    "Twitter(X)": "Twitter(X)에 최적화된 간결한",
    "Email": "이메일 마케팅에 적합한 개인화된"
  }[platform];

  const goalInstruction = {
    "브랜드 인지도 제고": "브랜드 인지도를 높이는 데 중점을 두고",
    "구매 전환 유도": "구매로 이어지는 전환에 중점을 두고",
    "클릭 유도 (CTA 강조)": "클릭을 유도하는 강력한 CTA와 함께",
    "이벤트/프로모션 홍보": "이벤트나 프로모션을 효과적으로 홍보하는"
  }[goal];

  return `당신은 10년 경력의 전문 마케팅 카피라이터입니다. 주어진 조건에 따라 최적화된 마케팅 문구를 생성해주세요.

**📝 제품/서비스 가치 제언:**
${valueProposition}

**🎯 타겟 고객:**
- 성별: ${gender}
- 연령대: ${ageGroup}

**📱 플랫폼:** ${platform}
**🎨 톤/어조:** ${tone}
**📏 문구 길이:** ${length}
**🎯 목적:** ${goal}

**✨ 고급 생성 요구사항:**
1. ${platformInstruction} 문구를 작성해주세요
2. ${toneInstruction} 작성해주세요
3. ${lengthInstruction} 작성해주세요
4. ${goalInstruction} 작성해주세요
5. ${ageGroup} ${gender} 고객층의 언어 패턴과 관심사 반영
6. 플랫폼별 최적화된 이모지와 해시태그 전략적 활용
7. 브랜드의 고유한 가치와 차별점이 명확히 드러나도록 작성
8. 고객의 감정을 자극하고 행동을 유도하는 문구로 작성
9. 경쟁사와 차별화되는 독창적인 메시지로 작성
10. 한국어로 자연스럽고 매력적으로 작성

**📤 응답 형식:**
JSON 형식으로 응답하되, marketing_copy 필드에 생성된 문구를 넣어주세요. 문구는 플랫폼에 맞는 형식으로 작성해주세요.`;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // 요청 로깅
    apiLogger.request('POST', '/api/generate-all-marketing-copy');
    
    // CORS 처리
    const corsResponse = handleCors(request);
    if (corsResponse) {
      return corsResponse;
    }

    // Rate Limiting 적용 (모든 옵션 생성은 더 엄격하게)
    const rateLimitResult = rateLimit({
      windowMs: 15 * 60 * 1000, // 15분
      maxRequests: 3, // 15분당 3회만 허용
      message: "모든 옵션 생성은 15분당 3회까지만 가능합니다. 잠시 후 다시 시도해주세요.",
    })(request);
    
    if (!rateLimitResult.success) {
      const response = NextResponse.json(
        { error: rateLimitResult.message },
        { status: 429 }
      );
      return setCorsHeaders(response);
    }

    // API 키 검증
    const apiKey = process.env.OPENAI_API_KEY?.trim().replace(/\n/g, '');
    
    if (!apiKey || !apiKey.startsWith("sk-")) {
      const response = NextResponse.json(
        { error: "OpenAI API 키가 올바르게 설정되지 않았습니다." },
        { status: 401 }
      );
      return setCorsHeaders(response);
    }

    // 요청 데이터 파싱
    const body: MarketingRequest = await request.json();
    
    if (!body.input) {
      const response = NextResponse.json(
        { error: "입력 데이터가 올바르지 않습니다." },
        { status: 400 }
      );
      return setCorsHeaders(response);
    }

    // 모든 옵션 조합 생성 (제한된 조합)
    const allCombinations = generateLimitedCombinations(body.input.valueProposition);
    
    // 조합 수가 너무 많으면 제한 (더 엄격하게)
    if (allCombinations.length > 20) {
      const response = NextResponse.json(
        { error: "옵션 조합이 너무 많습니다. 일부 옵션을 제한해주세요." },
        { status: 400 }
      );
      return setCorsHeaders(response);
    }

    // 배치 생성 시작 로깅
    marketingLogger.batchGenerationStart(allCombinations.length);

    // 모든 조합에 대해 마케팅 문구 생성
    const results = [];
    const batchSize = 3; // 한 번에 3개씩 처리 (API 호출 제한 고려)
    
    for (let i = 0; i < allCombinations.length; i += batchSize) {
      const batch = allCombinations.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (combination) => {
        try {
          const prompt = createPrompt(combination);
          
          const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "당신은 전문적인 마케팅 카피라이터입니다. 주어진 조건에 맞는 효과적인 마케팅 문구를 생성해주세요."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: 500,
            temperature: 0.7,
          });

          const generatedContent = completion.choices[0]?.message?.content?.trim();

          if (!generatedContent) {
            return {
              input: combination,
              output: { marketing_copy: "문구 생성에 실패했습니다." },
              error: "생성 실패"
            };
          }

          // JSON 응답 파싱 시도
          let generatedCopy: string;
          try {
            const parsedResponse = JSON.parse(generatedContent);
            generatedCopy = parsedResponse.marketing_copy || generatedContent;
          } catch {
            // JSON 파싱 실패 시 원본 텍스트 사용
            generatedCopy = generatedContent;
          }

          return {
            input: combination,
            output: { marketing_copy: generatedCopy }
          };
        } catch (error) {
          console.error(`조합 ${i} 생성 오류:`, error);
          return {
            input: combination,
            output: { marketing_copy: "문구 생성에 실패했습니다." },
            error: error instanceof Error ? error.message : "알 수 없는 오류"
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // 진행률 로깅
      marketingLogger.batchGenerationProgress(results.length, allCombinations.length);
      
      // API 호출 간격 조절 (Rate Limiting 방지)
      if (i + batchSize < allCombinations.length) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기
      }
    }

    // 배치 생성 완료 로깅
    const responseTime = Date.now() - startTime;
    marketingLogger.batchGenerationComplete(results, responseTime);
    apiLogger.response(200, responseTime);

    // 응답 데이터 구성
    const response = NextResponse.json({
      input: body.input,
      results: results,
      totalCombinations: allCombinations.length,
      successCount: results.filter(r => !r.error).length,
      errorCount: results.filter(r => r.error).length
    });
    
    return setCorsHeaders(response);

  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorInstance = error instanceof Error ? error : new Error(String(error));
    
    // 에러 로깅
    marketingLogger.generationError(errorInstance, body?.input || {});
    apiLogger.error(errorInstance, { responseTime });
    
    // OpenAI API 오류 처리
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        const response = NextResponse.json(
          { error: "OpenAI API 키가 유효하지 않습니다." },
          { status: 401 }
        );
        return setCorsHeaders(response);
      }
      
      if (error.message.includes("quota")) {
        const response = NextResponse.json(
          { error: "OpenAI API 사용량을 초과했습니다." },
          { status: 429 }
        );
        return setCorsHeaders(response);
      }
    }

    const response = NextResponse.json(
      { error: "모든 옵션 마케팅 문구 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
    return setCorsHeaders(response);
  }
}
