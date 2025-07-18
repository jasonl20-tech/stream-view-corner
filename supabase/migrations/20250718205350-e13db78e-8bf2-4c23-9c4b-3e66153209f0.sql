-- Videos table für dynamische Inhalte
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  video_url TEXT,
  duration TEXT NOT NULL,
  views_count INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Videos sind öffentlich sichtbar (keine Authentifizierung erforderlich)
CREATE POLICY "Videos are publicly viewable" 
ON public.videos 
FOR SELECT 
USING (true);

-- Profiles table für zusätzliche User-Daten
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Function für automatische Timestamp-Updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers für automatische Timestamps
CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger für automatische Profile-Erstellung bei User-Registrierung
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'display_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Demo-Videos einfügen
INSERT INTO public.videos (title, description, thumbnail_url, duration, views_count, category) VALUES
('Epic Gaming Moments - Die besten Highlights 2024', 'Die spektakulärsten Gaming-Momente des Jahres', '/assets/thumb1.jpg', '15:30', 2400000, 'Gaming'),
('Moderne Web-Entwicklung Tutorial - React & TypeScript', 'Lerne moderne Webentwicklung von Grund auf', '/assets/thumb2.jpg', '22:15', 856000, 'Technologie'),
('Entspannende Musik für Produktivität und Focus', 'Entspanne dich mit dieser beruhigenden Musik', '/assets/thumb3.jpg', '45:20', 1200000, 'Musik'),
('Wissenschaft einfach erklärt - Quantenphysik Grundlagen', 'Quantenphysik für Anfänger verständlich erklärt', '/assets/thumb4.jpg', '18:45', 567000, 'Bildung'),
('Fußball WM Highlights - Beste Tore und Momente', 'Die besten Fußball-Momente der WM', '/assets/thumb5.jpg', '12:30', 3100000, 'Sport'),
('Comedy Gold - Die lustigsten Momente des Jahres', 'Lachen garantiert mit diesen Comedy-Highlights', '/assets/thumb6.jpg', '25:10', 1800000, 'Entertainment'),
('Fortgeschrittene Gaming Strategien - Pro Tipps', 'Werde zum Gaming-Profi mit diesen Strategien', '/assets/thumb1.jpg', '19:20', 945000, 'Gaming'),
('KI und Machine Learning - Zukunft der Technologie', 'Entdecke die Zukunft der künstlichen Intelligenz', '/assets/thumb2.jpg', '28:55', 1300000, 'Technologie'),
('Live Concert Experience - Electronic Music Festival', 'Erlebe das beste Electronic Music Festival live', '/assets/thumb3.jpg', '52:40', 2700000, 'Musik');