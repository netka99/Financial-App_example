import React, { useState } from 'react';
import { Invoice, InvoiceStatus } from '../types';
import { calculateTotals, formatPLN } from '../utils/formatters';
import {
  Search,
  Plus,
  Filter,
  FileText,
  Printer,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileEdit,
  Trash2,
} from 'lucide-react';

interface InvoicesListProps {
  invoices: Invoice[];
  onOpenNewInvoice: () => void;
  onPreviewInvoice: (invoice: Invoice) => void;
  onToggleStatus: (invoiceId: string, newStatus: InvoiceStatus) => void;
  onDeleteInvoice: (invoiceId: string) => void;
}

export const InvoicesList: React.FC<InvoicesListProps> = ({
  invoices,
  onOpenNewInvoice,
  onPreviewInvoice,
  onToggleStatus,
  onDeleteInvoice,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Wszystkie');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer.nip.includes(searchTerm);

    const matchesStatus =
      statusFilter === 'Wszystkie' ||
      (statusFilter === 'Opłacona' && inv.status === 'Opłacona') ||
      (statusFilter === 'Oczekujące' && inv.status === 'Wystawiona') ||
      (statusFilter === 'Przeterminowana' && inv.status === 'Przeterminowana') ||
      (statusFilter === 'Szkic' && inv.status === 'Szkic');

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'Opłacona':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <CheckCircle className="w-3 h-3" />
            Opłacona
          </span>
        );
      case 'Wystawiona':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            <Clock className="w-3 h-3" />
            Oczekuje na wpłatę
          </span>
        );
      case 'Przeterminowana':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
            <AlertTriangle className="w-3 h-3" />
            Po terminie
          </span>
        );
      case 'Szkic':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
            <FileEdit className="w-3 h-3" />
            Szkic roboczy
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
      {/* Header */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Rejestr faktur VAT
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full tabular-nums">
              {invoices.length} wystawionych
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Zarządzaj fakturami sprzedaży pieczywa, sprawdzaj statusy płatności i drukuj dokumenty
          </p>
        </div>

        <button
          onClick={onOpenNewInvoice}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-semibold shadow-apple-float transition duration-150 active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nowa faktura</span>
        </button>
      </header>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-5 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-4">
          {/* Controls bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-apple-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Szukaj po numerze, kontrahencie, NIP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 outline-hidden"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto text-xs font-medium">
              {['Wszystkie', 'Opłacona', 'Oczekujące', 'Przeterminowana', 'Szkic'].map(
                (filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                      statusFilter === filter
                        ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {filter}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Invoices Table Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-apple-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-3.5 px-6">Numer faktury</th>
                    <th className="py-3.5 px-4">Kontrahent (Odbiorca)</th>
                    <th className="py-3.5 px-4">Data wystawienia</th>
                    <th className="py-3.5 px-4">Termin płatności</th>
                    <th className="py-3.5 px-4 text-right">Kwota brutto</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-6 text-right">Akcje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        Nie znaleziono faktur spełniających kryteria.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => {
                      const totals = calculateTotals(inv.items);
                      return (
                        <tr
                          key={inv.id}
                          className="hover:bg-slate-50/60 transition group"
                        >
                          <td className="py-4 px-6">
                            <span className="font-bold text-slate-900 block">
                              {inv.number}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {inv.type === 'krajowa' ? 'Krajowa' : 'Wewnątrzwspólnotowa'}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <span className="font-semibold text-slate-800 block">
                              {inv.customer.name}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              NIP: {inv.customer.nip}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-slate-600 font-medium">
                            {inv.issueDate}
                          </td>

                          <td className="py-4 px-4 text-slate-600">
                            <span>{inv.dueDate}</span>
                            <span className="block text-[11px] text-slate-400">
                              {inv.paymentMethod}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-right">
                            <span className="font-bold text-slate-900 block tabular-nums text-sm">
                              {formatPLN(totals.totalGross)}
                            </span>
                            <span className="text-[11px] text-slate-400 tabular-nums">
                              netto: {formatPLN(totals.totalNet)}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-center">
                            {getStatusBadge(inv.status)}
                          </td>

                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => onPreviewInvoice(inv)}
                                className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                                title="Podgląd / Drukuj fakturę"
                              >
                                <Printer className="w-4 h-4" />
                              </button>

                              {inv.status !== 'Opłacona' && (
                                <button
                                  onClick={() => onToggleStatus(inv.id, 'Opłacona')}
                                  className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition text-[11px] font-semibold"
                                  title="Oznacz jako opłaconą"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}

                              <button
                                onClick={() => onDeleteInvoice(inv.id)}
                                className="p-2 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition"
                                title="Usuń fakturę"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
