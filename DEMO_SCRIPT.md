# myERP demo script: OpenERP 7.0 → myERP on Opsera Forge

**Live app:** https://myerp-ai.vercel.app · **Repo:** github.com/tpminhtam/openerp-to-myerp · **Length:** 3 minutes (90-second cut at the end)

---

## Five minutes before you go on

1. **Reset the demo data** (Terminal):
   ```bash
   cd ~/Desktop/openerp-to-myerp/app && curl -s -X POST https://myerp-ai.vercel.app/api/admin/reset -H "x-reset-token: $(grep ^RESET_TOKEN= .env | cut -d= -f2)"
   ```
   Every rehearsal creates change requests. After the reset, the first one on stage is **CR-0001**.
2. **Safari tabs, in this order:**
   1. GitHub: `legacy/openerp-7.0/addons/account/account.py`, scrolled to `class account_tax` (the `'amount': fields.float` line)
   2. Forge: the project's Assessment with the ForgeScore radar, and the User Stories board
   3. https://myerp-ai.vercel.app/taxes
3. **Persona:** top right shows **Tam Tran**.
4. **Microphone:** Safari → Settings → Websites → Microphone → myerp-ai.vercel.app → **Allow**. Then click **🎙 Talk to Claude** once so the panel is open.
5. **Sound:** laptop volume at three-quarters, headphones out. If there is a projector mic, test it.
6. **Say the disclosure sentence once out loud** so it comes out easily.

---

## The script

| Time | Screen | Do | Say |
|---|---|---|---|
| **0:00** | GitHub tab: `account.py`, `class account_tax` | Point at `'amount': fields.float` | "This is OpenERP 7, the 2013 version of Odoo, the most-used open-source ERP. In it, a tax rate is a float on a form. Change it and it is live. No history, no review, and no way to know what it does to the invoices you already issued. Tax teams handle that with a spreadsheet and a screenshot." |
| **0:20** | Forge tab: Assessment radar, then the stories board | Scroll the stories briefly | "I gave that code to Opsera Forge. It assessed it, then generated the intent, the PRD, the architecture, sixty-plus user stories, fifty-six test cases and a traceability matrix. I built from those work orders. I built a hand-made reference of this design last week; today I rebuilt it on Forge." |
| **0:35** | myERP → **Taxes** | — | "Same six taxes, but now the table is a commit on a protected branch. Nothing changes in place any more." |
| **0:45** | Voice panel | Click the orange button and say: **"Raise Sale VAT to sixteen percent from October first."** Click again to send. | While it works, about five to ten seconds, keep talking: "Claude turns that into a structured edit, checks it against the configuration, opens a change request as itself, and replays all hundred and twenty invoices through the old rules and the new ones." |
| **~0:58** | Claude speaks, the page jumps to **CR-0001** | Let it finish speaking | *(Claude says: "I opened change request 1… 73 of 120 invoices move by 4,502.70 euros. All three checks passed. It now needs a tax reviewer. I can't approve it myself.")* |
| **1:10** | CR-0001: the voice panel's "Assumed" line, then Diff, Checks, Impact | Point at "Assumed", the diff rows, the headline, then Top movers | "I only said 'Sale VAT'. Claude wrote down what it assumed: the standard rate and its price-included twin, which a person usually forgets, and not the reduced rate. The diff shows both rates and both names. The replay says 73 of 120 invoices move by EUR 4,502.70, and here is who is affected. The reviewer approves a number, not a setup screen." |
| **1:35** | Voice panel | Click and say: **"Explain this change."** | "Every number it's about to say is matched against the replay before it's allowed to be spoken." |
| **~1:45** | Green box with **figures verified before speaking** | Let it speak | *(two sentences)* |
| **1:55** | Voice panel | Click and say: **"Merge it."** | *(Claude says: "I tried to merge change request 1, and the system refused me. Rule S O D 2…")* Then: "That wasn't the model being polite. It called the real merge, and a rule in code refused it. The refusal is stored as evidence." |
| **2:10** | Top right persona → **Tam Tran**, click **Approve as Tam Tran** | Amber box: SOD-01 | "I proposed it, so I can't approve it either." |
| **2:18** | Persona → **Priya Raman**, **Approve**, then **Merge** | Green: "Merged. main is now…" | "Priya is the tax reviewer. She approves, she merges, and the new rate is in force." |
| **2:30** | **History**, then **Audit log** → **Verify** | Point at the ref-log row "merge CR-0001 … priya.raman", then "verified" | "Every move of the configuration is logged forever: who, when, why. The audit log is hash-chained, so any edit to history breaks the chain." |
| **2:45** | Stay on Audit, or go to **Built with Forge** | — | "Before: a float on a form, a spreadsheet, a screenshot. After: every tax change is a pull request against the books. The AI does the prep work and can't approve anything, and the evidence builds itself. Built on Forge, live at myerp-ai dot vercel dot app. Thank you." |

