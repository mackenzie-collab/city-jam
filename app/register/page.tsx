import { Suspense } from "react";
import RegisterContent from "./RegisterContent";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-cj-purple">
          <p className="text-cj-gold-muted">Loading...</p>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
