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
  order_index: number;
  created_at: string;
  updated_at: string;
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
  currently_role: string | null;
  currently_company: string | null;
  previously_companies: string | null;
  superpower_1: string | null;
  superpower_2: string | null;
  superpower_3: string | null;
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
}

export interface Writing {
  id: string;
  title: string;
  url: string;
  publication: string | null;
  year: string | null;
  order_index: number;
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
  footer_tagline: string | null;
}
