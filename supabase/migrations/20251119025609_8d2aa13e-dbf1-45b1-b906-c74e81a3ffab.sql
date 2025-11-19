-- Add chat_history column to video_summaries table
ALTER TABLE video_summaries 
ADD COLUMN chat_history JSONB DEFAULT '[]'::jsonb;

-- Add index for faster queries on chat_history
CREATE INDEX idx_video_summaries_chat_history ON video_summaries USING gin(chat_history);

COMMENT ON COLUMN video_summaries.chat_history IS 'Stores the chat conversation history between user and AI about this video transcript';