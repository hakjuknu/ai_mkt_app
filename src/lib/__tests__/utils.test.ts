import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
    });

    it('should handle conditional classes', () => {
      expect(cn('base-class', { 'active-class': true, 'inactive-class': false }))
        .toBe('base-class active-class');
    });

    it('should handle undefined and null values', () => {
      expect(cn('base-class', undefined, null, 'valid-class'))
        .toBe('base-class valid-class');
    });

    it('should handle empty strings', () => {
      expect(cn('base-class', '', 'valid-class'))
        .toBe('base-class valid-class');
    });
  });
});
