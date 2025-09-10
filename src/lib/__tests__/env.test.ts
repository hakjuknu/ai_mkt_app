import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { validateOpenAIKey, checkEnvSetup } from '../config/env';

// 환경변수 모킹
const originalEnv = process.env;

describe('env', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('validateOpenAIKey', () => {
    it('should return true for valid API key', () => {
      process.env.OPENAI_API_KEY = 'sk-1234567890abcdef';
      
      expect(validateOpenAIKey()).toBe(true);
    });

    it('should return false for missing API key', () => {
      delete process.env.OPENAI_API_KEY;
      
      expect(validateOpenAIKey()).toBe(false);
    });

    it('should return false for empty API key', () => {
      process.env.OPENAI_API_KEY = '';
      
      expect(validateOpenAIKey()).toBe(false);
    });

    it('should return false for placeholder API key', () => {
      process.env.OPENAI_API_KEY = 'your_openai_api_key_here';
      
      expect(validateOpenAIKey()).toBe(false);
    });

    it('should return false for invalid API key format', () => {
      process.env.OPENAI_API_KEY = 'invalid-key-format';
      
      expect(validateOpenAIKey()).toBe(false);
    });

    it('should handle API key with newlines', () => {
      process.env.OPENAI_API_KEY = 'sk-1234567890abcdef\n';
      
      expect(validateOpenAIKey()).toBe(true);
    });
  });

  describe('checkEnvSetup', () => {
    it('should return isSetup true when API key is valid', async () => {
      process.env.OPENAI_API_KEY = 'sk-1234567890abcdef';
      
      // env 객체를 다시 로드하기 위해 모듈을 리셋
      vi.resetModules();
      const { checkEnvSetup } = await import('../../config/env');
      
      const result = checkEnvSetup();
      
      expect(result.isSetup).toBe(true);
      expect(result.missingVars).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it('should return isSetup false when API key is missing', () => {
      delete process.env.OPENAI_API_KEY;
      
      const result = checkEnvSetup();
      
      expect(result.isSetup).toBe(false);
      expect(result.missingVars).toContain('OPENAI_API_KEY');
      expect(result.warnings).toHaveLength(0);
    });

    it('should return warning for placeholder API key', async () => {
      process.env.OPENAI_API_KEY = 'your_openai_api_key_here';
      
      // env 객체를 다시 로드하기 위해 모듈을 리셋
      vi.resetModules();
      const { checkEnvSetup } = await import('../../config/env');
      
      const result = checkEnvSetup();
      
      expect(result.isSetup).toBe(false);
      expect(result.missingVars).toHaveLength(0);
      expect(result.warnings).toContain('OPENAI_API_KEY가 기본값으로 설정되어 있습니다.');
    });

    it('should return warning for invalid API key format', async () => {
      process.env.OPENAI_API_KEY = 'invalid-key-format';
      
      // env 객체를 다시 로드하기 위해 모듈을 리셋
      vi.resetModules();
      const { checkEnvSetup } = await import('../../config/env');
      
      const result = checkEnvSetup();
      
      expect(result.isSetup).toBe(false);
      expect(result.missingVars).toHaveLength(0);
      expect(result.warnings).toContain('OPENAI_API_KEY 형식이 올바르지 않을 수 있습니다.');
    });
  });
});
