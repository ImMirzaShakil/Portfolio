import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { createAdminClient } from "@/lib/supabase/admin";

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const supabase = createAdminClient();

  const [{ data: project }, { data: sections }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", params.id).maybeSingle(),
    supabase
      .from("project_sections")
      .select("*")
      .eq("project_id", params.id)
      .order("order_index", { ascending: true }),
  ]);

  if (!project) {
    notFound();
  }

  const { password_hash, ...safeProject } = project;
  void password_hash;

  return <ProjectForm project={safeProject} sections={sections ?? []} />;
}
