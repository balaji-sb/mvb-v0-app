-- Add admin policies for categories table
-- Admin users should be able to INSERT, UPDATE, and DELETE categories

CREATE POLICY "categories_insert_admin" ON public.categories 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "categories_update_admin" ON public.categories 
  FOR UPDATE 
  USING (true);

CREATE POLICY "categories_delete_admin" ON public.categories 
  FOR DELETE 
  USING (true);

-- Add admin policies for products table
CREATE POLICY "products_insert_admin" ON public.products 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "products_update_admin" ON public.products 
  FOR UPDATE 
  USING (true);

CREATE POLICY "products_delete_admin" ON public.products 
  FOR DELETE 
  USING (true);

-- Add admin policies for orders (view and update status)
CREATE POLICY "orders_select_admin" ON public.orders 
  FOR SELECT 
  USING (true);

CREATE POLICY "orders_update_admin" ON public.orders 
  FOR UPDATE 
  USING (true);

-- Add admin policies for order_items
CREATE POLICY "order_items_select_admin" ON public.order_items 
  FOR SELECT 
  USING (true);
