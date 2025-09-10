import { describe, it, expect } from 'vitest';
import { marketingFormSchema, transformFormData } from '../validations/marketing';

describe('marketing validation', () => {
  describe('marketingFormSchema', () => {
    const validData = {
      valueProposition: '테스트용 가치 제언입니다. 최소 10자 이상이어야 합니다.',
      gender: '여성' as const,
      ageGroup: '20대' as const,
      platform: 'Instagram' as const,
      tone: '감성적' as const,
      length: '짧음' as const,
      goal: '브랜드 인지도 제고' as const,
    };

    it('should validate correct data', () => {
      const result = marketingFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject data with short value proposition', () => {
      const data = { ...validData, valueProposition: '짧음' };
      const result = marketingFormSchema.safeParse(data);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('최소 10자 이상');
      }
    });

    it('should reject data with long value proposition', () => {
      const data = { ...validData, valueProposition: 'a'.repeat(501) };
      const result = marketingFormSchema.safeParse(data);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('500자를 초과할 수 없습니다');
      }
    });

    it('should reject data with invalid gender', () => {
      const data = { ...validData, gender: 'invalid' as never };
      const result = marketingFormSchema.safeParse(data);
      
      expect(result.success).toBe(false);
    });

    it('should reject data with invalid age group', () => {
      const data = { ...validData, ageGroup: 'invalid' as never };
      const result = marketingFormSchema.safeParse(data);
      
      expect(result.success).toBe(false);
    });

    it('should reject data with invalid platform', () => {
      const data = { ...validData, platform: 'invalid' as never };
      const result = marketingFormSchema.safeParse(data);
      
      expect(result.success).toBe(false);
    });

    it('should reject data with invalid tone', () => {
      const data = { ...validData, tone: 'invalid' as never };
      const result = marketingFormSchema.safeParse(data);
      
      expect(result.success).toBe(false);
    });

    it('should reject data with invalid length', () => {
      const data = { ...validData, length: 'invalid' as never };
      const result = marketingFormSchema.safeParse(data);
      
      expect(result.success).toBe(false);
    });

    it('should reject data with invalid goal', () => {
      const data = { ...validData, goal: 'invalid' as never };
      const result = marketingFormSchema.safeParse(data);
      
      expect(result.success).toBe(false);
    });

    it('should trim whitespace from value proposition', () => {
      const data = { ...validData, valueProposition: '  테스트 문구  ' };
      const result = marketingFormSchema.safeParse(data);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.valueProposition).toBe('테스트 문구');
      }
    });
  });

  describe('transformFormData', () => {
    it('should transform form data correctly', () => {
      const formData = {
        valueProposition: '테스트 가치 제언',
        gender: '여성' as const,
        ageGroup: '20대' as const,
        platform: 'Instagram' as const,
        tone: '감성적' as const,
        length: '짧음' as const,
        goal: '브랜드 인지도 제고' as const,
      };

      const result = transformFormData(formData);
      
      expect(result).toEqual(formData);
    });
  });
});
