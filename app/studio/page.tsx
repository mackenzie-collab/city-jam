import AppChrome from "@/components/AppChrome";
import StudioDashboard from "@/components/StudioDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function StudioPage() {
  return (
    <AppChrome>
      <ProtectedRoute returnUrl="/studio">
        <StudioDashboard />
      </ProtectedRoute>
    </AppChrome>
  );
}
