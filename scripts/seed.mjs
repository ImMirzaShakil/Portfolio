import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env.local");
readFileSync(envPath, "utf8")
  .split("\n")
  .forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const IDS = {
  project1: "11111111-1111-1111-1111-111111111101",
  project2: "11111111-1111-1111-1111-111111111102",
  sectionOverview: "22222222-2222-2222-2222-222222222201",
  sectionQuickfactProblem: "22222222-2222-2222-2222-222222222202",
  sectionQuickfactOutcome: "22222222-2222-2222-2222-222222222203",
  sectionQuickfactRole: "22222222-2222-2222-2222-222222222204",
  sectionQuickfactTimeline: "22222222-2222-2222-2222-222222222205",
  sectionQuickfactTeam: "22222222-2222-2222-2222-222222222206",
  sectionSolution: "22222222-2222-2222-2222-222222222207",
  about: "33333333-3333-3333-3333-333333333301",
  experience1: "44444444-4444-4444-4444-444444444401",
  experience2: "44444444-4444-4444-4444-444444444402",
  experience3: "44444444-4444-4444-4444-444444444403",
  writing1: "55555555-5555-5555-5555-555555555501",
  writing2: "55555555-5555-5555-5555-555555555502",
  fun1: "66666666-6666-6666-6666-666666666601",
  fun2: "66666666-6666-6666-6666-666666666602",
  settings: "77777777-7777-7777-7777-777777777701",
};

async function upsert(table, rows) {
  const { error } = await supabase.from(table).upsert(rows, { onConflict: "id" });
  if (error) throw new Error(`${table}: ${error.message}`);
}

async function upsertSingleton(table, row) {
  const { data: existing, error: fetchError } = await supabase
    .from(table)
    .select("id")
    .limit(1)
    .maybeSingle();

  if (fetchError) throw new Error(`${table}: ${fetchError.message}`);

  const payload = existing?.id ? { ...row, id: existing.id } : row;
  const { error } = await supabase.from(table).upsert(payload, { onConflict: "id" });
  if (error) throw new Error(`${table}: ${error.message}`);
}

