// Enums
export type PlanType = 'free' | 'pro' | 'business';
export type BrandType = 'natura' | 'avon' | 'boticario' | 'marykay' | 'jequiti' | 'eudora' | 'hinode' | 'oboticario' | 'independent';
export type SaleStatus = 'pending' | 'paid' | 'shipped' | 'cancelled' | 'defaulted';
export type ClientSegment = 'vip' | 'active' | 'dormant' | 'new';
export type ProductStatus = 'active' | 'low_stock' | 'expired' | 'dead_stock';
export type AgentType = 'clara' | 'finn' | 'zara' | 'nina' | 'lia';
export type NotificationType = 'stock_alert' | 'payment_due' | 'birthday' | 'system';

// Tabelas principais
export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  plan_type: PlanType;
  brands_sold: BrandType[];
  onboarding_completed: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CatalogProduct {
  id: string;
  brand: BrandType;
  name: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  base_price: number;
  suggested_price: number;
  images: string[];
  attributes: Record<string, any>;
  barcode: string | null;
  sku_code: string | null;
  is_active: boolean;
  created_at: string;
}

export interface UserProduct {
  id: string;
  user_id: string;
  catalog_id: string | null;
  custom_name: string;
  description: string | null;
  sku: string | null;
  purchase_price: number;
  sale_price: number;
  current_stock: number;
  min_stock_alert: number;
  expiration_date: string | null;
  batch_code: string | null;
  location: string | null;
  rotation_score: number | null;
  last_sale_at: string | null;
  status: ProductStatus;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string;
  birth_date: string | null;
  address: Record<string, any>;
  skin_type: string | null;
  preferences: Record<string, any>;
  purchase_history_summary: Record<string, any>;
  sentiment_score: number | null;
  last_contact_at: string | null;
  next_action_suggested: string | null;
  next_action_date: string | null;
  client_segment: ClientSegment;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: string;
  user_id: string;
  client_id: string | null;
  items: Array<{
    product_id: string;
    qty: number;
    price: number;
    discount?: number;
    product_name?: string;
  }>;
  total_amount: number;
  status: SaleStatus;
  payment_method: string;
  installments: number;
  is_fiado: boolean;
  due_date: string | null;
  paid_at: string | null;
  delivery_type: string | null;
  tracking_code: string | null;
  sale_date: string;
  created_at: string;
}

export interface AIAgentConfig {
  id: string;
  user_id: string;
  agent_type: AgentType;
  is_active: boolean;
  custom_prompts: Record<string, any>;
  tone_of_voice: number;
  auto_execute: boolean;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AIInteraction {
  id: string;
  user_id: string;
  agent_type: AgentType;
  input_context: string;
  output_content: string;
  context_data: Record<string, any>;
  user_rating: number | null;
  created_at: string;
}

export interface WhatsappConversation {
  id: string;
  user_id: string;
  client_id: string | null;
  phone_number: string;
  messages: Array<{
    id: string;
    content: string;
    sender: 'user' | 'client' | 'ai';
    timestamp: string;
    read: boolean;
  }>;
  last_message_at: string | null;
  ai_handled: boolean;
  status: 'active' | 'closed' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  data: Record<string, any>;
  created_at: string;
}

// Tipos auxiliares
export type SaleItem = {
  product_id: string;
  qty: number;
  price: number;
  discount?: number;
  product_name?: string;
};

export type Address = {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipcode?: string;
};

export type ProductAttributes = {
  volume?: string;
  skin_type?: string;
  fragrance_notes?: string;
  valid_months?: number;
  color?: string;
  [key: string]: any;
};
