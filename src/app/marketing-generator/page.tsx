"use client";

import { useState } from "react";
import { MarketingForm } from "@/components/marketing-form";
import { ResultDisplay } from "@/components/result-display";
import { AllResultsDisplay } from "@/components/all-results-display";
import { HistoryPanel } from "@/components/history-panel";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, History, BarChart3 } from "lucide-react";
import Link from "next/link";
import { saveToHistory } from "@/lib/storage/history";
import { analytics } from "@/lib/analytics";
import type { MarketingFormSchema, MarketingResponse } from "@/types/marketing";

export default function MarketingGeneratorPage() {
  const [result, setResult] = useState<MarketingResponse | null>(null);
  const [allResults, setAllResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleFormSubmit = async (data: MarketingFormSchema) => {
    const startTime = Date.now();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate-marketing-copy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "마케팅 문구 생성에 실패했습니다.");
      }

      const resultData: MarketingResponse = await response.json();
      setResult(resultData);
      
      // 이력에 저장
      saveToHistory(resultData);
      
      // 분석 데이터 추적
      const generationTime = Date.now() - startTime;
      analytics.trackMarketingGeneration({
        platform: data.platform,
        tone: data.tone,
        length: data.length,
        generationTime,
        success: true,
      });
    } catch (err) {
      console.error("마케팅 문구 생성 오류:", err);
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      
      // 에러 추적
      analytics.trackError(err instanceof Error ? err : new Error(String(err)), 'marketing_generation');
      
      // 실패한 생성 시도 추적
      const generationTime = Date.now() - startTime;
      analytics.trackMarketingGeneration({
        platform: data.platform,
        tone: data.tone,
        length: data.length,
        generationTime,
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAll = async (data: MarketingFormSchema) => {
    const startTime = Date.now();
    setIsGeneratingAll(true);
    setError(null);
    setAllResults(null);

    try {
      const response = await fetch("/api/generate-all-marketing-copy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "모든 옵션 문구 생성에 실패했습니다.");
      }

      const resultData = await response.json();
      setAllResults(resultData);
      
      // 분석 데이터 추적
      const generationTime = Date.now() - startTime;
      analytics.trackEvent('all_options_generation', {
        totalCombinations: resultData.totalCombinations,
        successCount: resultData.successCount,
        errorCount: resultData.errorCount,
        generationTime,
        success: true,
      });
    } catch (err) {
      console.error("모든 옵션 문구 생성 오류:", err);
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      
      // 에러 추적
      analytics.trackError(err instanceof Error ? err : new Error(String(err)), 'all_options_generation');
    } finally {
      setIsGeneratingAll(false);
    }
  };

  const handleRegenerate = () => {
    setResult(null);
    setAllResults(null);
    setError(null);
  };

  const handleSelectHistory = (historyResult: MarketingResponse) => {
    setResult(historyResult);
    setError(null);
  };

  const handleRegenerateFromHistory = async (input: MarketingResponse["input"]) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate-marketing-copy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "마케팅 문구 생성에 실패했습니다.");
      }

      const resultData: MarketingResponse = await response.json();
      setResult(resultData);
      saveToHistory(resultData);
    } catch (err) {
      console.error("마케팅 문구 생성 오류:", err);
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                홈으로 돌아가기
              </Link>
            </Button>
            <div className="flex gap-2">
              <Button
                variant={showHistory ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setShowHistory(!showHistory);
                  setShowAnalytics(false);
                }}
              >
                <History className="w-4 h-4 mr-2" />
                {showHistory ? "폼 보기" : "이력 보기"}
              </Button>
              <Button
                variant={showAnalytics ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setShowAnalytics(!showAnalytics);
                  setShowHistory(false);
                }}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                {showAnalytics ? "폼 보기" : "통계 보기"}
              </Button>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              AI 마케팅 문구 생성기
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              가치 제언과 타겟팅 옵션을 입력하면, AI가 플랫폼별 최적화된 마케팅 문구를 생성해드립니다.
            </p>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 메인 콘텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 폼 영역, 이력 영역 또는 통계 영역 */}
          <div className="space-y-6">
                  {showHistory ? (
                    <HistoryPanel
                      onSelectHistory={handleSelectHistory}
                      onRegenerateFromHistory={handleRegenerateFromHistory}
                    />
                  ) : showAnalytics ? (
                    <AnalyticsDashboard onRefresh={() => {}} />
                  ) : (
                    <MarketingForm 
                      onSubmit={handleFormSubmit} 
                      onGenerateAll={handleGenerateAll}
                      isLoading={isLoading} 
                      isGeneratingAll={isGeneratingAll}
                    />
                  )}
            
            {/* 사용 가이드 (폼 모드에서만 표시) */}
            {!showHistory && !showAnalytics && (
              <Card>
              <CardHeader>
                <CardTitle className="text-lg">사용 가이드</CardTitle>
                <CardDescription>
                  효과적인 마케팅 문구를 생성하기 위한 팁
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium mb-1">✨ 자동 샘플 문구</h4>
                  <p className="text-muted-foreground">
                    매번 접속할 때마다 다양한 샘플 문구가 자동으로 입력됩니다. "새로운 문구 생성" 버튼으로 언제든 변경 가능합니다.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">🎯 두 가지 생성 방식</h4>
                  <p className="text-muted-foreground">
                    <strong>선택한 옵션으로 문구 생성:</strong> 현재 선택된 옵션 조합으로 하나의 문구를 생성합니다.<br/>
                    <strong>모든 옵션으로 문구 생성:</strong> 모든 옵션 조합에 대해 문구를 생성합니다 (시간이 오래 걸릴 수 있습니다).
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">가치 제언 작성 팁</h4>
                  <p className="text-muted-foreground">
                    제품이나 서비스의 핵심 가치를 명확하고 구체적으로 설명해주세요.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">타겟팅 설정</h4>
                  <p className="text-muted-foreground">
                    정확한 타겟 고객을 설정하면 더 효과적인 문구가 생성됩니다.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">플랫폼별 최적화</h4>
                  <p className="text-muted-foreground">
                    각 플랫폼의 특성에 맞는 문구가 자동으로 생성됩니다.
                  </p>
                </div>
              </CardContent>
            </Card>
            )}
          </div>

          {/* 결과 영역 */}
          <div className="space-y-6">
            {/* 선택한 옵션 결과 */}
            <ResultDisplay
              result={result}
              isLoading={isLoading}
              onRegenerate={handleRegenerate}
            />

            {/* 모든 옵션 결과 */}
            <AllResultsDisplay
              results={allResults}
              isLoading={isGeneratingAll}
              onRegenerate={handleRegenerate}
            />

            {/* 결과가 있을 때 추가 정보 */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">다음 단계</CardTitle>
                  <CardDescription>
                    생성된 문구를 활용하는 방법
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium mb-1">1. 문구 검토</h4>
                    <p className="text-muted-foreground">
                      생성된 문구를 검토하고 필요시 수정하세요.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">2. A/B 테스트</h4>
                    <p className="text-muted-foreground">
                      여러 버전을 생성하여 효과를 비교해보세요.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">3. 실제 적용</h4>
                    <p className="text-muted-foreground">
                      선택한 플랫폼에 맞게 최종 문구를 적용하세요.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
