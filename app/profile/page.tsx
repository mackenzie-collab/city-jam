import ProfilePanel from "@/components/ProfilePanel";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProfilePage() {
  return (
    <ProtectedRoute returnUrl="/profile">
      <ProfilePanel />
    </ProtectedRoute>
  );
}
