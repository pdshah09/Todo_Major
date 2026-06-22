// src/app/page.tsx
// Public landing page.
// Middleware already redirects logged-in users to /dashboard before this renders.
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-brand font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between px-12 py-12 sm:items-start">
        <div className="max-w-2xl mx-auto">
          {/* Notebook-style container */}
          <div className="bg-brand-light bg-opacity-45 backdrop-blur-sm shadow-2xl rounded-xl relative">
            {/* Notebook Lines */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 23px, #3b82f6 23px, #3b82f6 24px)', backgroundSize: '100% 24px' }}
            />
            {/* Red Margin */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-red-300 opacity-30" />

            <div className="relative px-8 py-12">
              {/* Hero */}
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-text-main mb-4">TodoNest</h1>
                <div className="w-24 h-1 bg-brand mx-auto rounded-full mb-4" />
                <p className="text-xl text-canvas mb-2">Organize your life, one task at a time</p>
                <p className="text-canvas">A beautiful, intuitive way to manage your daily tasks and boost productivity</p>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  { icon: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", title: "Easy Organization", desc: "Drag, drop, and organize your tasks effortlessly" },
                  { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", title: "Secure & Private", desc: "Your tasks are safe and only visible to you" },
                  { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Lightning Fast", desc: "Real-time sync and instant updates" },
                ].map(f => (
                  <div key={f.title} className="text-center p-4">
                    <div className="w-12 h-12 bg-canvas rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-canvas mb-1">{f.title}</h3>
                    <p className="text-sm text-canvas">{f.desc}</p>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="space-y-4">
                <Link href="/signup"
                  className="block w-full text-center bg-brand hover:bg-slate-900 text-white font-medium py-4 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg text-lg">
                  Get Started
                </Link>
                <Link href="/signin"
                  className="block w-full text-center border-2 border-slate-600 text-canvas hover:bg-dashboard font-medium py-4 px-6 rounded-lg transition-colors text-lg">
                  Already have an account? Sign In
                </Link>
              </div>

              <div className="text-center mt-8 pt-6 border-t border-dark">
                <p className="text-canvas text-sm">Join thousands of users who have organized their lives with TodoNest</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
