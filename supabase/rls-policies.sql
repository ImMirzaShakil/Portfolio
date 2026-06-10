-- Run this in the Supabase SQL Editor to allow public read access.
-- After applying, public pages can use the anon key with RLS instead of the service role.

alter table public.projects enable row level security;
alter table public.project_sections enable row level security;
alter table public.about_content enable row level security;
alter table public.experiences enable row level security;
alter table public.writings enable row level security;
alter table public.fun_projects enable row level security;
alter table public.site_settings enable row level security;

create policy "Public read published projects"
  on public.projects for select
  using (is_published = true);

create policy "Public read project sections"
  on public.project_sections for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = project_sections.project_id
        and projects.is_published = true
    )
  );

create policy "Public read about content"
  on public.about_content for select
  using (true);

create policy "Public read experiences"
  on public.experiences for select
  using (true);

create policy "Public read writings"
  on public.writings for select
  using (true);

create policy "Public read published fun projects"
  on public.fun_projects for select
  using (is_published = true);

create policy "Public read site settings"
  on public.site_settings for select
  using (true);

-- Authenticated admin access (logged-in Supabase users)
create policy "Authenticated manage projects"
  on public.projects for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated manage project sections"
  on public.project_sections for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated manage about content"
  on public.about_content for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated manage experiences"
  on public.experiences for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated manage writings"
  on public.writings for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated manage fun projects"
  on public.fun_projects for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated manage site settings"
  on public.site_settings for all
  to authenticated
  using (true)
  with check (true);

-- Storage policies for project-images and resume buckets
create policy "Public read project images"
  on storage.objects for select
  using (bucket_id = 'project-images');

create policy "Public read resume files"
  on storage.objects for select
  using (bucket_id = 'resume');

create policy "Authenticated upload project images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images');

create policy "Authenticated update project images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-images');

create policy "Authenticated delete project images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images');

create policy "Authenticated upload resume files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'resume');

create policy "Authenticated update resume files"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'resume');

create policy "Authenticated delete resume files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'resume');
