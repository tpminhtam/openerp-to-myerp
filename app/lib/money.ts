/** Money is integer minor units. Rates are decimal strings scaled to parts per million so no float ever touches tax. */

export const RATE_SCALE = 1_000_000n;

/** "0.15" -> 150000n (parts per million). Throws on anything that is not a plain decimal. */
export function rateToPpm(rate: string): bigint {
  const m = /^(-?)(\d+)(?:\.(\d+))?$/.exec(rate.trim());
  if (!m) throw new Error(`Not a decimal rate: ${rate}`);
  const [, sign, whole, frac = ""] = m;
  const fracPadded = (frac + "000000").slice(0, 6);
  if (frac.length > 6) throw new Error(`Rate has more than 6 decimals: ${rate}`);
  const ppm = BigInt(whole) * RATE_SCALE + BigInt(fracPadded);
  return sign === "-" ? -ppm : ppm;
}

/** round half away from zero, as Python 2.7's round() did. */
export function divRoundHalfUp(numerator: bigint, denominator: bigint): bigint {
  if (denominator === 0n) throw new Error("division by zero");
  const negative = (numerator < 0n) !== (denominator < 0n);
  const n = numerator < 0n ? -numerator : numerator;
  const d = denominator < 0n ? -denominator : denominator;
  const q = n / d;
  const r = n % d;
  const rounded = r * 2n >= d ? q + 1n : q;
  return negative ? -rounded : rounded;
}

/** minor × ppm / 1e6, half-up. */
export function applyRate(minor: bigint, ppm: bigint): bigint {
  return divRoundHalfUp(minor * ppm, RATE_SCALE);
}

export function formatMoney(minor: number | bigint, currency: string): string {
  const decimals = currency === "JPY" ? 0 : 2;
  const n = BigInt(minor);
  const negative = n < 0n;
  const abs = negative ? -n : n;
  const scale = 10n ** BigInt(decimals);
  const whole = (abs / scale).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const frac = decimals ? "." + (abs % scale).toString().padStart(decimals, "0") : "";
  return `${negative ? "-" : ""}${currency} ${whole}${frac}`;
}

export function formatRate(rate: string): string {
  const ppm = rateToPpm(rate);
  const pct = Number(ppm) / 10_000; // percent with up to 4 decimals
  return `${pct.toFixed(pct % 1 === 0 ? 0 : 2)}%`;
}
