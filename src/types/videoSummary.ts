
export interface VideoSummary {
  id: string;
  youtube_url: string;
  video_id?: string;
  summary?: string;
  transcript?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  user_id?: string | null;
  fingerprint?: string | null;
  is_playlist?: boolean;
  error_message?: string;
  chat_history?: Array<{role: 'user' | 'assistant', content: string, timestamp: string}>;
}
