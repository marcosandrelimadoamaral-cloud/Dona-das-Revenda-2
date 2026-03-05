import { z } from 'zod';

export const productSchema = z.object({
  custom_name: z.string().min(2, 'Nome muito curto'),
  purchase_price: z.number().positive('Preço deve ser positivo'),
  sale_price: z.number().positive('Preço deve ser positivo'),
  current_stock: z.number().int().min(0, 'Estoque não pode ser negativo'),
  min_stock_alert: z.number().int().min(1),
  expiration_date: z.string().optional(),
});

export const clientSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  phone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('Email inválido').optional(),
});

export const saleSchema = z.object({
  client_id: z.string().optional(),
  items: z.array(z.object({
    product_id: z.string(),
    qty: z.number().int().min(1),
    price: z.number().positive(),
  })).min(1, 'Adicione pelo menos um item'),
  payment_method: z.string(),
  is_fiado: z.boolean(),
});
