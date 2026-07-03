import { ProjectForm } from "@/components/admin/ProjectForm";
import { fetchProjectStatuses } from "@/app/admin/projects/statuses/actions";

export default async function NewProjectPage() {
  const statusOptions = await fetchProjectStatuses();

  return <ProjectForm statusOptions={statusOptions} />;
}
