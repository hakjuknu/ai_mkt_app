"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { EnvStatus } from "@/components/env-status";
import { useState } from "react";

export default function TestPage() {
  const [selectedValue, setSelectedValue] = useState("");
  const [radioValue, setRadioValue] = useState("");

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Phase 1 테스트 페이지</h1>
          <p className="text-muted-foreground">Shadcn UI 컴포넌트 동작 확인</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Button 테스트 */}
          <Card>
            <CardHeader>
              <CardTitle>Button 컴포넌트</CardTitle>
              <CardDescription>다양한 버튼 스타일 테스트</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button>기본 버튼</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </CardContent>
          </Card>

          {/* Input & Textarea 테스트 */}
          <Card>
            <CardHeader>
              <CardTitle>Input & Textarea</CardTitle>
              <CardDescription>입력 컴포넌트 테스트</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-input">Input 테스트</Label>
                <Input id="test-input" placeholder="입력해보세요" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-textarea">Textarea 테스트</Label>
                <Textarea 
                  id="test-textarea" 
                  placeholder="여러 줄 텍스트를 입력해보세요"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Select 테스트 */}
          <Card>
            <CardHeader>
              <CardTitle>Select 컴포넌트</CardTitle>
              <CardDescription>선택 박스 테스트</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>플랫폼 선택</Label>
                <Select value={selectedValue} onValueChange={setSelectedValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="플랫폼을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="twitter">Twitter(X)</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
                {selectedValue && (
                  <p className="text-sm text-muted-foreground">
                    선택된 값: {selectedValue}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* RadioGroup 테스트 */}
          <Card>
            <CardHeader>
              <CardTitle>RadioGroup 컴포넌트</CardTitle>
              <CardDescription>라디오 버튼 그룹 테스트</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>성별 선택</Label>
                <RadioGroup value={radioValue} onValueChange={setRadioValue}>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">남성</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">여성</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="any" id="any" />
                      <Label htmlFor="any">무관</Label>
                    </div>
                  </div>
                </RadioGroup>
                {radioValue && (
                  <p className="text-sm text-muted-foreground">
                    선택된 값: {radioValue}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Badge 테스트 */}
          <Card>
            <CardHeader>
              <CardTitle>Badge 컴포넌트</CardTitle>
              <CardDescription>배지 컴포넌트 테스트</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge>기본</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>감성적</Badge>
                <Badge>직설적</Badge>
                <Badge>전문적</Badge>
                <Badge>유머러스</Badge>
                <Badge>고급스러움</Badge>
                <Badge>친근함</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Card 테스트 */}
          <Card>
            <CardHeader>
              <CardTitle>Card 컴포넌트</CardTitle>
              <CardDescription>카드 레이아웃 테스트</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                이 카드 자체가 Shadcn UI의 Card 컴포넌트입니다.
                깔끔하고 세련된 디자인이 적용되어 있습니다.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 환경 변수 상태 */}
        <EnvStatus />

        {/* 테스트 결과 요약 */}
        <Card>
          <CardHeader>
            <CardTitle>테스트 결과 요약</CardTitle>
            <CardDescription>Phase 1 설치된 컴포넌트들의 동작 상태</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">✅ 정상 동작 컴포넌트</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Button (다양한 variant, size)</li>
                  <li>• Card (Header, Content, Description)</li>
                  <li>• Input (기본 입력 필드)</li>
                  <li>• Textarea (멀티라인 입력)</li>
                  <li>• Select (드롭다운 선택)</li>
                  <li>• RadioGroup (라디오 버튼 그룹)</li>
                  <li>• Badge (배지 표시)</li>
                  <li>• Label (라벨 연결)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">✅ 설치된 의존성</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• OpenAI SDK (AI API 연동)</li>
                  <li>• React Hook Form (폼 관리)</li>
                  <li>• Zod (스키마 검증)</li>
                  <li>• Lucide React (아이콘)</li>
                  <li>• Radix UI (접근성 기반)</li>
                  <li>• Tailwind CSS (스타일링)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
