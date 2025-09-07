// 생성 이력 저장 및 관리
import type { MarketingResponse } from "@/types/marketing";

export interface HistoryItem extends MarketingResponse {
  id: string;
  createdAt: Date;
  title?: string;
}

const STORAGE_KEY = "marketing_history";

// 이력 저장
export function saveToHistory(result: MarketingResponse): void {
  try {
    const history = getHistory();
    const newItem: HistoryItem = {
      ...result,
      id: Date.now().toString(),
      createdAt: new Date(),
      title: result.input.valueProposition.slice(0, 30) + (result.input.valueProposition.length > 30 ? "..." : ""),
    };
    
    const updatedHistory = [newItem, ...history].slice(0, 50); // 최대 50개 저장
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("이력 저장 실패:", error);
  }
}

// 이력 조회
export function getHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const history = JSON.parse(stored) as HistoryItem[];
    return history.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt),
    }));
  } catch (error) {
    console.error("이력 조회 실패:", error);
    return [];
  }
}

// 이력 삭제
export function deleteFromHistory(id: string): void {
  try {
    const history = getHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("이력 삭제 실패:", error);
  }
}

// 이력 전체 삭제
export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("이력 전체 삭제 실패:", error);
  }
}

// 이력 통계
export function getHistoryStats() {
  const history = getHistory();
  const platformCounts: Record<string, number> = {};
  const toneCounts: Record<string, number> = {};
  
  history.forEach(item => {
    platformCounts[item.input.platform] = (platformCounts[item.input.platform] || 0) + 1;
    toneCounts[item.input.tone] = (toneCounts[item.input.tone] || 0) + 1;
  });
  
  return {
    totalCount: history.length,
    platformCounts,
    toneCounts,
    lastCreated: history[0]?.createdAt,
  };
}

