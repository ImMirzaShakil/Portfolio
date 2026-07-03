import Link from "next/link";
import { ProjectStatusesManager } from "@/components/admin/ProjectStatusesManager";
import { Button } from "@/components/ui/button";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function ProjectStatusesPage() {
  const supabase = createAdminClient();

  const { data: statuses } = await supabase
    .from("project_statuses")
    .select("id, label, order_index")
    .order("order_index", { ascending: true });

  return (
    <div className="space-y-6">
      <Link href="/admin/projects">
        <Button variant="outline" size="sm">
          Back to projects
        </Button>
      </Link>

      <ProjectStatusesManager initialStatuses={statuses ?? []} />
    </div>
  );
}
