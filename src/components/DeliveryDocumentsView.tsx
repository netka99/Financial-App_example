import React from 'react';
import { DeliveryDocumentWZ } from '../types';
import { FileCheck2, Printer, Plus, Search, Truck } from 'lucide-react';

interface DeliveryDocumentsViewProps {
  documents: DeliveryDocumentWZ[];
  onOpenNewInvoiceForWZ?: (wz: DeliveryDocumentWZ) => void;
}

export const DeliveryDocumentsView: React.FC<DeliveryDocumentsViewProps> = ({
  documents,
}) => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
      {/* Header */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Dokumenty dostawy (WZ - Wydanie Zewnętrzne)
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full tabular-nums">
              {documents.length} dokumentów
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Ewidencja wydań magazynowych pieczywa z piekarni do punktów odbiorczych
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-apple-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-3.5 px-6">Numer WZ</th>
                    <th className="py-3.5 px-4">Data wystawienia</th>
                    <th className="py-3.5 px-4">Kontrahent (Odbiorca)</th>
                    <th className="py-3.5 px-4">Kierowca / Van</th>
                    <th className="py-3.5 px-4 text-center">Pozycje</th>
                    <th className="py-3.5 px-4 text-right">Waga pieczywa</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-6 text-right">Powiązana faktura</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {doc.number}
                      </td>
                      <td className="py-4 px-4 text-slate-600 font-medium">
                        {doc.date}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-slate-800 block">
                          {doc.customerName}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          NIP: {doc.nip}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        {doc.driverName}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-slate-800">
                        {doc.itemsCount}
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-slate-700">
                        {doc.totalWeightKg.toFixed(2)} kg
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {doc.relatedInvoiceNumber ? (
                          <span className="font-mono text-indigo-700 font-bold bg-indigo-50 px-2 py-1 rounded-md text-[11px]">
                            {doc.relatedInvoiceNumber}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Do zafakturowania</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
