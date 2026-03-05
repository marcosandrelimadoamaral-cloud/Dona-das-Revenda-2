-- Tabela de Fila de Processamento
CREATE TABLE IF NOT EXISTS ai_job_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  type TEXT NOT NULL, -- 'generate_content', 'financial_report', 'ocr_invoice'
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  payload JSONB,
  result JSONB,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Index para performance
CREATE INDEX IF NOT EXISTS idx_ai_job_queue_status ON ai_job_queue(status) WHERE status = 'pending';

-- Função atômica: Criar venda + baixar estoque (garante consistência)
CREATE OR REPLACE FUNCTION create_sale_atomic(
  p_user_id UUID,
  p_client_id UUID,
  p_items JSONB,
  p_total_amount DECIMAL,
  p_payment_method TEXT,
  p_is_fiado BOOLEAN,
  p_due_date DATE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_sale_id UUID;
  v_item JSONB;
  v_product RECORD;
  v_new_stock INTEGER;
BEGIN
  -- Iniciar transação implícita
  
  -- 1. Criar a venda
  INSERT INTO sales (
    user_id, client_id, items, total_amount, 
    status, payment_method, is_fiado, due_date
  ) VALUES (
    p_user_id, p_client_id, p_items, p_total_amount,
    CASE WHEN p_is_fiado THEN 'pending' ELSE 'paid' END,
    p_payment_method, p_is_fiado, p_due_date
  ) RETURNING id INTO v_sale_id;
  
  -- 2. Para cada item, verificar e atualizar estoque
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    -- Verificar se tem estoque suficiente (com lock)
    SELECT * INTO v_product
    FROM user_products
    WHERE id = (v_item->>'product_id')::UUID
    AND user_id = p_user_id
    FOR UPDATE; -- Lock pessimista
    
    IF v_product.current_stock < (v_item->>'qty')::INTEGER THEN
      RAISE EXCEPTION 'Estoque insuficiente para produto %', v_product.custom_name;
    END IF;
    
    -- Calcular novo estoque
    v_new_stock := v_product.current_stock - (v_item->>'qty')::INTEGER;
    
    -- Atualizar produto
    UPDATE user_products
    SET 
      current_stock = v_new_stock,
      status = CASE 
        WHEN v_new_stock <= 0 THEN 'dead_stock'
        WHEN v_new_stock <= min_stock_alert THEN 'low_stock'
        ELSE 'active'
      END,
      last_sale_at = NOW()
    WHERE id = v_product.id;
    
    -- Se estoque zerar, notificar
    IF v_new_stock <= 5 THEN
      INSERT INTO notifications (user_id, title, message, type)
      VALUES (
        p_user_id, 
        'Estoque crítico!', 
        v_product.custom_name || ' está com apenas ' || v_new_stock || ' unidades',
        'stock_alert'
      );
    END IF;
  END LOOP;
  
  -- Retornar sucesso com ID da venda
  RETURN jsonb_build_object(
    'success', true,
    'sale_id', v_sale_id
  );
  
EXCEPTION
  WHEN OTHERS THEN
    -- Rollback automático, retornar erro
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Função para decrementar estoque (usada nas Edge Functions)
CREATE OR REPLACE FUNCTION decrement_stock(
  p_product_id UUID,
  p_quantity INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE user_products
  SET 
    current_stock = current_stock - p_quantity,
    status = CASE 
      WHEN (current_stock - p_quantity) <= 0 THEN 'dead_stock'
      WHEN (current_stock - p_quantity) <= min_stock_alert THEN 'low_stock'
      ELSE 'active'
    END
  WHERE id = p_product_id;
END;
$$;
