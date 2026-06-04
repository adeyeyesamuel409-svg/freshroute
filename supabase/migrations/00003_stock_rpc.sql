-- RPC function to safely decrement stock for multiple products
CREATE OR REPLACE FUNCTION decrement_stock(p_items JSONB)
RETURNS void AS $$
DECLARE
  item JSONB;
BEGIN
  FOR item IN SELECT jsonb_array_elements(p_items)
  LOOP
    UPDATE products
    SET stock_qty = stock_qty - (item->>'quantity')::int
    WHERE id = (item->>'product_id')::uuid
      AND stock_qty >= (item->>'quantity')::int;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Insufficient stock for product %', (item->>'product_id')::uuid;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
