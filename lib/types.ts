export type ProjectStatus = "SHIPPED" | "ACQUIRED" | "WIP" | "CONCEPT";

export type ExperienceType = "job" | "internship" | "education";

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  status: ProjectStatus | null;
  summary: string | null;
  company: string | null;
  type: string | null;
  year: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  is_featured: boolean;
  is_password_protected: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  is_visible: boolean;
  order_index: number;
}

export interface ProjectSection {
  id: string;
  project_id: string;
  section_type: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  order_index: number;
  created_at: string;
}

export interface AboutContent {
  id: string;
  intro_text: string | null;
  greeting_text: string | null;
  fun_facts: string[] | null;
  pronunciation: string | null;
  currently_role: string | null;
  currently_company: string | null;
  previously_companies: string | null;
  day_job_description: string | null;
  out_of_office_text: string | null;
  show_currently: boolean;
  show_previously: boolean;
  currently_label: string | null;
  previously_label: string | null;
  visible_social_links: string[] | null;
  superpower_1: string | null;
  superpower_1_desc: string | null;
  superpower_2: string | null;
  superpower_2_desc: string | null;
  superpower_3: string | null;
  superpower_3_desc: string | null;
  superpower_4: string | null;
  superpower_4_desc: string | null;
  gallery_images: string[] | null;
  internships_description: string | null;
  show_experience: boolean;
  show_internships: boolean;
  show_education: boolean;
  show_writing: boolean;
  show_featured_in: boolean;
  profile_image_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  email: string | null;
  updated_at: string;
}

export interface Experience {
  id: string;
  year_range: string;
  organization: string;
  role: string;
  description: string | null;
  type: ExperienceType;
  order_index: number;
  is_visible: boolean;
}

export interface Writing {
  id: string;
  title: string;
  url: string;
  publication: string | null;
  year: string | null;
  description: string | null;
  order_index: number;
  is_visible: boolean;
}

export interface FeaturedIn {
  id: string;
  year: string;
  title: string;
  url: string | null;
  publication: string | null;
  content_type: string | null;
  order_index: number;
  is_visible: boolean;
}

export interface CustomScript {
  id: string;
  label: string;
  code: string;
}

export interface FunProject {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  order_index: number;
}

export interface SiteSettings {
  id: string;
  resume_url: string | null;
  site_title: string;
  logo_url: string | null;
  logo_url_dark: string | null;
  hero_heading: string | null;
  nav_items: NavItem[] | null;
  footer_tagline: string | null;
  profile_image_url: string | null;
  grain_opacity: number | null;
  google_analytics_snippet: string | null;
  meta_pixel_snippet: string | null;
  hotjar_snippet: string | null;
  custom_scripts: CustomScript[] | null;
}
