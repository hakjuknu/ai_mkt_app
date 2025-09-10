import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Target, Zap, Users, BarChart3, History, Wand2 } from "lucide-react";
import Link from "next/link";
import { getRandomValueProposition } from "@/lib/data/sample-value-propositions";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI 기반 마케팅 자동화
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            마케팅 문구를
            <br />
            <span className="text-primary">AI가 자동 생성</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            가치 제언과 타겟팅 옵션만 입력하면, AI가 플랫폼별 최적화된 마케팅 문구를 생성해드립니다.
          </p>
          
          {/* 샘플 문구 미리보기 */}
          <div className="mt-8 p-6 bg-muted/50 rounded-lg border-l-4 border-primary max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <Wand2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">샘플 가치 제언</span>
            </div>
            <p className="text-base leading-relaxed text-foreground">
              &quot;{getRandomValueProposition()}&quot;
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              💡 매번 접속할 때마다 다른 샘플 문구가 자동으로 입력됩니다
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/marketing-generator">
                문구 생성 시작하기
              </Link>
            </Button>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" size="lg" asChild>
                <Link href="/test">
                  컴포넌트 테스트
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/marketing-generator">
                  <History className="w-4 h-4 mr-2" />
                  생성 이력
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/marketing-generator">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  사용 통계
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>정확한 타겟팅</CardTitle>
              <CardDescription>
                성별, 연령대, 플랫폼별 맞춤형 문구 생성
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>빠른 생성</CardTitle>
              <CardDescription>
                몇 초 만에 전문적인 마케팅 문구 완성
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>다양한 톤</CardTitle>
              <CardDescription>
                감성적부터 전문적까지 다양한 어조 지원
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Platform Support */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle>지원 플랫폼</CardTitle>
            <CardDescription>
              다양한 소셜 미디어와 마케팅 채널에 최적화된 문구 생성
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-3">
              {["Instagram", "Facebook", "TikTok", "YouTube", "LinkedIn", "Twitter(X)", "Email"].map((platform) => (
                <Badge key={platform} variant="secondary" className="px-4 py-2 text-sm">
                  {platform}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How it Works */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>사용 방법</CardTitle>
            <CardDescription>
              3단계로 간단하게 마케팅 문구를 생성하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-sm font-bold">
                  1
                </div>
                <h3 className="font-semibold">가치 제언 입력</h3>
                <p className="text-sm text-muted-foreground">
                  제품이나 서비스의 핵심 가치를 간단히 설명해주세요
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-sm font-bold">
                  2
                </div>
                <h3 className="font-semibold">타겟팅 설정</h3>
                <p className="text-sm text-muted-foreground">
                  성별, 연령대, 플랫폼, 톤 등을 선택해주세요
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-sm font-bold">
                  3
                </div>
                <h3 className="font-semibold">문구 생성</h3>
                <p className="text-sm text-muted-foreground">
                  AI가 최적화된 마케팅 문구를 생성해드립니다
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
