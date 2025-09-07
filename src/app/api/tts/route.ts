import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { setCorsHeaders, handleCors } from "@/lib/cors";
import { rateLimit } from "@/lib/rate-limit";
import { apiLogger } from "@/lib/logger";
import type { TTSRequest, TTSResponse, Voice } from "@/types/tts";

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY?.trim().replace(/\n/g, ''),
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // 요청 로깅
    apiLogger.request('POST', '/api/tts');
    
    // CORS 처리
    const corsResponse = handleCors(request);
    if (corsResponse) {
      return corsResponse;
    }

    // Rate Limiting 적용
    const rateLimitResult = rateLimit()(request);
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
    const body: TTSRequest = await request.json();
    const { text, voice = "alloy", model = "tts-1" } = body;
    
    if (!text || typeof text !== 'string') {
      const response = NextResponse.json(
        { error: "텍스트가 필요합니다." },
        { status: 400 }
      );
      return setCorsHeaders(response);
    }

    // 텍스트 길이 제한 (OpenAI TTS 제한: 4096자)
    if (text.length > 4096) {
      const response = NextResponse.json(
        { error: "텍스트가 너무 깁니다. 4096자 이하로 입력해주세요." },
        { status: 400 }
      );
      return setCorsHeaders(response);
    }

    // 지원되는 음성 목록
    const supportedVoices: Voice[] = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];
    if (!supportedVoices.includes(voice as Voice)) {
      const response = NextResponse.json(
        { error: `지원되지 않는 음성입니다. 지원 음성: ${supportedVoices.join(', ')}` },
        { status: 400 }
      );
      return setCorsHeaders(response);
    }

    // OpenAI TTS API 호출
    const mp3 = await openai.audio.speech.create({
      model: model,
      voice: voice as any,
      input: text,
      response_format: "mp3",
    });

    // 오디오 데이터를 Buffer로 변환
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Base64로 인코딩
    const base64Audio = buffer.toString('base64');
    
    // 성공 로깅
    const responseTime = Date.now() - startTime;
    apiLogger.response(200, responseTime);

    // 응답 데이터 구성
    const responseData: TTSResponse = {
      success: true,
      audio: base64Audio,
      format: "mp3",
      voice: voice as Voice,
      model: model as any,
      textLength: text.length
    };
    
    const response = NextResponse.json(responseData);
    
    return setCorsHeaders(response);

  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorInstance = error instanceof Error ? error : new Error(String(error));
    
    // 에러 로깅
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

      if (error.message.includes("rate_limit_exceeded")) {
        const response = NextResponse.json(
          { error: "TTS 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요." },
          { status: 429 }
        );
        return setCorsHeaders(response);
      }
    }

    const response = NextResponse.json(
      { error: "TTS 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
    return setCorsHeaders(response);
  }
}
