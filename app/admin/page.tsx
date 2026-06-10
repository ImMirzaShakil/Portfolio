import Link from "next/link";
import { FileText, FolderKanban, Pencil } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";

const quickActions = [
  {
    href: "/admin/projects",
    title: "Manage Projects",
    description: "Create, edit, and publish portfolio case studies.",
    icon: FolderKanban,
  },
  {
    href: "/admin/about",
    title: "Edit About",
    description: "Update bio, experience, and profile details.",
    icon: Pencil,
  },
  {
    href: "/admin/resume",
    title: "Update Resume",
    description: "Upload or replace the public resume PDF.",
    icon: FileText,
  },
] as const;

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  const [{ data: projects }, { count: writingsCount }] = await Promise.all([
    supabase.from("projects").select("id, is_published"),
    supabase.from("writings").select("*", { count: "exact", head: true }),
  ]);

  const totalProjects = projects?.length ?? 0;
  const publishedProjects =
    projects?.filter((project) => project.is_published).length ?? 0;

  const stats = [
    { label: "Total projects", value: totalProjects },
    { label: "Published projects", value: publishedProjects },
    { label: "Writings", value: writingsCount ?? 0 },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Welcome back 👋</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your portfolio content from one place.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Quick actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.href}
                href={action.href}
                className="rounded-2xl border border-border bg-card p-6 transition-colors hover:bg-muted/50"
              >
                <Icon className="mb-4 size-6" />
                <h3 className="text-lg font-semibold">{action.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
