import { Suspense } from "react";
import LoginContent from "./LoginContent";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-cj-purple">
          <p className="text-cj-gold-muted">Loading...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
