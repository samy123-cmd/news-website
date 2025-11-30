-- OPTIMIZATION: user_preferences
-- Fixes "auth_rls_initplan" warning by wrapping auth.uid() in a subquery (select auth.uid())
-- This prevents the function from being re-evaluated for every row.

DROP POLICY IF EXISTS "Users can view own preferences" ON public.user_preferences;
CREATE POLICY "Users can view own preferences"
ON public.user_preferences
FOR SELECT
USING ( user_id = (select auth.uid()) );

DROP POLICY IF EXISTS "Users can update own preferences" ON public.user_preferences;
CREATE POLICY "Users can update own preferences"
ON public.user_preferences
FOR UPDATE
USING ( user_id = (select auth.uid()) );

DROP POLICY IF EXISTS "Users can insert own preferences" ON public.user_preferences;
CREATE POLICY "Users can insert own preferences"
ON public.user_preferences
FOR INSERT
WITH CHECK ( user_id = (select auth.uid()) );


-- OPTIMIZATION: articles
-- Fixes "multiple_permissive_policies" warning by consolidating duplicate/overlapping policies.

-- 1. Consolidate INSERT policies
-- Found: "Allow anon insert", "Allow public insert pending"
DROP POLICY IF EXISTS "Allow anon insert" ON public.articles;
DROP POLICY IF EXISTS "Allow public insert pending" ON public.articles;

-- Recreate a single policy for inserting pending articles
CREATE POLICY "Allow public insert pending"
ON public.articles
FOR INSERT
WITH CHECK ( status = 'pending' );


-- 2. Consolidate SELECT policies
-- Found: "Allow public read access", "Public articles are viewable by everyone"
DROP POLICY IF EXISTS "Allow public read access" ON public.articles;
DROP POLICY IF EXISTS "Public articles are viewable by everyone" ON public.articles;

-- Recreate a single policy for viewing published articles
CREATE POLICY "Public articles are viewable by everyone"
ON public.articles
FOR SELECT
USING ( status = 'published' );
