-- Updated categories for aari and sewing materials
-- Insert sample categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Aari & Embroidery Thread', 'aari-embroidery', 'Premium embroidery threads and aari materials'),
  ('Fabrics', 'fabrics', 'Fine quality fabrics for boutique and sewing'),
  ('Sewing Supplies', 'sewing-supplies', 'Essential sewing needles, tools, and accessories'),
  ('Beads & Embellishments', 'beads-embellishments', 'Decorative beads, sequins, and embellishments'),
  ('Trimmings & Lace', 'trimmings-lace', 'Borders, lace, and finishing trimmings')
ON CONFLICT DO NOTHING;

-- Replaced all products with aari/sewing/boutique materials
INSERT INTO public.products (name, slug, description, price, stock_quantity, category_id, image_url)
SELECT
  'Premium Metallic Aari Thread Set',
  'metallic-aari-thread',
  'Luxurious metallic threads perfect for intricate embroidery work',
  49.99,
  60,
  (SELECT id FROM public.categories WHERE slug = 'aari-embroidery'),
  '/placeholder.svg?height=300&width=300'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE slug = 'metallic-aari-thread');

INSERT INTO public.products (name, slug, description, price, stock_quantity, category_id, image_url)
SELECT
  'Pure Silk Fabric - Ivory',
  'silk-fabric-ivory',
  'Premium pure silk fabric with luxurious finish',
  35.99,
  45,
  (SELECT id FROM public.categories WHERE slug = 'fabrics'),
  '/placeholder.svg?height=300&width=300'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE slug = 'silk-fabric-ivory');

INSERT INTO public.products (name, slug, description, price, stock_quantity, category_id, image_url)
SELECT
  'Hand Embroidery Needle Set',
  'embroidery-needle-set',
  'Premium hand-forged embroidery needles in various sizes',
  24.99,
  80,
  (SELECT id FROM public.categories WHERE slug = 'sewing-supplies'),
  '/placeholder.svg?height=300&width=300'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE slug = 'embroidery-needle-set');

INSERT INTO public.products (name, slug, description, price, stock_quantity, category_id, image_url)
SELECT
  'Mixed Glass Beads & Rhinestones',
  'glass-beads-rhinestones',
  'Assorted decorative beads and rhinestones for embellishment',
  39.99,
  70,
  (SELECT id FROM public.categories WHERE slug = 'beads-embellishments'),
  '/placeholder.svg?height=300&width=300'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE slug = 'glass-beads-rhinestones');

INSERT INTO public.products (name, slug, description, price, stock_quantity, category_id, image_url)
SELECT
  'Designer Lace Trimming Collection',
  'designer-lace-trimming',
  'Elegant lace trimmings for boutique finishing touches',
  29.99,
  55,
  (SELECT id FROM public.categories WHERE slug = 'trimmings-lace'),
  '/placeholder.svg?height=300&width=300'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE slug = 'designer-lace-trimming');

INSERT INTO public.products (name, slug, description, price, stock_quantity, category_id, image_url)
SELECT
  'Silk Dupatta Fabric - Maroon',
  'silk-dupatta-maroon',
  'Traditional silk dupatta fabric for elegant designs',
  44.99,
  35,
  (SELECT id FROM public.categories WHERE slug = 'fabrics'),
  '/placeholder.svg?height=300&width=300'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE slug = 'silk-dupatta-maroon');

INSERT INTO public.products (name, slug, description, price, stock_quantity, category_id, image_url)
SELECT
  'Professional Aari Needles Set',
  'professional-aari-needles',
  'High-quality aari needles for professional embroidery',
  34.99,
  50,
  (SELECT id FROM public.categories WHERE slug = 'aari-embroidery'),
  '/placeholder.svg?height=300&width=300'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE slug = 'professional-aari-needles');
