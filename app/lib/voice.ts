/**
 * Voice is a surface, not a second agent. A spoken sentence becomes one of a few governed actions,
 * performed by Claude as the `claude` principal through the same service layer the screens use.
 * Every number spoken comes from the deterministic replay or from a note that passed the grounding
 * check; nothing is spoken before it is verified. "Merge it" really calls merge, and SOD-02 refuses it.
 */
import { prisma } from "./db";
import { explainRequest, proposeFromText } from "./agent";
import { getRequest, merge, review, runChecks } from "./changes";
import { verifyChain } from "./audit";
import { findPrincipal } from "./sod";
import { speakable } from "./speech";

export interface VoiceReply {
  heard: string;
  action: "propose" | "checks" | "explain" | "merge" | "approve" | "books" | "audit" | "help";
  reply: string;          // what the screen shows
  spoken: string;         // what is read aloud (sanitised, verified)
  number?: string;
  navigate?: string;
  blocked?: { ruleId?: string; message?: string };
  grounded?: boolean;
}

const claude = () => findPrincipal("claude")!;

async function resolveNumber(text: string, context?: string): Promise<string | undefined> {
  const m = /(?:change request|request|cr)[\s-]*(?:number\s*)?0*(\d{1,4})\b/i.exec(text);
  if (m) return `CR-${m[1].padStart(4, "0")}`;
  if (context) return context;
  const latest = await prisma.changeRequest.findFirst({ where: { status: "open" }, orderBy: { openedAt: "desc" } });
  return latest?.number;
}

async function ensureChecks(number: string) {
  const d = await getRequest(number);
  if (!d.checks.every((c) => c)) await runChecks(number, claude());
}

export async function handleVoice(text: string, contextNumber?: string): Promise<VoiceReply> {
  const heard = text.trim();
  const t = heard.toLowerCase();
  const done = (r: Omit<VoiceReply, "heard" | "spoken"> & { spoken?: string }): VoiceReply => ({ heard, ...r, spoken: speakable(r.spoken ?? r.reply) });

  // 1. Approve or merge: Claude really tries, and the process layer refuses it.
  if (/\b(merge|approve|sign off|ship it|push it|put it in force)\b/.test(t)) {
    const number = await resolveNumber(t, contextNumber);
    if (!number) return done({ action: "merge", reply: "There is no open change request to merge." });
    const wantsMerge = /\b(merge|ship it|push it|put it in force)\b/.test(t);
    const result = wantsMerge ? await merge(number, claude()) : await review(number, claude(), "approved");
    if (result.blocked) {
      const rule = result.decision?.ruleId;
      return done({
        action: wantsMerge ? "merge" : "approve", number, navigate: `/changes/${number}`, blocked: { ruleId: rule, message: result.decision?.message },
        reply: `I tried to ${wantsMerge ? "merge" : "approve"} ${number}. Refused by ${rule}: ${result.decision?.message} The attempt is recorded as evidence.`,
        spoken: `I tried to ${wantsMerge ? "merge" : "approve"} ${number}, and the system refused me. Rule ${rule}: agents propose, humans decide. The attempt is now in the audit log. A tax reviewer has to approve it.`,
      });
    }
    return done({ action: wantsMerge ? "merge" : "approve", number, reply: `Unexpected: ${number} was not refused.` });
  }

  // 2. Explain: the grounded note, spoken only if every figure checked out.
  if (/\b(explain|summari[sz]e|walk me through|tell me about|what does (it|this|the change) do|brief me)\b/.test(t)) {
    const number = await resolveNumber(t, contextNumber);
    if (!number) return done({ action: "explain", reply: "There is no open change request to explain." });
    await ensureChecks(number);
    const e = await explainRequest(number);
    if (!e.grounded) {
      return done({ action: "explain", number, navigate: `/changes/${number}`, grounded: false, reply: `${e.note}\n\n(Not read aloud: ${e.ungrounded.join(", ")} could not be matched to the impact result.)`, spoken: "I wrote a note, but I could not verify every figure in it, so I won't read it out. It is on screen, flagged." });
    }
    return done({ action: "explain", number, navigate: `/changes/${number}`, grounded: true, reply: `${e.note}\n\n(${e.figuresChecked} figures checked against the impact result.)`, spoken: e.note.split(/(?<=[.!?])\s+/).slice(0, 2).join(" ") });
  }

  // 3. Propose a change in plain English, then run the checks so the number spoken is the replay's.
  if (/\b(raise|lower|increase|decrease|reduce|cut|set|change|make|deactivate|disable|enable|rename|propose|bump)\b/.test(t) && /\b(vat|tax|rate|percent|%|s15|s6|p15|p6|exempt)\b/.test(t)) {
    const p = await proposeFromText(heard);
    const { impact, checks } = await runChecks(p.number, claude());
    const allGreen = checks.every((c) => c.conclusion === "success");
    return done({
      action: "propose", number: p.number, navigate: `/changes/${p.number}`,
      reply: `Opened ${p.number} as Claude: ${p.title}. Checks ${allGreen ? "passed" : "need attention"}. ${impact?.headline ?? ""} A tax reviewer has to approve it; I cannot.`,
      spoken: `I opened ${p.number}: ${p.title}. I replayed the books: ${impact?.headline ?? "no impact result"} ${allGreen ? "All three checks passed." : "Some checks failed."} It now needs a tax reviewer. I can't approve it myself.`,
    });
  }

  // 4. Run the checks / what is the impact.
  if (/\b(check|checks|impact|replay|how much|what would|what does it move)\b/.test(t)) {
    const number = await resolveNumber(t, contextNumber);
    if (!number) return done({ action: "checks", reply: "There is no open change request to check." });
    const { impact, checks } = await runChecks(number, claude());
    const failed = checks.filter((c) => c.conclusion !== "success").map((c) => c.name);
    return done({ action: "checks", number, navigate: `/changes/${number}`, reply: `${number}: ${checks.map((c) => `${c.name} ${c.conclusion}`).join(", ")}. ${impact?.headline ?? ""}`, spoken: `${impact?.headline ?? ""} ${failed.length ? `These checks failed: ${failed.join(", ")}.` : "All three checks passed."}` });
  }

  // 5. Are the books balanced?
  if (/\b(balanced|balance|trial balance|books)\b/.test(t)) {
    const r = await prisma.$queryRaw<{ d: bigint; c: bigint; n: bigint }[]>`SELECT COALESCE(SUM("debitMinor"),0)::bigint AS d, COALESCE(SUM("creditMinor"),0)::bigint AS c, COUNT(DISTINCT "entryNumber")::bigint AS n FROM "JournalLine"`;
    const d = Number(r[0].d), c = Number(r[0].c);
    const fmt = (m: number) => `EUR ${(m / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return done({ action: "books", navigate: "/trial-balance", reply: d === c ? `Balanced: ${Number(r[0].n)} entries, debits ${fmt(d)} equal credits ${fmt(c)}.` : `Not balanced: debits ${fmt(d)}, credits ${fmt(c)}.` });
  }

  // 6. Is the audit trail intact?
  if (/\b(audit|chain|tamper|evidence)\b/.test(t)) {
    const v = await verifyChain();
    return done({ action: "audit", navigate: "/audit", reply: v.ok ? `The audit chain verifies: ${v.rows} rows, every row hashes the one before it.` : `The audit chain is broken at row ${v.brokenAt}.` });
  }

  return done({ action: "help", reply: "I can propose a tax change, replay its impact, explain a change request, check the books or the audit chain, or try to merge. Try: raise Sale VAT to 16 percent from October first." });
}
