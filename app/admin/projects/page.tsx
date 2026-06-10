import Link from "next/link";
import { ProjectsTable } from "@/components/admin/ProjectsTable";
import { Button } from "@/components/ui/button";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminProjectsPage() {
  const supabase = createAdminClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("order_index", { ascending: true });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="mt-2 text-muted-foreground">
            Manage case studies shown on the public site.
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button>Add New Project</Button>
        </Link>
      </div>

      <ProjectsTable projects={projects ?? []} />
    </div>
  );
}
