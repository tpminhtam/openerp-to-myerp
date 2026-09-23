import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { PersonaSwitcher } from "@/components/PersonaSwitcher";
import { findPrincipal, PRINCIPALS } from "@/lib/sod";

export const metadata: Metadata = {
  title: "myERP",
  description: "Tax-first, AI-native finance system of record, modernized from OpenERP 7.0",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const current = findPrincipal(jar.get("actor")?.value) ?? findPrincipal("tam.tran")!;
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <header className="sticky top-0 z-10 border-b border-[var(--line)] bg-white">
          <div className="flex items-center justify-between gap-4 px-4 py-2">
            <div className="flex items-baseline gap-3">
              <span className="text-lg font-semibold tracking-tight">myERP</span>
              <span className="text-xs text-[var(--muted)] hidden sm:inline">modernized from OpenERP 7.0 · tax-first, AI-native, change-controlled</span>
            </div>
            <PersonaSwitcher principals={PRINCIPALS} current={current} />
          </div>
        </header>
        <div className="flex min-h-[calc(100vh-49px)]">
          <aside className="hidden md:block w-56 shrink-0 border-r border-[var(--line)] bg-[#f1efe9] p-3">
            <Nav />
          </aside>
          <main className="flex-1 min-w-0 p-4 md:p-6">
            <div className="md:hidden mb-4 overflow-x-auto -mx-4 px-4"><Nav horizontal /></div>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
