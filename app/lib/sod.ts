/** Principals and segregation-of-duties rules (from the reference process_definitions: SOD-02, SOD-01, SOD-03). */
export interface Principal {
  id: string;
  kind: "human" | "agent" | "system";
  displayName: string;
  title: string;
  roles: string[];
  color: string;
}

export const PRINCIPALS: Principal[] = [
  { id: "tam.tran", kind: "human", displayName: "Tam Tran", title: "Tax Technology Engineer", roles: ["tax_technology", "tax_reviewer", "tax_analyst"], color: "#0f766e" },
  { id: "priya.raman", kind: "human", displayName: "Priya Raman", title: "Senior Manager, Tax", roles: ["tax_reviewer", "tax_analyst"], color: "#b45309" },
  { id: "daniel.okafor", kind: "human", displayName: "Daniel Okafor", title: "Controller", roles: ["controller", "ap_approver", "gl_accountant"], color: "#7c3aed" },
  { id: "maya.chen", kind: "human", displayName: "Maya Chen", title: "Accounts Payable Specialist", roles: ["ap_clerk"], color: "#2563eb" },
  { id: "sam.lee", kind: "human", displayName: "Sam Lee", title: "Revenue Accountant", roles: ["ar_clerk", "gl_accountant"], color: "#be185d" },
  { id: "claude", kind: "agent", displayName: "Claude", title: "Finance assistant (AI agent)", roles: ["agent:assistant"], color: "#d97757" },
  { id: "system", kind: "system", displayName: "myERP", title: "System", roles: ["system"], color: "#475569" },
];

export function findPrincipal(id: string | null | undefined): Principal | undefined {
  return PRINCIPALS.find((p) => p.id === id);
}

export interface SodSubject { number: string; openedBy: string; touchesTax: boolean }
export interface SodDecision { allowed: boolean; ruleId?: string; ruleName?: string; message?: string }

/** Evaluated in this order; the first rule that denies explains the refusal. */
export function authorizeApproval(actor: Principal, subject: SodSubject): SodDecision {
  if (actor.kind === "agent") {
    return {
      allowed: false, ruleId: "SOD-02", ruleName: "Agents propose, humans decide",
      message: `${actor.displayName} is an AI agent. Agents may capture, match, determine tax and run assurance checks; approving and posting belong to a person or to the system after a person approves.`,
    };
  }
  if (actor.id === subject.openedBy) {
    return { allowed: false, ruleId: "SOD-01", ruleName: "The preparer cannot approve", message: `${actor.displayName} prepared ${subject.number}. Segregation of duties requires a different approver.` };
  }
  if (subject.touchesTax && !actor.roles.includes("tax_reviewer")) {
    return { allowed: false, ruleId: "SOD-03", ruleName: "Tax changes need a tax reviewer", message: `${subject.number} changes tax configuration. Approval needs the tax_reviewer role, which ${actor.displayName} does not have.` };
  }
  return { allowed: true };
}
