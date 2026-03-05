import {
  Profile,
  CatalogProduct,
  UserProduct,
  Client,
  Sale,
  AIAgentConfig,
  AIInteraction,
  WhatsappConversation,
  Notification
} from 'database';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile>;
        Update: Partial<Profile>;
      };
      catalog_products: {
        Row: CatalogProduct;
        Insert: Partial<CatalogProduct>;
        Update: Partial<CatalogProduct>;
      };
      user_products: {
        Row: UserProduct;
        Insert: Partial<UserProduct>;
        Update: Partial<UserProduct>;
      };
      clients: {
        Row: Client;
        Insert: Partial<Client>;
        Update: Partial<Client>;
      };
      sales: {
        Row: Sale;
        Insert: Partial<Sale>;
        Update: Partial<Sale>;
      };
      ai_agents_config: {
        Row: AIAgentConfig;
        Insert: Partial<AIAgentConfig>;
        Update: Partial<AIAgentConfig>;
      };
      ai_interactions: {
        Row: AIInteraction;
        Insert: Partial<AIInteraction>;
        Update: Partial<AIInteraction>;
      };
      whatsapp_conversations: {
        Row: WhatsappConversation;
        Insert: Partial<WhatsappConversation>;
        Update: Partial<WhatsappConversation>;
      };
      notifications: {
        Row: Notification;
        Insert: Partial<Notification>;
        Update: Partial<Notification>;
      };
    };
    Views: {
      [key: string]: {
        Row: Record<string, any>;
        Insert: Record<string, any>;
        Update: Record<string, any>;
      };
    };
    Functions: {
      [key: string]: {
        Args: Record<string, any>;
        Returns: any;
      };
    };
    Enums: {
      [key: string]: any;
    };
    CompositeTypes: {
      [key: string]: any;
    };
  };
}
