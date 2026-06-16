import ProjectDetail from "@/components/ProjectDetail";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProjectPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute returnUrl={`/studio/projects/${params.id}`}>
      <ProjectDetail projectId={params.id} />
    </ProtectedRoute>
  );
}
