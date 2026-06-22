// src/app/signin/page.tsx
// Guest-only. Middleware redirects authenticated users to /dashboard before render.
import { Suspense } from "react";
import SignInForm from "./SignInForm";

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
