-- Expand the category check constraint to include new categories
ALTER TABLE services DROP CONSTRAINT IF EXISTS services_category_check;
ALTER TABLE services ADD CONSTRAINT services_category_check
  CHECK (category IN ('streaming', 'software', 'fitness', 'music', 'gaming', 'news', 'cloud', 'other', 'vpn', 'dating', 'learning', 'food', 'wellness', 'delivery'));
