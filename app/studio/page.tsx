import StudioDashboard from "@/components/StudioDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function StudioPage() {
  return (
    <ProtectedRoute returnUrl="/studio">
      <StudioDashboard />
    </ProtectedRoute>
  );
}
