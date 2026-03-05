-- Create ai_settings table
CREATE TABLE IF NOT EXISTS public.ai_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    user_name TEXT,
    store_name TEXT,
    target_audience TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own ai_settings" 
    ON public.ai_settings FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ai_settings" 
    ON public.ai_settings FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ai_settings" 
    ON public.ai_settings FOR UPDATE 
    USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER handle_ai_settings_updated_at
    BEFORE UPDATE ON public.ai_settings
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();
