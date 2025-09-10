// CORS 설정
import { NextRequest, NextResponse } from "next/server";

interface CorsConfig {
  origin: string | string[];
  methods: string[];
  allowedHeaders: string[];
  credentials: boolean;
}

// 기본 CORS 설정
const DEFAULT_CORS_CONFIG: CorsConfig = {
  origin: process.env.NODE_ENV === "production" 
    ? process.env.ALLOWED_ORIGINS?.split(",") || ["https://yourdomain.com"]
    : ["http://localhost:3000", "http://127.0.0.1:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
};

export function setCorsHeaders(response: NextResponse, config: CorsConfig = DEFAULT_CORS_CONFIG): NextResponse {
  const origin = response.headers.get("origin");
  
  // Origin이 허용된 목록에 있는지 확인
  if (origin && isOriginAllowed(origin, config.origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }
  
  response.headers.set("Access-Control-Allow-Methods", config.methods.join(", "));
  response.headers.set("Access-Control-Allow-Headers", config.allowedHeaders.join(", "));
  response.headers.set("Access-Control-Allow-Credentials", config.credentials.toString());
  response.headers.set("Access-Control-Max-Age", "86400"); // 24시간
  
  return response;
}

function isOriginAllowed(origin: string, allowedOrigins: string | string[]): boolean {
  if (typeof allowedOrigins === "string") {
    return allowedOrigins === "*" || allowedOrigins === origin;
  }
  
  return allowedOrigins.includes(origin);
}

export function handleCors(request: NextRequest): NextResponse | null {
  // OPTIONS 요청 처리 (Preflight)
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 200 });
    return setCorsHeaders(response);
  }
  
  return null;
}


