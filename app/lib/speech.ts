/** Turn a written answer into something worth listening to: no markdown, currencies and ids read as words. */
const CURRENCIES: Record<string, [string, string]> = { EUR: ["euro", "euros"], USD: ["US dollar", "US dollars"], GBP: ["pound", "pounds"], JPY: ["yen", "yen"] };
const MONEY = new RegExp(`(-?)\\b(${Object.keys(CURRENCIES).join("|")})\\s?(\\d{1,3}(?:,\\d{3})*(?:\\.\\d+)?|\\d+(?:\\.\\d+)?)\\b`, "g");

export function speakable(text: string, maxChars = 480): string {
  let out = text ?? "";
  out = out.replace(/```[\s\S]*?```/g, " ").replace(/`([^`]*)`/g, "$1").replace(/\*\*|__/g, "").replace(/^\s*[-*+]\s+/gm, "").replace(/^#{1,6}\s*/gm, "");
  out = out.replace(MONEY, (_m, sign: string, code: string, amount: string) => {
    const [one, many] = CURRENCIES[code];
    const trimmed = amount.endsWith(".00") ? amount.slice(0, -3) : amount;
    return `${sign ? "minus " : ""}${trimmed} ${trimmed.replace(/,/g, "") === "1" ? one : many}`;
  });
  out = out.replace(/(\d)\s?%/g, "$1 percent");
  out = out.replace(/\bCR-0*(\d+)\b/g, "change request $1");
  out = out.replace(/\bSOD-0*(\d+)\b/g, "S O D $1");
  out = out.replace(/\b(INV|SINV)\/(\d{4})\/0*(\d+)\b/g, (_m, kind: string, _y: string, n: string) => `${kind === "SINV" ? "supplier invoice" : "invoice"} ${n}`);
  out = out.replace(/\b0\.(\d{2})\b/g, (_m, d: string) => `${Number(d)} percent`);
  out = out.replace(/\s+/g, " ").trim();
  if (out.length <= maxChars) return out;
  const cut = out.slice(0, maxChars);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  return end > 80 ? cut.slice(0, end + 1) : cut.replace(/\s+\S*$/, "") + ".";
}
