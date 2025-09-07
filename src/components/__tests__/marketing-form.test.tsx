import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/utils';
import userEvent from '@testing-library/user-event';
import { MarketingForm } from '../marketing-form';
import { createMockMarketingFormData } from '../../test/utils';

// Mock 함수들
const mockOnSubmit = vi.fn();
const mockOnGenerateAll = vi.fn();

describe('MarketingForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all form elements', () => {
    render(
      <MarketingForm
        onSubmit={mockOnSubmit}
        onGenerateAll={mockOnGenerateAll}
      />
    );

    // 가치 제언 입력 필드
    expect(screen.getByLabelText(/가치 제언/i)).toBeInTheDocument();
    
    // 성별 선택
    expect(screen.getByText('남성')).toBeInTheDocument();
    expect(screen.getByText('여성')).toBeInTheDocument();
    expect(screen.getByText('무관')).toBeInTheDocument();
    
    // 연령대 선택
    expect(screen.getByText('10대')).toBeInTheDocument();
    expect(screen.getByText('20대')).toBeInTheDocument();
    expect(screen.getByText('30대')).toBeInTheDocument();
    
    // 플랫폼 선택
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    
    // 톤 선택
    expect(screen.getByText('감성적')).toBeInTheDocument();
    expect(screen.getByText('직설적')).toBeInTheDocument();
    
    // 길이 선택
    expect(screen.getByText('짧음')).toBeInTheDocument();
    expect(screen.getByText('중간')).toBeInTheDocument();
    expect(screen.getByText('길음')).toBeInTheDocument();
    
    // 목적 선택
    expect(screen.getByText(/브랜드 인지도 제고/i)).toBeInTheDocument();
    
    // 버튼들
    expect(screen.getByText(/선택한 옵션으로 문구 생성/i)).toBeInTheDocument();
    expect(screen.getByText(/모든 옵션으로 문구 생성/i)).toBeInTheDocument();
  });

  it('should have default values pre-filled', () => {
    render(
      <MarketingForm
        onSubmit={mockOnSubmit}
        onGenerateAll={mockOnGenerateAll}
      />
    );

    // 기본값들이 선택되어 있는지 확인
    expect(screen.getByDisplayValue('남성')).toBeChecked();
    expect(screen.getByDisplayValue('10대')).toBeChecked();
    expect(screen.getByDisplayValue('감성적')).toBeChecked();
    expect(screen.getByDisplayValue('짧음')).toBeChecked();
  });

  it('should show character count for value proposition', () => {
    render(
      <MarketingForm
        onSubmit={mockOnSubmit}
        onGenerateAll={mockOnGenerateAll}
      />
    );

    expect(screen.getByText(/0\/500자/)).toBeInTheDocument();
  });

  it('should update character count when typing', async () => {
    const user = userEvent.setup();
    render(
      <MarketingForm
        onSubmit={mockOnSubmit}
        onGenerateAll={mockOnGenerateAll}
      />
    );

    const textarea = screen.getByLabelText(/가치 제언/i);
    await user.type(textarea, '테스트 문구');

    expect(screen.getByText(/6\/500자/)).toBeInTheDocument();
  });

  it('should show selected options preview', async () => {
    const user = userEvent.setup();
    render(
      <MarketingForm
        onSubmit={mockOnSubmit}
        onGenerateAll={mockOnGenerateAll}
      />
    );

    // 가치 제언 입력
    const textarea = screen.getByLabelText(/가치 제언/i);
    await user.type(textarea, '테스트 가치 제언');

    // 선택된 옵션 미리보기가 나타나는지 확인
    expect(screen.getByText('선택된 옵션')).toBeInTheDocument();
    expect(screen.getByText('남성')).toBeInTheDocument();
    expect(screen.getByText('10대')).toBeInTheDocument();
  });

  it('should call onSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    render(
      <MarketingForm
        onSubmit={mockOnSubmit}
        onGenerateAll={mockOnGenerateAll}
      />
    );

    // 가치 제언 입력
    const textarea = screen.getByLabelText(/가치 제언/i);
    await user.type(textarea, '테스트 가치 제언');

    // 폼 제출
    const submitButton = screen.getByText(/선택한 옵션으로 문구 생성/i);
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        valueProposition: expect.stringContaining('테스트 가치 제언'),
        gender: '남성',
        ageGroup: '10대',
        platform: 'Instagram',
        tone: '감성적',
        length: '짧음',
        goal: '브랜드 인지도 제고',
      })
    );
  });

  it('should call onGenerateAll when generate all button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MarketingForm
        onSubmit={mockOnSubmit}
        onGenerateAll={mockOnGenerateAll}
      />
    );

    // 가치 제언 입력
    const textarea = screen.getByLabelText(/가치 제언/i);
    await user.type(textarea, '테스트 가치 제언');

    // 모든 옵션 생성 버튼 클릭
    const generateAllButton = screen.getByText(/모든 옵션으로 문구 생성/i);
    await user.click(generateAllButton);

    expect(mockOnGenerateAll).toHaveBeenCalledTimes(1);
  });

  it('should disable buttons when loading', () => {
    render(
      <MarketingForm
        onSubmit={mockOnSubmit}
        onGenerateAll={mockOnGenerateAll}
        isLoading={true}
      />
    );

    const submitButton = screen.getByText(/AI가 문구를 생성하고 있습니다/i);
    const generateAllButton = screen.getByText(/모든 옵션으로 문구 생성/i);

    expect(submitButton).toBeDisabled();
    expect(generateAllButton).toBeDisabled();
  });

  it('should disable buttons when generating all', () => {
    render(
      <MarketingForm
        onSubmit={mockOnSubmit}
        onGenerateAll={mockOnGenerateAll}
        isGeneratingAll={true}
      />
    );

    const submitButton = screen.getByText(/선택한 옵션으로 문구 생성/i);
    const generateAllButton = screen.getByText(/모든 옵션으로 문구를 생성하고 있습니다/i);

    expect(submitButton).toBeDisabled();
    expect(generateAllButton).toBeDisabled();
  });

  it('should show validation errors for empty value proposition', async () => {
    const user = userEvent.setup();
    render(
      <MarketingForm
        onSubmit={mockOnSubmit}
        onGenerateAll={mockOnGenerateAll}
      />
    );

    // 가치 제언을 비우고 폼 제출
    const textarea = screen.getByLabelText(/가치 제언/i);
    await user.clear(textarea);

    const submitButton = screen.getByText(/선택한 옵션으로 문구 생성/i);
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/가치 제언은 최소 10자 이상 입력해주세요/)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
