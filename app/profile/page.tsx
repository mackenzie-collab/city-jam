import ProfilePanel from "@/components/ProfilePanel";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProfilePage({
  searchParams,
}: {
  searchParams?: { user?: string };
}) {
  const viewUserId = searchParams?.user;

  if (viewUserId) {
    return <ProfilePanel viewUserId={viewUserId} />;
  }

  return (
    <ProtectedRoute returnUrl="/profile">
      <ProfilePanel />
    </ProtectedRoute>
  );
}
