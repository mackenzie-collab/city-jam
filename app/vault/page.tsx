import { Suspense } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import VaultPanel from "@/components/VaultPanel";

export default function VaultPage() {
  return (
    <ProtectedRoute returnUrl="/vault">
      <Suspense fallback={<p className="p-10 text-center text-cj-gold-muted">Loading vault...</p>}>
        <VaultPanel />
      </Suspense>
    </ProtectedRoute>
  );
}
