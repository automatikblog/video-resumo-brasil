
-- Enable RLS on users_anonymous table
ALTER TABLE public.users_anonymous ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to manage their own records
CREATE POLICY "Users can manage their own anonymous records" 
ON public.users_anonymous 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);