---

## The numbers to know

| What | Value |
|---|---|
| Invoices in the demo | 120 (80 customer, 40 supplier), 110 posted, books balanced to the cent |
| Claude's "Sale VAT to 16%" (changes S15 and S15I) | **73 of 120 invoices move by EUR 4,502.70** |
| The same change on S15 only (Taxes form) | 67 of 120 invoices move by EUR 4,471.70 |
| Replay time | about 10 ms on Vercel |
| Claude's proposal | about 5 to 10 seconds; explanation about 6 seconds |
| Refusals | SOD-02 agent can't approve · SOD-01 proposer can't approve · SOD-03 needs the tax_reviewer role (try Maya Chen) |

---

## If something goes wrong

| Problem | Do this |
|---|---|
| Microphone blocked or room too loud | Type the same sentence in the box under the orange button and press Send. Say nothing about it. |
| No sound | Click **Replay** at the bottom of the panel. The words are on screen anyway. |
| Claude takes too long (over 20 s) | Use the Taxes page's **Propose a change** form: tax S15, field amount, value 0.16. Then **Run checks**. |
| The refusal needs to be shown without voice | On the change request, click **Ask Claude to merge** in the Claude panel. |
| Claude asks a question instead of proposing | Answer it in one sentence ("yes, the standard rate"), or type the demo sentence exactly. |
| A number in the explanation is flagged | Say: "And that's the verifier working. It won't read out a figure it can't match." |
| Something is already merged from a rehearsal | Run the reset command, reload. |

---

## Questions to expect

- **What did Forge do and what did you do?** Forge assessed the legacy code and produced the intent, PRD, architecture, stories, tests and traceability matrix; they're in the repo under `forge/`. The hackathon tenant had no coding agent or API tokens, so I implemented the stories with Claude Code, and each commit cites the work-order ids.
- **Isn't this just Git?** Git versions text and runs tests. This replays the money through the proposed rules, and approvals are governed by segregation-of-duties rules. The review record lives in the system of record, where an auditor looks.
- **Why not do this inside SAP or Workday?** Their transport and migration tools move configuration between environments with no diff, no impact replay and no per-change review. This sits beside the ERP and fronts that process.
- **Isn't the AI the risky part?** It's the constrained part. It can propose and check. It cannot approve or merge, and that is a rule in code that it actually hits, not an instruction in a prompt.
- **What's real and what's demo?** The company and invoices are synthetic, and the rates are demonstration configuration. The rules, the replay, the refusals and the audit chain are real code with tests.

---

## 90-second cut

0:00 OpenERP float on a form (one sentence) → 0:10 Forge built the spec and stories (one sentence) → 0:20 voice: "Raise Sale VAT to sixteen percent from October first", narrate the wait → 0:40 point at the diff and "73 of 120 invoices, EUR 4,502.70" → 0:55 voice: "Merge it", refused → 1:10 Priya approves and merges → 1:20 closing line.
