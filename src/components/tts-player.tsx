"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Volume2, VolumeX, Play, Pause, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TTSPlayerProps, Voice } from "@/types/tts";


const VOICE_OPTIONS = [
  { value: "alloy", label: "Alloy (중성적)" },
  { value: "echo", label: "Echo (남성적)" },
  { value: "fable", label: "Fable (영국 억양)" },
  { value: "onyx", label: "Onyx (깊은 남성)" },
  { value: "nova", label: "Nova (젊은 여성)" },
  { value: "shimmer", label: "Shimmer (부드러운 여성)" },
];

export function TTSPlayer({ text, className }: TTSPlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<Voice>("alloy");
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleGenerateTTS = async () => {
    if (!text.trim()) {
      setError("텍스트가 없습니다.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          voice: selectedVoice,
          model: "tts-1"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'TTS 생성에 실패했습니다.');
      }

      const data = await response.json();
      
      // Base64 오디오 데이터를 Blob으로 변환
      const audioBlob = new Blob([
        Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))
      ], { type: 'audio/mpeg' });
      
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      
      // 기존 오디오 정리
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      
      // 새 오디오 설정
      const audio = new Audio(url);
      audioRef.current = audio;
      
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setError("오디오 재생 중 오류가 발생했습니다.");
        setIsPlaying(false);
      };
      
    } catch (err) {
      console.error('TTS 생성 오류:', err);
      setError(err instanceof Error ? err.message : 'TTS 생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;

    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `tts-${selectedVoice}-${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          음성 변환 (TTS)
        </CardTitle>
        <CardDescription>
          생성된 마케팅 문구를 음성으로 들어보세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 음성 선택 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">음성 선택</label>
          <Select value={selectedVoice} onValueChange={(value) => setSelectedVoice(value as Voice)}>
            <SelectTrigger>
              <SelectValue placeholder="음성을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {VOICE_OPTIONS.map((voice) => (
                <SelectItem key={voice.value} value={voice.value}>
                  {voice.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 컨트롤 버튼들 */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleGenerateTTS}
            disabled={isLoading || !text.trim()}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" text="음성 생성 중..." />
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                음성 생성
              </>
            )}
          </Button>

          {audioUrl && (
            <>
              <Button
                onClick={handlePlayPause}
                variant="outline"
                className="flex items-center gap-2"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    일시정지
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    재생
                  </>
                )}
              </Button>

              <Button
                onClick={handleStop}
                variant="outline"
                className="flex items-center gap-2"
              >
                <VolumeX className="w-4 h-4" />
                정지
              </Button>

              <Button
                onClick={handleDownload}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                다운로드
              </Button>
            </>
          )}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* 오디오 정보 */}
        {audioUrl && (
          <div className="p-3 bg-muted/50 rounded-md">
            <p className="text-sm text-muted-foreground">
              음성: {VOICE_OPTIONS.find(v => v.value === selectedVoice)?.label}
            </p>
            <p className="text-sm text-muted-foreground">
              텍스트 길이: {text.length}자
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
