// 성능 모니터링 및 분석
export interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
}

export interface UserInteraction {
  event: string;
  timestamp: number;
  data?: Record<string, unknown>;
}

class Analytics {
  private metrics: PerformanceMetrics | null = null;
  private interactions: UserInteraction[] = [];

  // 성능 메트릭 수집
  collectPerformanceMetrics(): void {
    if (typeof window === 'undefined') return;

    // Web Vitals 수집
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          this.metrics = {
            pageLoadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0,
            firstInputDelay: 0,
            timeToInteractive: 0,
          };
        }
      }
    });

    observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'layout-shift'] });

    // FCP (First Contentful Paint)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint' && this.metrics) {
          this.metrics.firstContentfulPaint = entry.startTime;
        }
      }
    }).observe({ entryTypes: ['paint'] });

    // LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (this.metrics) {
          this.metrics.largestContentfulPaint = entry.startTime;
        }
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value ?? 0;
          if (this.metrics) {
            this.metrics.cumulativeLayoutShift = clsValue;
          }
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // 사용자 상호작용 추적
  trackEvent(event: string, data?: Record<string, unknown>): void {
    if (typeof window === 'undefined') return;

    this.interactions.push({
      event,
      timestamp: Date.now(),
      data,
    });

    // 로컬 스토리지에 저장 (선택사항)
    try {
      localStorage.setItem('analytics_interactions', JSON.stringify(this.interactions));
    } catch (error) {
      console.warn('Analytics: 로컬 스토리지 저장 실패', error);
    }
  }

  // 마케팅 문구 생성 이벤트 추적
  trackMarketingGeneration(data: {
    platform: string;
    tone: string;
    length: string;
    generationTime: number;
    success: boolean;
  }): void {
    this.trackEvent('marketing_generation', data);
  }

  // 페이지 뷰 추적
  trackPageView(page: string): void {
    this.trackEvent('page_view', { page });
  }

  // 에러 추적
  trackError(error: Error, context?: string): void {
    this.trackEvent('error', {
      message: error.message,
      stack: error.stack,
      context,
    });
  }

  // 성능 메트릭 가져오기
  getMetrics(): PerformanceMetrics | null {
    return this.metrics;
  }

  // 상호작용 데이터 가져오기
  getInteractions(): UserInteraction[] {
    return this.interactions;
  }

  // 데이터 초기화
  clearData(): void {
    this.metrics = null;
    this.interactions = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('analytics_interactions');
    }
  }

  // 데이터 내보내기
  exportData(): {
    metrics: PerformanceMetrics | null;
    interactions: UserInteraction[];
    timestamp: number;
  } {
    return {
      metrics: this.metrics,
      interactions: this.interactions,
      timestamp: Date.now(),
    };
  }
}

// 싱글톤 인스턴스
export const analytics = new Analytics();

// 자동 초기화
if (typeof window !== 'undefined') {
  analytics.collectPerformanceMetrics();
  
  // 페이지 로드 시 페이지 뷰 추적
  analytics.trackPageView(window.location.pathname);
  
  // 에러 추적
  window.addEventListener('error', (event) => {
    analytics.trackError(new Error(event.message), 'global_error');
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    analytics.trackError(new Error(event.reason), 'unhandled_promise_rejection');
  });
}


