"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  History, 
  Trash2, 
  Copy, 
  Download, 
  RefreshCw, 
  BarChart3,
  Calendar,
  Filter
} from "lucide-react";
import { getHistory, deleteFromHistory, clearHistory, getHistoryStats, type HistoryItem } from "@/lib/storage/history";
import type { MarketingResponse } from "@/types/marketing";

interface HistoryPanelProps {
  onSelectHistory: (result: MarketingResponse) => void;
  onRegenerateFromHistory: (input: MarketingResponse["input"]) => void;
}

export function HistoryPanel({ onSelectHistory, onRegenerateFromHistory }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [stats, setStats] = useState(getHistoryStats());
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const historyData = getHistory();
    setHistory(historyData);
    setStats(getHistoryStats());
  };

  const handleDelete = (id: string) => {
    deleteFromHistory(id);
    loadHistory();
  };

  const handleClearAll = () => {
    if (confirm("모든 이력을 삭제하시겠습니까?")) {
      clearHistory();
      loadHistory();
    }
  };

  const handleCopy = async (result: MarketingResponse) => {
    try {
      await navigator.clipboard.writeText(result.output.marketing_copy);
    } catch (error) {
      console.error("복사 실패:", error);
    }
  };

  const handleDownload = (result: MarketingResponse) => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `marketing-copy-${result.input.valueProposition.slice(0, 20)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredHistory = selectedPlatform === "all" 
    ? history 
    : history.filter(item => item.input.platform === selectedPlatform);

  const platforms = Array.from(new Set(history.map(item => item.input.platform)));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          생성 이력
          <Badge variant="secondary">{history.length}</Badge>
        </CardTitle>
        <CardDescription>
          이전에 생성한 마케팅 문구들을 확인하고 재사용할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 통계 정보 */}
        {history.length > 0 && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalCount}</div>
              <div className="text-sm text-muted-foreground">총 생성</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {platforms.length}
              </div>
              <div className="text-sm text-muted-foreground">사용 플랫폼</div>
            </div>
          </div>
        )}

        {/* 필터 */}
        {history.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">플랫폼 필터</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedPlatform === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPlatform("all")}
              >
                전체
              </Button>
              {platforms.map(platform => (
                <Button
                  key={platform}
                  variant={selectedPlatform === platform ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPlatform(platform)}
                >
                  {platform}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* 이력 목록 */}
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>아직 생성된 이력이 없습니다.</p>
            <p className="text-sm">마케팅 문구를 생성해보세요!</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {filteredHistory.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <h4 className="font-medium text-sm line-clamp-2">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {item.createdAt.toLocaleString()}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">
                        {item.input.platform}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.input.tone}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.input.length}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.output.marketing_copy}
                    </p>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectHistory(item)}
                        className="flex-1"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        선택
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRegenerateFromHistory(item.input)}
                        className="flex-1"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        재생성
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(item)}
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* 전체 삭제 버튼 */}
        {history.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleClearAll}
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            모든 이력 삭제
          </Button>
        )}
      </CardContent>
    </Card>
  );
}


