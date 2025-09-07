export type Voice = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";

export type TTSModel = "tts-1" | "tts-1-hd";

export interface TTSRequest {
  text: string;
  voice?: Voice;
  model?: TTSModel;
}

export interface TTSResponse {
  success: boolean;
  audio: string; // Base64 encoded audio data
  format: "mp3";
  voice: Voice;
  model: TTSModel;
  textLength: number;
}

export interface TTSPlayerProps {
  text: string;
  className?: string;
}
