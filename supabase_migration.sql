-- Add tags (array of text) and curation_note (text) to articles table

ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS curation_note text;

-- Create an index on tags for faster filtering later (Topic Hubs)
CREATE INDEX IF NOT EXISTS idx_articles_tags ON articles USING GIN (tags);
