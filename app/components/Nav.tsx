"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS: { title: string; items: { href: string; label: string }[] }[] = [
  { title: "Ledger", items: [{ href: "/", label: "Overview" }, { href: "/journal", label: "Journal" }, { href: "/trial-balance", label: "Trial balance" }, { href: "/invoices", label: "Invoices" }] },
  { title: "Tax configuration", items: [{ href: "/taxes", label: "Taxes" }, { href: "/changes", label: "Change requests" }, { href: "/history", label: "History" }] },
  { title: "Evidence", items: [{ href: "/audit", label: "Audit log" }] },
  { title: "Process", items: [{ href: "/forge", label: "Built with Forge" }] },
];

export function Nav({ horizontal = false }: { horizontal?: boolean }) {
  const path = usePathname();
  if (horizontal) {
    return (
      <nav className="flex gap-1 whitespace-nowrap">
        {SECTIONS.flatMap((s) => s.items).map((i) => {
          const active = i.href === "/" ? path === "/" : path.startsWith(i.href);
          return <Link key={i.href} href={i.href} className={`navlink ${active ? "active" : ""}`}>{i.label}</Link>;
        })}
      </nav>
    );
  }
  return (
    <nav className="flex flex-col gap-4">
      {SECTIONS.map((s) => (
        <div key={s.title}>
          <div className="label px-3">{s.title}</div>
          {s.items.map((i) => {
            const active = i.href === "/" ? path === "/" : path.startsWith(i.href);
            return <Link key={i.href} href={i.href} className={`navlink ${active ? "active" : ""}`}>{i.label}</Link>;
          })}
        </div>
      ))}
    </nav>
  );
}
