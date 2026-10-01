import { InvoiceItem, VatRate } from '../types';

export function parseVatPercentage(rate: VatRate): number {
  if (rate === '23%') return 23;
  if (rate === '8%') return 8;
  if (rate === '5%') return 5;
  return 0; // 0% and zw.
}

export function formatPLN(amount: number): string {
  if (isNaN(amount)) return '0,00 zł';
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumberPL(amount: number): string {
  if (isNaN(amount)) return '0,00';
  return amount.toFixed(2).replace('.', ',');
}

export function parseNumberPL(input: string): number {
  if (!input) return 0;
  const clean = input.replace(/\s+/g, '').replace('zł', '').replace(',', '.');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

export interface TaxCalculationResult {
  totalNet: number;
  totalVat: number;
  totalGross: number;
  vatBreakdown: Record<string, { net: number; vat: number; gross: number }>;
}

export function calculateTotals(items: InvoiceItem[]): TaxCalculationResult {
  let totalNet = 0;
  let totalGross = 0;

  const vatBreakdown: Record<string, { net: number; vat: number; gross: number }> = {
    '5%': { net: 0, vat: 0, gross: 0 },
    '8%': { net: 0, vat: 0, gross: 0 },
    '23%': { net: 0, vat: 0, gross: 0 },
    '0%': { net: 0, vat: 0, gross: 0 },
  };

  items.forEach((item) => {
    const gross = (item.quantity || 0) * (item.unitPriceGross || 0);
    const ratePercent = parseVatPercentage(item.vatRate);
    const net = gross / (1 + ratePercent / 100);
    const vat = gross - net;

    totalGross += gross;
    totalNet += net;

    const rateKey = item.vatRate;
    if (!vatBreakdown[rateKey]) {
      vatBreakdown[rateKey] = { net: 0, vat: 0, gross: 0 };
    }
    vatBreakdown[rateKey].net += net;
    vatBreakdown[rateKey].vat += vat;
    vatBreakdown[rateKey].gross += gross;
  });

  const totalVat = totalGross - totalNet;

  return {
    totalNet: Math.round(totalNet * 100) / 100,
    totalVat: Math.round(totalVat * 100) / 100,
    totalGross: Math.round(totalGross * 100) / 100,
    vatBreakdown,
  };
}

export function calculateItemRow(item: InvoiceItem): { net: number; gross: number; vat: number } {
  const gross = (item.quantity || 0) * (item.unitPriceGross || 0);
  const ratePercent = parseVatPercentage(item.vatRate);
  const net = gross / (1 + ratePercent / 100);
  const vat = gross - net;

  return {
    gross: Math.round(gross * 100) / 100,
    net: Math.round(net * 100) / 100,
    vat: Math.round(vat * 100) / 100,
  };
}
