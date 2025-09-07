"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Volume2, VolumeX, Play, Pause, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TTSPlayerProps, Voice } from "@/types/tts";

const VOICE_OPTIONS = [
  { value: "alloy", label: "Alloy" },
  { value: "echo", label: "Echo" },
  { value: "fable", label: "Fable" },
  { value: "onyx", label: "Onyx" },
  { value: "nova", label: "Nova" },
  { value: "shimmer", label: "Shimmer" },
];

export function CompactTTSPlayer({ text, className }: TTSPlayerProps) {
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
    <div className={cn("space-y-3", className)}>
      {/* 음성 선택 및 생성 버튼 */}
      <div className="flex items-center gap-2">
        <Select value={selectedVoice} onValueChange={setSelectedVoice}>
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VOICE_OPTIONS.map((voice) => (
              <SelectItem key={voice.value} value={voice.value} className="text-xs">
                {voice.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button
          onClick={handleGenerateTTS}
          disabled={isLoading || !text.trim()}
          size="sm"
          className="h-8 px-2 text-xs"
        >
          {isLoading ? (
            <LoadingSpinner size="sm" text="" />
          ) : (
            <>
              <Volume2 className="w-3 h-3 mr-1" />
              음성
            </>
          )}
        </Button>
      </div>

      {/* 오디오 컨트롤 */}
      {audioUrl && (
        <div className="flex items-center gap-1">
          <Button
            onClick={handlePlayPause}
            size="sm"
            variant="outline"
            className="h-7 px-2 text-xs"
          >
            {isPlaying ? (
              <Pause className="w-3 h-3" />
            ) : (
              <Play className="w-3 h-3" />
            )}
          </Button>

          <Button
            onClick={handleStop}
            size="sm"
            variant="outline"
            className="h-7 px-2 text-xs"
          >
            <VolumeX className="w-3 h-3" />
          </Button>

          <Button
            onClick={handleDownload}
            size="sm"
            variant="outline"
            className="h-7 px-2 text-xs"
          >
            <Download className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="text-xs text-destructive bg-destructive/10 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
