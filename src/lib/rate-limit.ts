// Rate Limiting 구현
import { NextRequest } from "next/server";

interface RateLimitConfig {
  windowMs: number; // 시간 윈도우 (밀리초)
  maxRequests: number; // 최대 요청 수
  message: string; // 제한 초과 시 메시지
}

// 기본 Rate Limit 설정
const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15분
  maxRequests: 10, // 15분당 10회
  message: "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.",
};

// 메모리 기반 Rate Limit 저장소 (프로덕션에서는 Redis 사용 권장)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(config: RateLimitConfig = DEFAULT_CONFIG) {
  return (request: NextRequest): { success: boolean; message?: string; remaining?: number } => {
    const clientId = getClientId(request);
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // 클라이언트별 요청 기록 가져오기
    const clientData = requestCounts.get(clientId) || { count: 0, resetTime: now + config.windowMs };

    // 윈도우가 리셋되었는지 확인
    if (now > clientData.resetTime) {
      clientData.count = 0;
      clientData.resetTime = now + config.windowMs;
    }

    // 요청 수 증가
    clientData.count++;
    requestCounts.set(clientId, clientData);

    // Rate Limit 체크
    if (clientData.count > config.maxRequests) {
      return {
        success: false,
        message: config.message,
        remaining: 0,
      };
    }

    return {
      success: true,
      remaining: Math.max(0, config.maxRequests - clientData.count),
    };
  };
}

// 클라이언트 식별자 생성
function getClientId(request: NextRequest): string {
  // IP 주소 기반 (프록시 고려)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0] || realIp || "unknown";
  
  return `rate_limit:${ip}`;
}

// Rate Limit 데이터 정리 (메모리 누수 방지)
export function cleanupRateLimit() {
  const now = Date.now();
  for (const [key, data] of requestCounts.entries()) {
    if (now > data.resetTime) {
      requestCounts.delete(key);
    }
  }
}

// 정기적으로 정리 작업 실행 (5분마다)
if (typeof window === "undefined") {
  setInterval(cleanupRateLimit, 5 * 60 * 1000);
}

