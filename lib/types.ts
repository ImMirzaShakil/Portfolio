import type { SharedSeoFields, SitePageSeo } from "@/lib/seo";

export interface ProjectStatusOption {
  id: string;
  label: string;
  order_index: number;
}

export type ExperienceType = "job" | "internship" | "education";

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  status_id: string | null;
  project_status?: Pick<ProjectStatusOption, "label"> | null;
  summary: string | null;
  problem_text: string | null;
  outcome_text: string | null;
  problem_label: string | null;
  outcome_label: string | null;
  impact_text: string | null;
  role_text: string | null;
  timeline_text: string | null;
  team_text: string | null;
  company: string | null;
  type: string | null;
  year: string | null;
  cover_image_url: string | null;
  thumbnail_image_url: string | null;
  thumbnail_aspect_ratio: string | null;
  is_published: boolean;
  is_featured: boolean;
  is_password_protected: boolean;
  /** Shared SEO (title, description, image, tags) for all platforms. */
  seo?: SharedSeoFields | null;
  /** Show share icon on project cards. Defaults to true. */
  show_share_button?: boolean | null;
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

export interface ProjectSectionItem {
  id: string;
  label: string;
  title: string;
  description: string;
}

export interface ProjectSection {
  id: string;
  project_id: string;
  section_type: string;
  title: string | null;
  content: string | null;
  /** 'text' (default) or 'html' — how `content` is rendered on the public page. */
  content_format: string | null;
  image_url: string | null;
  video_url: string | null;
  layout: string | null;
  media_urls: string[] | null;
  items: ProjectSectionItem[] | null;
  /** Free-layout canvas document (Konva editor JSON). */
  canvas_data?: Record<string, unknown> | null;
  /** Gutenberg-like blocks document JSON. */
  blocks_data?: Record<string, unknown> | null;
  /** Luthor visual-editor document (markdown + Lexical JSON). */
  luthor_data?: Record<string, unknown> | null;
  order_index: number;
  created_at: string;
}

export interface SectionTemplate {
  id: string;
  name: string;
  section_kind: string;
  document: Record<string, unknown>;
  thumbnail_url: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface AboutContent {
  id: string;
  intro_text: string | null;
  home_intro_text: string | null;
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
  visible_social_links_hero: string[] | null;
  visible_social_links_footer: string[] | null;
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
  show_featured_in_home: boolean;
  profile_image_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
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
  home_video_section_title: string | null;
  home_video_youtube_url: string | null;
  home_video_title: string | null;
  home_video_subtitle: string | null;
  show_home_video: boolean;
  google_analytics_snippet: string | null;
  meta_pixel_snippet: string | null;
  hotjar_snippet: string | null;
  custom_scripts: CustomScript[] | null;
  /** Google Search Console HTML-tag verification content. */
  google_site_verification?: string | null;
  /** Per-page SEO keyed by home | work | about | fun (shared across platforms). */
  page_seo?: SitePageSeo | null;
}
