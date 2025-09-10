"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TTSPlayer } from "@/components/tts-player";
import { Copy, Check, Download, RefreshCw } from "lucide-react";
import type { MarketingResponse } from "@/types/marketing";

interface ResultDisplayProps {
  result: MarketingResponse | null;
  isLoading?: boolean;
  onRegenerate?: () => void;
}

export function ResultDisplay({ result, isLoading = false, onRegenerate }: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result) return;
    
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("복사 실패:", error);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `marketing-copy-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-primary" />
            AI가 문구를 생성하고 있습니다...
          </CardTitle>
          <CardDescription>
            잠시만 기다려주세요. 최적화된 마케팅 문구를 생성하고 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>생성된 문구가 없습니다</CardTitle>
          <CardDescription>
            위의 폼을 작성하고 &quot;마케팅 문구 생성하기&quot; 버튼을 클릭하세요.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>생성된 마케팅 문구</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={copied}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  복사됨
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  복사
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              다운로드
            </Button>
            {onRegenerate && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRegenerate}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                다시 생성
              </Button>
            )}
          </div>
        </CardTitle>
        <CardDescription>
          AI가 생성한 최적화된 마케팅 문구입니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 생성된 마케팅 문구 */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">생성된 문구</h4>
          <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
            <p className="text-base leading-relaxed whitespace-pre-wrap">
              {result.output.marketing_copy}
            </p>
          </div>
          
          {/* TTS 플레이어 */}
          <TTSPlayer text={result.output.marketing_copy} />
        </div>

        {/* 입력된 옵션들 */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">사용된 옵션</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">가치 제언</p>
              <p className="text-sm font-medium truncate" title={result.input.valueProposition}>
                {result.input.valueProposition}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">성별</p>
              <Badge variant="secondary">{result.input.gender}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">연령대</p>
              <Badge variant="secondary">{result.input.ageGroup}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">플랫폼</p>
              <Badge variant="secondary">{result.input.platform}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">톤/어조</p>
              <Badge variant="secondary">{result.input.tone}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">문구 길이</p>
              <Badge variant="secondary">{result.input.length}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">목적</p>
              <Badge variant="secondary">{result.input.goal}</Badge>
            </div>
          </div>
        </div>

        {/* JSON 원본 데이터 */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">JSON 데이터</h4>
          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
              <code>{JSON.stringify(result, null, 2)}</code>
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

