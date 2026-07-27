// Shared formatting + date helpers used across the app.

export const formatNaira = (value: number, withDecimals = true): string =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: withDecimals ? 2 : 0,
    maximumFractionDigits: withDecimals ? 2 : 0,
  }).format(value);

// Amount without the currency symbol (e.g. "4,220,660.60") — pair with your own ₦/NGN label.
export const formatAmount = (value: number, withDecimals = true): string =>
  formatNaira(value, withDecimals).replace(/NGN|₦/g, '').trim();

// Parse a "yyyy-mm-dd" string as a LOCAL date (avoids the UTC-midnight off-by-one).
export const parseISO = (iso: string): Date => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const startOfToday = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

// "6 July 2026"
export const formatDateLong = (iso: string): string =>
  parseISO(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

// "06 Jul 2026"
export const formatDateShort = (iso: string): string =>
  parseISO(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

// Whole days from today until the given date (negative if in the past).
export const daysUntil = (iso: string): number => {
  const diff = parseISO(iso).getTime() - startOfToday().getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
};

// Progress 0..1 of an investment's term, based on today's position between start and maturity.
export const termProgress = (startISO: string, maturityISO: string): number => {
  const start = parseISO(startISO).getTime();
  const end = parseISO(maturityISO).getTime();
  const now = startOfToday().getTime();
  if (now <= start) return 0;
  if (now >= end) return 1;
  return (now - start) / (end - start);
};

// Total value at maturity = principal + simple interest (monthlyRate% * durationMonths).
export const maturityValue = (
  amount: number,
  interestRate: number,
  durationMonths: number,
): number => amount + amount * (interestRate / 100) * durationMonths;

export const totalInterest = (
  amount: number,
  interestRate: number,
  durationMonths: number,
): number => amount * (interestRate / 100) * durationMonths;

// Timestamp string used in the transaction ledger, e.g. "09/07/26 . 02:45 PM".
export const nowLedgerStamp = (): string => {
  const now = new Date();
  const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${date} . ${time}`;
};

// Ledger stamp for a fixed ISO date (used for scheduled payouts).
export const ledgerStampForISO = (iso: string): string => {
  const date = parseISO(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
  return `${date} . 09:00 AM`;
};
