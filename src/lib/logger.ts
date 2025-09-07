// 로깅 시스템

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private minLevel: LogLevel;

  constructor(minLevel: LogLevel = LogLevel.INFO) {
    this.minLevel = minLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  private formatMessage(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry;
    const levelName = LogLevel[level];
    
    let formatted = `[${timestamp}] ${levelName}: ${message}`;
    
    if (context && Object.keys(context).length > 0) {
      formatted += `\nContext: ${JSON.stringify(context, null, 2)}`;
    }
    
    if (error) {
      formatted += `\nError: ${error.message}`;
      if (error.stack) {
        formatted += `\nStack: ${error.stack}`;
      }
    }
    
    return formatted;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    const formattedMessage = this.formatMessage(entry);

    // 콘솔에 출력
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
    }

    // 프로덕션에서는 외부 로깅 서비스로 전송
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(entry);
    }
  }

  private async sendToExternalService(entry: LogEntry): Promise<void> {
    try {
      // 여기에 Sentry, LogRocket, DataDog 등의 로깅 서비스 연동
      // 예시: Sentry.captureException(entry.error);
      console.log('External logging service integration needed');
    } catch (error) {
      console.error('Failed to send log to external service:', error);
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }
}

// 싱글톤 인스턴스
export const logger = new Logger(
  process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO
);

// API 라우트용 헬퍼 함수들
export const apiLogger = {
  request: (method: string, url: string, body?: any) => {
    logger.info('API Request', {
      method,
      url,
      body: body ? JSON.stringify(body).substring(0, 200) : undefined,
    });
  },

  response: (status: number, responseTime: number, data?: any) => {
    logger.info('API Response', {
      status,
      responseTime: `${responseTime}ms`,
      dataSize: data ? JSON.stringify(data).length : 0,
    });
  },

  error: (error: Error, context?: Record<string, any>) => {
    logger.error('API Error', error, context);
  },
};

// 마케팅 생성 관련 로깅
export const marketingLogger = {
  generationStart: (input: any) => {
    logger.info('Marketing generation started', {
      platform: input.platform,
      tone: input.tone,
      length: input.length,
      goal: input.goal,
    });
  },

  generationSuccess: (input: any, output: any, responseTime: number) => {
    logger.info('Marketing generation successful', {
      platform: input.platform,
      tone: input.tone,
      length: input.length,
      goal: input.goal,
      responseTime: `${responseTime}ms`,
      outputLength: output.marketing_copy?.length || 0,
    });
  },

  generationError: (error: Error, input: any) => {
    logger.error('Marketing generation failed', error, {
      platform: input.platform,
      tone: input.tone,
      length: input.length,
      goal: input.goal,
    });
  },

  batchGenerationStart: (totalCombinations: number) => {
    logger.info('Batch generation started', {
      totalCombinations,
    });
  },

  batchGenerationProgress: (completed: number, total: number) => {
    logger.info('Batch generation progress', {
      completed,
      total,
      percentage: Math.round((completed / total) * 100),
    });
  },

  batchGenerationComplete: (results: any[], responseTime: number) => {
    logger.info('Batch generation completed', {
      totalResults: results.length,
      successCount: results.filter(r => !r.error).length,
      errorCount: results.filter(r => r.error).length,
      responseTime: `${responseTime}ms`,
    });
  },
};
