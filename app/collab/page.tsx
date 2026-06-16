"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import CollabPanel from "@/components/CollabPanel";

export default function CollabPage() {
  return (
    <ProtectedRoute returnUrl="/collab">
      <CollabPanel />
    </ProtectedRoute>
  );
}
