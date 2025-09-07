"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { marketingFormSchema, transformFormData } from "@/lib/validations/marketing";
import type { MarketingFormSchema } from "@/lib/validations/marketing";
import { 
  GENDER_OPTIONS, 
  AGE_GROUP_OPTIONS, 
  PLATFORM_OPTIONS, 
  TONE_OPTIONS, 
  LENGTH_OPTIONS, 
  GOAL_OPTIONS,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  DEFAULT_FORM_VALUES
} from "@/lib/constants/marketing";
import { getRandomValueProposition } from "@/lib/data/sample-value-propositions";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, RefreshCw, Wand2 } from "lucide-react";

interface MarketingFormProps {
  onSubmit: (data: MarketingFormSchema) => void;
  onGenerateAll: (data: MarketingFormSchema) => void;
  isLoading?: boolean;
  isGeneratingAll?: boolean;
}

export function MarketingForm({ onSubmit, onGenerateAll, isLoading = false, isGeneratingAll = false }: MarketingFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<MarketingFormSchema>({
    resolver: zodResolver(marketingFormSchema),
    mode: "onChange",
    defaultValues: {
      ...DEFAULT_FORM_VALUES,
      valueProposition: getRandomValueProposition(), // 자동으로 랜덤 가치 제언 입력
    },
  });

  const watchedValues = watch();

  const handleFormSubmit = (data: MarketingFormSchema) => {
    onSubmit(data);
  };

  const handleGenerateAll = (data: MarketingFormSchema) => {
    onGenerateAll(data);
  };

  const handleGenerateNewValueProposition = () => {
    const newValueProposition = getRandomValueProposition();
    setValue("valueProposition", newValueProposition);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          마케팅 문구 생성
        </CardTitle>
        <CardDescription>
          가치 제언과 타겟팅 옵션을 입력하여 AI가 최적화된 마케팅 문구를 생성합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* 가치 제언 입력 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="valueProposition" className="text-base font-medium">
                {FORM_LABELS.VALUE_PROPOSITION} <span className="text-destructive">*</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateNewValueProposition}
                className="flex items-center gap-2"
              >
                <Wand2 className="w-4 h-4" />
                새로운 문구 생성
              </Button>
            </div>
            <Textarea
              id="valueProposition"
              placeholder={FORM_PLACEHOLDERS.VALUE_PROPOSITION}
              className="min-h-[100px] resize-none"
              {...register("valueProposition")}
            />
            {errors.valueProposition && (
              <p className="text-sm text-destructive">{errors.valueProposition.message}</p>
            )}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{watchedValues.valueProposition?.length || 0}/500자</span>
              <span className="text-blue-600">✨ 자동으로 샘플 문구가 입력되었습니다</span>
            </div>
          </div>

          {/* 타겟팅 옵션들 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 성별 선택 */}
            <div className="space-y-3">
              <Label className="text-base font-medium">{FORM_LABELS.GENDER}</Label>
              <RadioGroup
                value={watchedValues.gender}
                onValueChange={(value) => setValue("gender", value as any)}
              >
                <div className="grid grid-cols-3 gap-3">
                  {GENDER_OPTIONS.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="text-sm cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
              {errors.gender && (
                <p className="text-sm text-destructive">{errors.gender.message}</p>
              )}
            </div>

            {/* 연령대 선택 */}
            <div className="space-y-3">
              <Label className="text-base font-medium">{FORM_LABELS.AGE_GROUP}</Label>
              <RadioGroup
                value={watchedValues.ageGroup}
                onValueChange={(value) => setValue("ageGroup", value as any)}
              >
                <div className="grid grid-cols-2 gap-3">
                  {AGE_GROUP_OPTIONS.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="text-sm cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
              {errors.ageGroup && (
                <p className="text-sm text-destructive">{errors.ageGroup.message}</p>
              )}
            </div>
          </div>

          {/* 플랫폼 선택 */}
          <div className="space-y-3">
            <Label className="text-base font-medium">{FORM_LABELS.PLATFORM}</Label>
            <Select
              value={watchedValues.platform}
              onValueChange={(value) => setValue("platform", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="플랫폼을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {PLATFORM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.platform && (
              <p className="text-sm text-destructive">{errors.platform.message}</p>
            )}
          </div>

          {/* 톤/어조 선택 */}
          <div className="space-y-3">
            <Label className="text-base font-medium">{FORM_LABELS.TONE}</Label>
            <RadioGroup
              value={watchedValues.tone}
              onValueChange={(value) => setValue("tone", value as any)}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {TONE_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={option.value} 
                      id={option.value}
                    />
                    <Label htmlFor={option.value} className="text-sm cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            {errors.tone && (
              <p className="text-sm text-destructive">{errors.tone.message}</p>
            )}
          </div>

          {/* 문구 길이 선택 */}
          <div className="space-y-3">
            <Label className="text-base font-medium">{FORM_LABELS.LENGTH}</Label>
            <RadioGroup
              value={watchedValues.length}
              onValueChange={(value) => setValue("length", value as any)}
            >
              <div className="grid grid-cols-3 gap-3">
                {LENGTH_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="text-sm cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            {errors.length && (
              <p className="text-sm text-destructive">{errors.length.message}</p>
            )}
          </div>

          {/* 목적 선택 */}
          <div className="space-y-3">
            <Label className="text-base font-medium">{FORM_LABELS.GOAL}</Label>
            <Select
              value={watchedValues.goal}
              onValueChange={(value) => setValue("goal", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="목적을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {GOAL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.goal && (
              <p className="text-sm text-destructive">{errors.goal.message}</p>
            )}
          </div>

          {/* 선택된 옵션 미리보기 */}
          {watchedValues.valueProposition && (
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium text-muted-foreground">선택된 옵션</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{watchedValues.gender}</Badge>
                <Badge variant="outline">{watchedValues.ageGroup}</Badge>
                <Badge variant="outline">{watchedValues.platform}</Badge>
                <Badge variant="outline">{watchedValues.tone}</Badge>
                <Badge variant="outline">{watchedValues.length}</Badge>
                <Badge variant="outline">{watchedValues.goal}</Badge>
              </div>
            </div>
          )}

          {/* 제출 버튼들 */}
          <div className="space-y-3">
            {/* 선택한 옵션으로 생성 */}
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={!isValid || isLoading || isGeneratingAll}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  AI가 문구를 생성하고 있습니다...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  선택한 옵션으로 문구 생성
                </>
              )}
            </Button>

            {/* 모든 옵션으로 생성 */}
            <Button 
              type="button"
              variant="outline"
              className="w-full" 
              size="lg"
              onClick={() => {
                const formData = watch();
                handleGenerateAll(formData);
              }}
              disabled={!isValid || isLoading || isGeneratingAll}
            >
              {isGeneratingAll ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  모든 옵션으로 문구를 생성하고 있습니다...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  모든 옵션으로 문구 생성
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
