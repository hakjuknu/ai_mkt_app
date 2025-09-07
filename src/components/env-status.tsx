"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";

interface EnvStatus {
  isSetup: boolean;
  missingVars: string[];
  warnings: string[];
}

export function EnvStatus() {
  const [envStatus, setEnvStatus] = useState<EnvStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkEnvStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/check-env");
      const data = await response.json();
      setEnvStatus(data);
    } catch (error) {
      console.error("환경 변수 상태 확인 실패:", error);
      setEnvStatus({
        isSetup: false,
        missingVars: ["API 연결 실패"],
        warnings: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkEnvStatus();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            환경 변수 확인 중...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!envStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="w-4 h-4" />
            환경 변수 확인 실패
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={checkEnvStatus} variant="outline" size="sm">
            다시 확인
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {envStatus.isSetup ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500" />
          )}
          환경 변수 상태
        </CardTitle>
        <CardDescription>
          OpenAI API 키 설정 상태를 확인합니다
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={envStatus.isSetup ? "default" : "destructive"}>
            {envStatus.isSetup ? "설정 완료" : "설정 필요"}
          </Badge>
          <Button onClick={checkEnvStatus} variant="outline" size="sm">
            새로고침
          </Button>
        </div>

        {envStatus.missingVars.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-destructive">누락된 변수:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {envStatus.missingVars.map((variable) => (
                <li key={variable} className="flex items-center gap-2">
                  <XCircle className="w-3 h-3 text-red-500" />
                  {variable}
                </li>
              ))}
            </ul>
          </div>
        )}

        {envStatus.warnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-yellow-600">경고:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {envStatus.warnings.map((warning) => (
                <li key={warning} className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-yellow-500" />
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {envStatus.isSetup && (
          <div className="text-sm text-green-600 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            모든 환경 변수가 올바르게 설정되었습니다.
          </div>
        )}

        <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
          <p className="font-medium mb-1">설정 방법:</p>
          <ol className="space-y-1 list-decimal list-inside">
            <li>프로젝트 루트에 <code>.env.local</code> 파일 생성</li>
            <li><code>OPENAI_API_KEY=your_api_key_here</code> 추가</li>
            <li>개발 서버 재시작</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}

