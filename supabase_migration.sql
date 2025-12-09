-- Add tags (array of text) and curation_note (text) to articles table

ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS curation_note text;

-- Create an index on tags for faster filtering later (Topic Hubs)
CREATE INDEX IF NOT EXISTS idx_articles_tags ON articles USING GIN (tags);

-- Add ai_processed flag to track which articles have AI-enhanced content
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS ai_processed boolean DEFAULT false;

-- Create index for filtering by ai_processed status
CREATE INDEX IF NOT EXISTS idx_articles_ai_processed ON articles (ai_processed);

