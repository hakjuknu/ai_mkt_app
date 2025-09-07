"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  Target,
  Hash,
  Download,
  RefreshCw
} from "lucide-react";
import { getHistoryStats, getHistory } from "@/lib/storage/history";
import type { HistoryItem } from "@/lib/storage/history";

interface AnalyticsDashboardProps {
  onRefresh?: () => void;
}

export function AnalyticsDashboard({ onRefresh }: AnalyticsDashboardProps) {
  const [stats, setStats] = useState(getHistoryStats());
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    const historyData = getHistory();
    const statsData = getHistoryStats();
    setHistory(historyData);
    setStats(statsData);
    setIsLoading(false);
  };

  const handleRefresh = () => {
    loadData();
    onRefresh?.();
  };

  const handleExportData = () => {
    const exportData = {
      stats,
      history: history.map(item => ({
        id: item.id,
        createdAt: item.createdAt,
        input: item.input,
        output: item.output
      })),
      exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `marketing-analytics-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 플랫폼별 사용량 계산
  const platformData = Object.entries(stats.platformCounts).map(([platform, count]) => ({
    platform,
    count,
    percentage: Math.round((count / stats.totalCount) * 100)
  })).sort((a, b) => b.count - a.count);

  // 톤별 사용량 계산
  const toneData = Object.entries(stats.toneCounts).map(([tone, count]) => ({
    tone,
    count,
    percentage: Math.round((count / stats.totalCount) * 100)
  })).sort((a, b) => b.count - a.count);

  // 최근 7일간 생성량 계산
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  });

  const dailyCounts = last7Days.map(date => {
    const count = history.filter(item => 
      item.createdAt.toISOString().split("T")[0] === date
    ).length;
    return { date, count };
  }).reverse();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin mr-2" />
          통계를 불러오는 중...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            사용 통계
          </h2>
          <p className="text-muted-foreground">
            마케팅 문구 생성 활동을 분석해보세요
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            새로고침
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            데이터 내보내기
          </Button>
        </div>
      </div>

      {/* 전체 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">총 생성 수</p>
                <p className="text-2xl font-bold">{stats.totalCount}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Hash className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">사용 플랫폼</p>
                <p className="text-2xl font-bold">{Object.keys(stats.platformCounts).length}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">사용 톤</p>
                <p className="text-2xl font-bold">{Object.keys(stats.toneCounts).length}</p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">마지막 생성</p>
                <p className="text-sm font-bold">
                  {stats.lastCreated 
                    ? new Date(stats.lastCreated).toLocaleDateString()
                    : "없음"
                  }
                </p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 플랫폼별 사용량 */}
      <Card>
        <CardHeader>
          <CardTitle>플랫폼별 사용량</CardTitle>
          <CardDescription>
            어떤 플랫폼의 마케팅 문구를 가장 많이 생성했는지 확인해보세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {platformData.map(({ platform, count, percentage }) => (
              <div key={platform} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{platform}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{count}회</Badge>
                    <span className="text-sm text-muted-foreground">{percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 톤별 사용량 */}
      <Card>
        <CardHeader>
          <CardTitle>톤/어조별 사용량</CardTitle>
          <CardDescription>
            어떤 톤의 마케팅 문구를 선호하는지 확인해보세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {toneData.map(({ tone, count, percentage }) => (
              <div key={tone} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{tone}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{count}회</Badge>
                    <span className="text-sm text-muted-foreground">{percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 최근 7일간 활동 */}
      <Card>
        <CardHeader>
          <CardTitle>최근 7일간 활동</CardTitle>
          <CardDescription>
            일별 마케팅 문구 생성 활동을 확인해보세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dailyCounts.map(({ date, count }) => (
              <div key={date} className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {new Date(date).toLocaleDateString('ko-KR', { 
                    month: 'short', 
                    day: 'numeric',
                    weekday: 'short'
                  })}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((count / Math.max(...dailyCounts.map(d => d.count), 1)) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 인사이트 */}
      <Card>
        <CardHeader>
          <CardTitle>인사이트</CardTitle>
          <CardDescription>
            AI가 분석한 사용 패턴과 추천사항
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.totalCount === 0 ? (
              <p className="text-muted-foreground">아직 생성된 문구가 없습니다. 첫 번째 문구를 생성해보세요!</p>
            ) : (
              <>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">가장 많이 사용한 플랫폼</h4>
                  <p className="text-blue-700">
                    <strong>{platformData[0]?.platform}</strong>에서 {platformData[0]?.count}개의 문구를 생성했습니다. 
                    이 플랫폼에 특화된 마케팅 전략을 고려해보세요.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">선호하는 톤</h4>
                  <p className="text-green-700">
                    <strong>{toneData[0]?.tone}</strong> 톤을 {toneData[0]?.count}번 사용했습니다. 
                    이 톤이 브랜드의 정체성과 잘 맞는지 확인해보세요.
                  </p>
                </div>

                {dailyCounts.some(d => d.count > 0) && (
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">활동 패턴</h4>
                    <p className="text-purple-700">
                      최근 7일간 총 {dailyCounts.reduce((sum, d) => sum + d.count, 0)}개의 문구를 생성했습니다. 
                      꾸준한 마케팅 문구 생성으로 다양한 메시지를 테스트해보세요.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

