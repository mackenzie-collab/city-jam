import CircleDetail from "@/components/CircleDetail";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CirclePage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute returnUrl={`/circles/${params.id}`}>
      <CircleDetail circleId={params.id} />
    </ProtectedRoute>
  );
}