async function seed() {
  console.log("Seeding Supabase with placeholder data...\n");

  await upsertSingleton("site_settings", {
    id: IDS.settings,
    site_title: "Mirza Md Shakil",
    footer_tagline: "Building thoughtful digital experiences",
    resume_url:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  });
  console.log("✓ site_settings");

  await upsertSingleton("about_content", {
    id: IDS.about,
    intro_text:
        "I'm a software engineer who enjoys building clean, accessible web experiences. I care about thoughtful design, solid engineering, and products that feel simple to use.",
      currently_role: "Software Engineer",
      currently_company: "Tech Company",
      previously_companies: "Startup Inc, Design Agency, Freelance",
      superpower_1: "Turning complex ideas into clear, user-friendly interfaces",
      superpower_2: "Shipping fast without sacrificing quality",
      superpower_3: "Bridging design and engineering with strong communication",
      profile_image_url: "https://picsum.photos/seed/profile/400/400",
      twitter_url: "https://twitter.com/example",
      linkedin_url: "https://linkedin.com/in/example",
      github_url: "https://github.com/ImMirzaShakil",
      email: "hello@example.com",
  });
  console.log("✓ about_content");

  await upsert("projects", [
    {
      id: IDS.project1,
      slug: "portfolio-website",
      title: "Portfolio Website",
      subtitle: "A minimal, content-driven portfolio with a private admin panel",
      status: "SHIPPED",
      summary:
        "Designed and built a full-stack portfolio inspired by clean, text-forward layouts — with Supabase-backed content management and light/dark themes.",
      company: "Personal",
      type: "Case study",
      year: "2025",
      cover_image_url: "https://picsum.photos/seed/project1/1200/675",
      is_published: true,
      order_index: 0,
    },
    {
      id: IDS.project2,
      slug: "mobile-banking-app",
      title: "Mobile Banking App",
      subtitle: "Redesigning everyday banking for clarity and confidence",
      status: "WIP",
      summary:
        "Exploring a calmer mobile banking experience with clearer money movement, smarter notifications, and accessible UI patterns.",
      company: "FinTech Co",
      type: "Product design",
      year: "2024",
      cover_image_url: "https://picsum.photos/seed/project2/1200/675",
      is_published: false,
      order_index: 1,
    },
  ]);
  console.log("✓ projects");

  await upsert("project_sections", [
    {
      id: IDS.sectionOverview,
      project_id: IDS.project1,
      section_type: "overview",
      title: "Overview",
      content:
        "This portfolio needed to feel personal and editorial while still being easy to update without touching code.\n\nThe solution pairs a public-facing site with a protected admin panel, backed by Supabase for content, auth, and file storage.",
      image_url: null,
      order_index: 0,
    },
    {
      id: IDS.sectionQuickfactProblem,
      project_id: IDS.project1,
      section_type: "quickfact",
      title: "Problem",
      content: "Hardcoded portfolio content made updates slow and discouraged iteration.",
      image_url: null,
      order_index: 1,
    },
    {
      id: IDS.sectionQuickfactOutcome,
      project_id: IDS.project1,
      section_type: "quickfact",
      title: "Outcome",
      content: "A CMS-powered portfolio the client can manage independently.",
      image_url: null,
      order_index: 2,
    },
    {
      id: IDS.sectionQuickfactRole,
      project_id: IDS.project1,
      section_type: "quickfact",
      title: "Role",
      content: "Design & full-stack development",
      image_url: null,
      order_index: 3,
    },
    {
      id: IDS.sectionQuickfactTimeline,
      project_id: IDS.project1,
      section_type: "quickfact",
      title: "Timeline",
      content: "6 weeks",
      image_url: null,
      order_index: 4,
    },
    {
      id: IDS.sectionQuickfactTeam,
      project_id: IDS.project1,
      section_type: "quickfact",
      title: "Team",
      content: "Solo project",
      image_url: null,
      order_index: 5,
    },
    {
      id: IDS.sectionSolution,
      project_id: IDS.project1,
      section_type: "solution",
      title: "Solution",
      content:
        "Built with Next.js, Tailwind, and Supabase. Public pages are server-rendered for performance, while the admin panel handles projects, about content, and resume uploads.",
      image_url: "https://picsum.photos/seed/solution/1200/800",
      order_index: 6,
    },
  ]);
  console.log("✓ project_sections");

  await upsert("experiences", [
    {
      id: IDS.experience1,
      year_range: "2023 — Present",
      organization: "Tech Company",
      role: "Software Engineer",
      description:
        "Building product features across the frontend and backend, collaborating with design, and improving performance across key user flows.",
      type: "job",
      order_index: 0,
    },
    {
      id: IDS.experience2,
      year_range: "2021 — 2023",
      organization: "Startup Inc",
      role: "Frontend Developer",
      description:
        "Led UI implementation for the core product, introduced component standards, and helped ship major releases on a small team.",
      type: "job",
      order_index: 1,
    },
    {
      id: IDS.experience3,
      year_range: "Summer 2020",
      organization: "Design Agency",
      role: "Engineering Intern",
      description:
        "Supported client website builds, learned production workflows, and contributed to responsive layout systems.",
      type: "internship",
      order_index: 2,
    },
  ]);
  console.log("✓ experiences");

  await upsert("writings", [
    {
      id: IDS.writing1,
      title: "Designing Calm Interfaces",
      url: "https://example.com/designing-calm-interfaces",
      publication: "Personal Blog",
      year: "2024",
      order_index: 0,
    },
    {
      id: IDS.writing2,
      title: "Notes on Shipping Side Projects",
      url: "https://example.com/shipping-side-projects",
      publication: "Medium",
      year: "2023",
      order_index: 1,
    },
  ]);
  console.log("✓ writings");

  await upsert("fun_projects", [
    {
      id: IDS.fun1,
      title: "Color Palette Generator",
      description: "A tiny tool for exploring warm neutral palettes for editorial sites.",
      url: "https://example.com/color-tool",
      cover_image_url: "https://picsum.photos/seed/fun1/1200/675",
      is_published: true,
      order_index: 0,
    },
    {
      id: IDS.fun2,
      title: "Typography Playground",
      description: "Experimenting with type scale, rhythm, and responsive headings.",
      url: "https://example.com/type-playground",
      cover_image_url: "https://picsum.photos/seed/fun2/1200/675",
      is_published: true,
      order_index: 1,
    },
  ]);
  console.log("✓ fun_projects");

  console.log("\nSeed complete.");
}

seed().catch((error) => {
  console.error("\nSeed failed:", error.message);
  process.exit(1);
});
