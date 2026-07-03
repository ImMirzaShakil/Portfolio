export const PROJECT_WITH_STATUS_SELECT =
  "*, project_status:project_statuses(id, label)";

export function getProjectStatusLabel(
  project: {
    project_status?: { label: string } | null;
  } | null
): string | null {
  return project?.project_status?.label?.trim() || null;
}
