import AppChrome from "@/components/AppChrome";
import ProfilePanel from "@/components/ProfilePanel";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProfilePage({
  searchParams,
}: {
  searchParams?: { user?: string };
}) {
  const viewUserId = searchParams?.user;

  return (
    <AppChrome>
      <ProtectedRoute returnUrl="/profile">
        <ProfilePanel viewUserId={viewUserId} />
      </ProtectedRoute>
    </AppChrome>
  );
}
