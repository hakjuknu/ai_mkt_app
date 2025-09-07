"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Check, Download, Search, Filter, RefreshCw, Volume2 } from "lucide-react";
import { CompactTTSPlayer } from "@/components/compact-tts-player";
import type { MarketingResponse } from "@/types/marketing";

interface AllResultsDisplayProps {
  results: AllResultsData | null;
  isLoading?: boolean;
  onRegenerate?: () => void;
}

interface AllResultsData {
  input: MarketingResponse["input"];
  results: Array<{
    input: MarketingResponse["input"];
    output: MarketingResponse["output"];
    error?: string;
  }>;
  totalCombinations: number;
  successCount: number;
  errorCount: number;
}

export function AllResultsDisplay({ results, isLoading = false, onRegenerate }: AllResultsDisplayProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [filterTone, setFilterTone] = useState<string>("all");
  const [copiedItems, setCopiedItems] = useState<Set<number>>(new Set());

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-primary" />
            모든 옵션으로 문구를 생성하고 있습니다...
          </CardTitle>
          <CardDescription>
            잠시만 기다려주세요. 모든 옵션 조합에 대한 마케팅 문구를 생성하고 있습니다.
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

  if (!results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>모든 옵션 문구 생성</CardTitle>
          <CardDescription>
            가치 제언에 대해 모든 옵션 조합으로 마케팅 문구를 생성합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            "모든 옵션으로 문구 생성" 버튼을 클릭하여 시작하세요.
          </p>
        </CardContent>
      </Card>
    );
  }

  // 필터링된 결과
  const filteredResults = results.results.filter((item) => {
    const matchesSearch = item.output.marketing_copy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform === "all" || item.input.platform === filterPlatform;
    const matchesTone = filterTone === "all" || item.input.tone === filterTone;
    
    return matchesSearch && matchesPlatform && matchesTone;
  });

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set([...prev, index]));
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  const handleDownloadAll = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `all-marketing-copy-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-primary" />
          모든 옵션 문구 생성 결과
        </CardTitle>
        <CardDescription>
          총 {results.totalCombinations}개 조합 중 {results.successCount}개 성공, {results.errorCount}개 실패
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{results.totalCombinations}</div>
            <div className="text-sm text-muted-foreground">총 조합 수</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{results.successCount}</div>
            <div className="text-sm text-muted-foreground">성공</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{results.errorCount}</div>
            <div className="text-sm text-muted-foreground">실패</div>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="문구 내용으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterPlatform} onValueChange={setFilterPlatform}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="플랫폼 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 플랫폼</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="TikTok">TikTok</SelectItem>
                <SelectItem value="YouTube">YouTube</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Twitter(X)">Twitter(X)</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTone} onValueChange={setFilterTone}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="톤 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 톤</SelectItem>
                <SelectItem value="감성적">감성적</SelectItem>
                <SelectItem value="직설적">직설적</SelectItem>
                <SelectItem value="전문적">전문적</SelectItem>
                <SelectItem value="유머러스">유머러스</SelectItem>
                <SelectItem value="고급스러움">고급스러움</SelectItem>
                <SelectItem value="친근함">친근함</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {filteredResults.length}개 결과 표시 중
            </p>
            <Button variant="outline" size="sm" onClick={handleDownloadAll}>
              <Download className="w-4 h-4 mr-2" />
              전체 다운로드
            </Button>
          </div>
        </div>

        {/* 결과 목록 */}
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {filteredResults.map((item, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{item.input.gender}</Badge>
                      <Badge variant="outline">{item.input.ageGroup}</Badge>
                      <Badge variant="outline">{item.input.platform}</Badge>
                      <Badge variant="outline">{item.input.tone}</Badge>
                      <Badge variant="outline">{item.input.length}</Badge>
                      <Badge variant="outline">{item.input.goal}</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(item.output.marketing_copy, index)}
                    >
                      {copiedItems.has(index) ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {item.error ? (
                    <div className="text-red-600 text-sm">
                      <strong>오류:</strong> {item.error}
                    </div>
                  ) : (
                    <>
                      <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap">{item.output.marketing_copy}</p>
                      </div>
                      
                      {/* TTS 플레이어 */}
                      <CompactTTSPlayer 
                        text={item.output.marketing_copy} 
                        className="border-t pt-3"
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {filteredResults.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            검색 조건에 맞는 결과가 없습니다.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

