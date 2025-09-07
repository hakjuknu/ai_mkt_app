import { NextResponse } from "next/server";
import { checkEnvSetup } from "@/lib/config/env";

export async function GET() {
  try {
    const envStatus = checkEnvSetup();
    
    return NextResponse.json(envStatus);
  } catch (error) {
    console.error("환경 변수 상태 확인 오류:", error);
    
    return NextResponse.json(
      {
        isSetup: false,
        missingVars: ["환경 변수 확인 실패"],
        warnings: [],
      },
      { status: 500 }
    );
  }
}
