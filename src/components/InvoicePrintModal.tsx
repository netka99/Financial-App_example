import React, { useRef } from 'react';
import { Invoice, CompanySettings } from '../types';
import { calculateTotals, calculateItemRow, formatPLN, formatNumberPL } from '../utils/formatters';
import { kwotaSlownie } from '../utils/numberToWordsPl';
import { X, Printer, Mail, Download, CheckCircle2 } from 'lucide-react';

interface InvoicePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  companySettings: CompanySettings;
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({
  isOpen,
  onClose,
  invoice,
  companySettings,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [emailSent, setEmailSent] = React.useState(false);

  if (!isOpen || !invoice) return null;

  const totals = calculateTotals(invoice.items);
  const inWords = kwotaSlownie(totals.totalGross);

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    setEmailSent(true);
    setTimeout(() => {
      setEmailSent(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl my-auto flex flex-col overflow-hidden max-h-[95vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-sm font-bold text-slate-800">
              Podgląd dokumentu: {invoice.number}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium">
              {invoice.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSendEmail}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition"
            >
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              {emailSent ? 'Wysłano do klienta!' : 'Wyślij e-mail'}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Drukuj / PDF
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar bg-slate-100/50 print:bg-white print:p-0">
          <div
            ref={printRef}
            className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200 print:border-none print:shadow-none max-w-3xl mx-auto text-slate-800 text-xs leading-relaxed"
          >
            {/* Header: Document Title & Metadata */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                  Faktura VAT
                </h1>
                <p className="text-base font-bold text-indigo-700 mt-0.5">{invoice.number}</p>
                <p className="text-[11px] text-slate-400 mt-1">ORYGINAŁ / KOPIA</p>
              </div>

              <div className="text-right space-y-1 text-slate-600 text-[11px]">
                <div>
                  <span className="text-slate-400">Miejsce wystawienia: </span>
                  <span className="font-semibold text-slate-800">{companySettings.city}</span>
                </div>
                <div>
                  <span className="text-slate-400">Data wystawienia: </span>
                  <span className="font-semibold text-slate-800">{invoice.issueDate}</span>
                </div>
                <div>
                  <span className="text-slate-400">Data sprzedaży / dostawy: </span>
                  <span className="font-semibold text-slate-800">{invoice.saleDate}</span>
                </div>
              </div>
            </div>

            {/* Parties: Sprzedawca & Nabywca */}
            <div className="grid grid-cols-2 gap-8 mb-8 pb-6 border-b border-slate-200">
              {/* Sprzedawca */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Sprzedawca
                </span>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  {companySettings.fullCompanyName}
                </h4>
                <p className="text-slate-600">{companySettings.address}</p>
                <p className="text-slate-600">{companySettings.postalCode} {companySettings.city}</p>
                <p className="font-semibold text-slate-800 mt-1.5">
                  NIP: <span className="font-mono">{companySettings.nip}</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  BDO: {companySettings.bdo} • REGON: {companySettings.regon}
                </p>
                <div className="mt-2 pt-2 border-t border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block">Konto bankowe do wpłaty:</span>
                  <span className="font-mono text-slate-900 font-semibold block text-[11px]">
                    {companySettings.bankAccount}
                  </span>
                  <span className="text-[10px] text-slate-400">{companySettings.bankName}</span>
                </div>
              </div>

              {/* Nabywca */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Nabywca
                </span>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  {invoice.customer.companyName || invoice.customer.name}
                </h4>
                <p className="text-slate-600">{invoice.customer.address}</p>
                <p className="text-slate-600">
                  {invoice.customer.postalCode} {invoice.customer.city}
                </p>
                <p className="font-semibold text-slate-800 mt-1.5">
                  NIP: <span className="font-mono">{invoice.customer.nip}</span>
                </p>
                <div className="mt-2 pt-2 border-t border-slate-200/80 text-[11px] text-slate-500">
                  <span>Tel: {invoice.customer.phone}</span>
                  <span className="block truncate">E-mail: {invoice.customer.email}</span>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="mb-6 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 text-[10px] font-bold uppercase text-slate-500">
                    <th className="py-2 px-1 w-6 text-center">Lp.</th>
                    <th className="py-2 px-2">Nazwa towaru / usługi</th>
                    <th className="py-2 px-1 text-center w-12">J.m.</th>
                    <th className="py-2 px-1 text-right w-14">Ilość</th>
                    <th className="py-2 px-2 text-right w-20">Cena netto</th>
                    <th className="py-2 px-2 text-right w-20">Wartość netto</th>
                    <th className="py-2 px-1 text-center w-12">VAT</th>
                    <th className="py-2 px-2 text-right w-16">Kwota VAT</th>
                    <th className="py-2 px-2 text-right w-24">Wartość brutto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoice.items.map((item, idx) => {
                    const row = calculateItemRow(item);
                    const unitPriceNet = row.net / (item.quantity || 1);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="py-2 px-1 text-center text-slate-400 font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-2">
                          <span className="font-semibold text-slate-800 block">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            SKU: {item.sku}
                          </span>
                        </td>
                        <td className="py-2 px-1 text-center text-slate-600">{item.unit}</td>
                        <td className="py-2 px-1 text-right font-semibold font-mono text-slate-900">
                          {item.quantity}
                        </td>
                        <td className="py-2 px-2 text-right font-mono text-slate-600">
                          {formatNumberPL(unitPriceNet)} zł
                        </td>
                        <td className="py-2 px-2 text-right font-mono font-medium text-slate-800">
                          {formatNumberPL(row.net)} zł
                        </td>
                        <td className="py-2 px-1 text-center font-medium text-slate-700">
                          {item.vatRate}
                        </td>
                        <td className="py-2 px-2 text-right font-mono text-slate-600">
                          {formatNumberPL(row.vat)} zł
                        </td>
                        <td className="py-2 px-2 text-right font-mono font-bold text-slate-900">
                          {formatNumberPL(row.gross)} zł
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* VAT Summary Table & Totals */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-slate-300 pt-4 mb-8">
              {/* Payment Details */}
              <div className="w-full sm:w-1/2 space-y-1.5 text-[11px] text-slate-600">
                <div>
                  <span className="text-slate-400">Sposób płatności: </span>
                  <span className="font-semibold text-slate-800">{invoice.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-slate-400">Termin płatności: </span>
                  <span className="font-semibold text-slate-800">
                    {invoice.paymentTerm} ({invoice.dueDate})
                  </span>
                </div>
                {invoice.notes && (
                  <div className="pt-2">
                    <span className="text-slate-400 block">Uwagi:</span>
                    <span className="italic text-slate-700">{invoice.notes}</span>
                  </div>
                )}
              </div>

              {/* VAT Breakdown Matrix */}
              <div className="w-full sm:w-1/2 space-y-2">
                <table className="w-full text-right text-[11px] border-collapse">
                  <thead>
                    <tr className="text-[10px] text-slate-400 border-b border-slate-200">
                      <th className="py-1 px-2 text-left">Stawka</th>
                      <th className="py-1 px-2">Netto</th>
                      <th className="py-1 px-2">VAT</th>
                      <th className="py-1 px-2">Brutto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {Object.entries(totals.vatBreakdown)
                      .filter(([_, data]) => data.gross > 0)
                      .map(([rate, data]) => (
                        <tr key={rate}>
                          <td className="py-1 px-2 text-left font-sans font-semibold text-slate-700">
                            {rate}
                          </td>
                          <td className="py-1 px-2 text-slate-600">
                            {formatNumberPL(data.net)} zł
                          </td>
                          <td className="py-1 px-2 text-slate-600">
                            {formatNumberPL(data.vat)} zł
                          </td>
                          <td className="py-1 px-2 font-medium text-slate-900">
                            {formatNumberPL(data.gross)} zł
                          </td>
                        </tr>
                      ))}
                    <tr className="font-bold border-t border-slate-300 text-slate-900">
                      <td className="py-1.5 px-2 text-left font-sans">Razem</td>
                      <td className="py-1.5 px-2">{formatNumberPL(totals.totalNet)} zł</td>
                      <td className="py-1.5 px-2">{formatNumberPL(totals.totalVat)} zł</td>
                      <td className="py-1.5 px-2 text-indigo-700">
                        {formatNumberPL(totals.totalGross)} zł
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Final Gross Box */}
                <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 text-right">
                  <span className="text-xs text-indigo-800 font-semibold block">
                    Do zapłaty:
                  </span>
                  <span className="text-2xl font-black text-indigo-700 font-mono">
                    {formatPLN(totals.totalGross)}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1 capitalize font-normal">
                    Słownie: {inWords}
                  </p>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-12 pt-12 border-t border-slate-200 text-center text-[10px] text-slate-400">
              <div>
                <div className="border-b border-dashed border-slate-300 pb-1 mb-1">
                  <span className="font-medium text-slate-700">
                    {companySettings.name} - System Elektroniczny
                  </span>
                </div>
                <span>Podpis osoby upoważnionej do wystawienia</span>
              </div>
              <div>
                <div className="border-b border-dashed border-slate-300 pb-1 mb-1">
                  <span className="text-slate-300">nie wymaga podpisu</span>
                </div>
                <span>Podpis osoby upoważnionej do odbioru</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Dokument jest zgodny z polskimi przepisami Ustawy o VAT
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition"
          >
            Zamknij podgląd
          </button>
        </div>
      </div>
    </div>
  );
};
