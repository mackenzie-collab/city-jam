"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import VaultPanel from "@/components/VaultPanel";

export default function VaultPage() {
  return (
    <ProtectedRoute returnUrl="/vault">
      <VaultPanel />
    </ProtectedRoute>
  );
}
