import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// 테스트용 래퍼 컴포넌트
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// 커스텀 렌더 함수
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock 데이터 생성 헬퍼
export const createMockMarketingFormData = (overrides = {}) => ({
  valueProposition: '테스트용 가치 제언입니다.',
  gender: '여성' as const,
  ageGroup: '20대' as const,
  platform: 'Instagram' as const,
  tone: '감성적' as const,
  length: '짧음' as const,
  goal: '브랜드 인지도 제고' as const,
  ...overrides,
});

export const createMockMarketingResponse = (overrides = {}) => ({
  input: createMockMarketingFormData(),
  output: {
    marketing_copy: '테스트용 생성된 마케팅 문구입니다.',
  },
  ...overrides,
});

// API Mock 헬퍼
export const mockFetch = (response: any, status = 200) => {
  const mockResponse = {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(response),
    text: vi.fn().mockResolvedValue(JSON.stringify(response)),
  };
  
  vi.mocked(fetch).mockResolvedValue(mockResponse as any);
  return mockResponse;
};

export const mockFetchError = (error: string, status = 500) => {
  const mockResponse = {
    ok: false,
    status,
    json: vi.fn().mockResolvedValue({ error }),
    text: vi.fn().mockResolvedValue(JSON.stringify({ error })),
  };
  
  vi.mocked(fetch).mockResolvedValue(mockResponse as any);
  return mockResponse;
};

// 폼 테스트 헬퍼
export const fillMarketingForm = async (user: any, formData: any) => {
  // 가치 제언 입력
  const valuePropositionTextarea = document.querySelector('textarea[name="valueProposition"]');
  if (valuePropositionTextarea) {
    await user.clear(valuePropositionTextarea);
    await user.type(valuePropositionTextarea, formData.valueProposition);
  }

  // 성별 선택
  const genderRadio = document.querySelector(`input[value="${formData.gender}"]`);
  if (genderRadio) {
    await user.click(genderRadio);
  }

  // 연령대 선택
  const ageGroupRadio = document.querySelector(`input[value="${formData.ageGroup}"]`);
  if (ageGroupRadio) {
    await user.click(ageGroupRadio);
  }

  // 플랫폼 선택
  const platformSelect = document.querySelector('[role="combobox"]');
  if (platformSelect) {
    await user.click(platformSelect);
    const platformOption = document.querySelector(`[data-value="${formData.platform}"]`);
    if (platformOption) {
      await user.click(platformOption);
    }
  }

  // 톤 선택
  const toneRadio = document.querySelector(`input[value="${formData.tone}"]`);
  if (toneRadio) {
    await user.click(toneRadio);
  }

  // 길이 선택
  const lengthRadio = document.querySelector(`input[value="${formData.length}"]`);
  if (lengthRadio) {
    await user.click(lengthRadio);
  }

  // 목적 선택
  const goalSelect = document.querySelectorAll('[role="combobox"]')[1];
  if (goalSelect) {
    await user.click(goalSelect);
    const goalOption = document.querySelector(`[data-value="${formData.goal}"]`);
    if (goalOption) {
      await user.click(goalOption);
    }
  }
};

// 재내보내기
export * from '@testing-library/react';
export { customRender as render };
