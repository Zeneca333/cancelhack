-- Remove YouTube Premium: reported to actually cancel accounts instead of offering retention discount
DELETE FROM services WHERE slug = 'youtube-premium';
