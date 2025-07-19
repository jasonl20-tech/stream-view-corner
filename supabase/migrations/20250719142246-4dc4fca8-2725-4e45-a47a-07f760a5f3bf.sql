-- Modify videos table structure to match new requirements
ALTER TABLE public.videos 
DROP COLUMN IF EXISTS thumbnail_url,
DROP COLUMN IF EXISTS video_url,
DROP COLUMN IF EXISTS views_count,
DROP COLUMN IF EXISTS category;

-- Rename existing columns
ALTER TABLE public.videos 
RENAME COLUMN title TO titel;

ALTER TABLE public.videos 
RENAME COLUMN description TO describtion;

-- Add new columns
ALTER TABLE public.videos 
ADD COLUMN embed TEXT,
ADD COLUMN thumbnail TEXT,
ADD COLUMN image_1 TEXT,
ADD COLUMN image_2 TEXT,
ADD COLUMN image_3 TEXT,
ADD COLUMN image_4 TEXT,
ADD COLUMN image_5 TEXT,
ADD COLUMN image_6 TEXT,
ADD COLUMN image_7 TEXT,
ADD COLUMN image_8 TEXT,
ADD COLUMN image_9 TEXT,
ADD COLUMN image_10 TEXT,
ADD COLUMN image_11 TEXT,
ADD COLUMN image_12 TEXT,
ADD COLUMN image_13 TEXT,
ADD COLUMN image_14 TEXT,
ADD COLUMN tag_1 TEXT,
ADD COLUMN tag_2 TEXT,
ADD COLUMN tag_3 TEXT,
ADD COLUMN tag_4 TEXT,
ADD COLUMN tag_5 TEXT,
ADD COLUMN tag_6 TEXT,
ADD COLUMN tag_7 TEXT,
ADD COLUMN tag_8 TEXT;