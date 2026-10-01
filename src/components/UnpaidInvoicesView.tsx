import React, { useState } from 'react';
import { Invoice } from '../types';
import { calculateTotals, formatPLN } from '../utils/formatters';
import {
  AlertCircle,
  Clock,
  CheckCircle,
  Mail,
  Phone,
  Printer,
  Calendar,
  Send,
} from 'lucide-react';

interface UnpaidInvoicesViewProps {
  invoices: Invoice[];
  onMarkPaid: (invoiceId: string) => void;
  onPreviewInvoice: (invoice: Invoice) => void;
}

export const UnpaidInvoicesView: React.FC<UnpaidInvoicesViewProps> = ({
  invoices,
  onMarkPaid,
  onPreviewInvoice,
}) => {
  const [reminderModalInvoice, setReminderModalInvoice] = useState<Invoice | null>(null);
  const [reminderSent, setReminderSent] = useState(false);

  const unpaidList = invoices.filter(
    (inv) => inv.status === 'Wystawiona' || inv.status === 'Przeterminowana'
  );

  const totalOutstanding = unpaidList.reduce((sum, inv) => {
    const { totalGross } = calculateTotals(inv.items);
    return sum + totalGross;
  }, 0);

  const handleSendReminder = () => {
    setReminderSent(true);
    setTimeout(() => {
      setReminderSent(false);
      setReminderModalInvoice(null);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
      {/* Header */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Niezapłacone faktury i należności
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full tabular-nums">
              {unpaidList.length} oczekujących
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoruj spłaty za dostarczone pieczywo i wysyłaj uprzejme monity płatnicze
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block font-normal">
            Łączna kwota do zapłaty:
          </span>
          <span className="text-xl font-bold text-amber-600 tabular-nums">
            {formatPLN(totalOutstanding)}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unpaidList.length === 0 ? (
              <div className="col-span-2 bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-apple-sm">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="font-bold text-base text-slate-900">
                  Wszystkie faktury są uregulowane!
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Brak przeterminowanych lub oczekujących płatności od kontrahentów.
                </p>
              </div>
            ) : (
              unpaidList.map((inv) => {
                const totals = calculateTotals(inv.items);
                const isOverdue = inv.status === 'Przeterminowana';
                return (
                  <div
                    key={inv.id}
                    className={`bg-white rounded-3xl p-6 border shadow-apple-sm hover:shadow-apple-md transition flex flex-col justify-between ${
                      isOverdue ? 'border-rose-200/80' : 'border-slate-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-slate-900">
                            {inv.number}
                          </span>
                          <span className="text-xs text-slate-400">
                            Wystawiono: {inv.issueDate}
                          </span>
                        </div>
                        {isOverdue ? (
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                            Przeterminowana
                          </span>
                        ) : (
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                            W terminie
                          </span>
                        )}
                      </div>

                      <div className="mb-4">
                        <h4 className="font-bold text-sm text-slate-900">
                          {inv.customer.name}
                        </h4>
                        <p className="text-xs text-slate-500">
                          NIP: {inv.customer.nip} • {inv.customer.address}, {inv.customer.city}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {inv.customer.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {inv.customer.email}
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Termin płatności:</span>
                          <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {inv.dueDate}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 block text-[11px]">Do zapłaty:</span>
                          <span className="font-bold text-base text-slate-900 tabular-nums">
                            {formatPLN(totals.totalGross)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onPreviewInvoice(inv)}
                        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
                        title="Drukuj fakturę"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setReminderModalInvoice(inv)}
                          className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Wyślij monit SMS/Mail
                        </button>

                        <button
                          onClick={() => onMarkPaid(inv.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Zarejestruj wpłatę
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Reminder prompt modal */}
      {reminderModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-apple-md border border-slate-100 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                Wyślij przypomnienie o płatności
              </h3>
              <button
                onClick={() => setReminderModalInvoice(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Odbiorca:</label>
                <div className="font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {reminderModalInvoice.customer.name} ({reminderModalInvoice.customer.phone} / {reminderModalInvoice.customer.email})
                </div>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Treść wiadomości (SMS / E-mail):</label>
                <textarea
                  readOnly
                  rows={4}
                  value={`Dzień dobry, uprzejmie przypominamy o uregulowaniu faktury ${reminderModalInvoice.number} na kwotę ${formatPLN(calculateTotals(reminderModalInvoice.items).totalGross)} z terminem płatności ${reminderModalInvoice.dueDate}. Dane do przelewu: Santander Bank 42 1090 1665 0000 0001 4488 9912. Piekarnia Złoty Bochen.`}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-mono text-[11px] outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setReminderModalInvoice(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
              >
                Anuluj
              </button>
              <button
                onClick={handleSendReminder}
                disabled={reminderSent}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
              >
                {reminderSent ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-300" />
                    Wysłano pomyślnie!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Wyślij powiadomienie
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
