insert into spark_categories (name, icon_key, color) values
('Food', 'food', '#2E5BAD'),
('Coffee', 'coffee', '#7BA3E0'),
('Study', 'study', '#4E6585'),
('Outdoors', 'outdoors', '#4C7D93'),
('Hidden gem', 'hidden', '#2E5BAD')
on conflict do nothing;

-- App sample data is also available in src/data for local fallback mode.
