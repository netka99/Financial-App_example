import React from 'react';
import { Customer, Invoice, BakeryOrder, DeliveryRoute } from '../types';
import { calculateTotals, formatPLN } from '../utils/formatters';
import {
  TrendingUp,
  ShoppingBag,
  AlertCircle,
  Truck,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  FileText,
  Flame,
} from 'lucide-react';

interface DashboardViewProps {
  invoices: Invoice[];
  orders: BakeryOrder[];
  routes: DeliveryRoute[];
  customers: Customer[];
  onNavigateTab: (tab: any) => void;
  onOpenNewInvoice: () => void;
  onPreviewInvoice: (invoice: Invoice) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  invoices,
  orders,
  routes,
  customers,
  onNavigateTab,
  onOpenNewInvoice,
  onPreviewInvoice,
}) => {
  // Compute dashboard metrics
  const totalSalesToday = invoices.reduce((sum, inv) => {
    const { totalGross } = calculateTotals(inv.items);
    return sum + totalGross;
  }, 0);

  const unpaidInvoices = invoices.filter(
    (inv) => inv.status === 'Wystawiona' || inv.status === 'Przeterminowana'
  );
  const unpaidTotal = unpaidInvoices.reduce((sum, inv) => {
    const { totalGross } = calculateTotals(inv.items);
    return sum + totalGross;
  }, 0);

  const activeRoutes = routes.filter((r) => r.status === 'W trasie');
  const activeOrders = orders.filter((o) => o.status !== 'Zrealizowane');

  // Weekly sales dummy data for the clean chart
  const weeklyData = [
    { day: 'Pon', amount: 3820, height: 60 },
    { day: 'Wt', amount: 4190, height: 70 },
    { day: 'Śr', amount: 4650, height: 80 },
    { day: 'Czw', amount: 5120, height: 90 },
    { day: 'Pt', amount: 6200, height: 100 },
    { day: 'Sob', amount: 5800, height: 92 },
    { day: 'Niedz', amount: 2400, height: 40 },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
      {/* Header */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Pulpit zarządzania piekarnią
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Poranny raport sprzedaży, wypieków i dostaw pieczywa • 24 wrz 2026
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('zamowienia')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
          >
            Zamówienia ({activeOrders.length})
          </button>
          <button
            onClick={onOpenNewInvoice}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-semibold shadow-apple-float transition duration-150 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Wystaw fakturę</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top Status Banner */}
          <div className="bg-linear-to-r from-indigo-900 via-indigo-800 to-indigo-950 rounded-3xl p-6 text-white shadow-apple-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                  Poranny wypiek i ekspedycja pieczywa
                </span>
              </div>
              <h3 className="text-xl font-bold">
                Wypieczono 2 450 szt. pieczywa. 2 vany realizują dostawy w Krakowie.
              </h3>
              <p className="text-xs text-indigo-200">
                Wszystkie zamówienia dla stałych odbiorców zostały przygotowane do fakturowania.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigateTab('trasy')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition flex items-center gap-1.5"
              >
                <Truck className="w-4 h-4 text-indigo-300" />
                Śledź trasy vana
              </button>
              <button
                onClick={() => onNavigateTab('nowa-faktura')}
                className="px-4 py-2 rounded-xl bg-white text-indigo-950 text-xs font-bold shadow-sm hover:bg-indigo-50 transition flex items-center gap-1.5"
              >
                Nowa faktura
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-apple-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">
                  Obrót z faktur (Wrzesień)
                </span>
                <TrendingUp className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums">
                {formatPLN(totalSalesToday * 7.5)}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                +14.2% w porównaniu do sierpnia
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-apple-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">
                  Niezapłacone faktury
                </span>
                <AlertCircle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums">
                {formatPLN(unpaidTotal)}
              </div>
              <span className="text-[11px] text-amber-600 font-medium mt-1 block">
                {unpaidInvoices.length} faktury oczekują na przelew
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-apple-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">
                  Zamówienia na dziś
                </span>
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums">
                {orders.length} zamówień
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                W tym 1 gotowe do zafakturowania
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-apple-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">
                  Trasy dostawcze vana
                </span>
                <Truck className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums">
                {activeRoutes.length} w trasie
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                21 punktów dostaw porannych
              </span>
            </div>
          </div>

          {/* Middle Section: Chart & Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Chart */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-apple-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Dzienny obrót piekarni (ostatnie 7 dni)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Wartości brutto sprzedaży pieczywa i wyrobów cukierniczych
                  </p>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-xl">
                  Średnia: 4 600 zł / dzień
                </span>
              </div>

              {/* Bar Graph */}
              <div className="pt-6 pb-2">
                <div className="flex items-end justify-between gap-3 h-44 px-2">
                  {weeklyData.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition tabular-nums">
                        {item.amount} zł
                      </span>
                      <div className="w-full bg-slate-100 rounded-xl h-36 flex items-end p-1">
                        <div
                          style={{ height: `${item.height}%` }}
                          className={`w-full rounded-lg transition-all duration-300 ${
                            item.day === 'Czw'
                              ? 'bg-indigo-600 shadow-xs'
                              : 'bg-indigo-200 group-hover:bg-indigo-400'
                          }`}
                        ></div>
                      </div>
                      <span className="text-xs font-semibold text-slate-600">
                        {item.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions & Status */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-apple-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Szybkie operacje</h3>

              <div className="space-y-2.5">
                <button
                  onClick={() => onNavigateTab('nowa-faktura')}
                  className="w-full p-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-100 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <div>
                      <span className="font-bold text-xs block">Ręczna nowa faktura</span>
                      <span className="text-[11px] text-indigo-700">Wystaw fakturę dla kontrahenta</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition" />
                </button>

                <button
                  onClick={() => onNavigateTab('gotowkowa')}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-100 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Flame className="w-5 h-5 text-amber-600" />
                    <div>
                      <span className="font-bold text-xs block">Sprzedaż gotówkowa (Kasa)</span>
                      <span className="text-[11px] text-slate-500">Szybki paragon lub faktura uproszczona</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
                </button>

                <button
                  onClick={() => onNavigateTab('trasy')}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-100 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <div>
                      <span className="font-bold text-xs block">Karty drogowe kierowców</span>
                      <span className="text-[11px] text-slate-500">Rozlicz skrzynki i dowody WZ</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Stały kontrahent dnia
                </span>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">{customers[0]?.name}</span>
                    <span className="text-slate-400 text-[11px]">{customers[0]?.city}</span>
                  </div>
                  <button
                    onClick={() => onNavigateTab('nowa-faktura')}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Fakturuj →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Table: Recent Invoices */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-apple-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Ostatnio wystawione dokumenty
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Najnowsze faktury VAT zarejestrowane w systemie piekarni
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('faktury')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                Zobacz wszystkie faktury ({invoices.length})
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {invoices.slice(0, 4).map((inv) => {
                const totals = calculateTotals(inv.items);
                return (
                  <div
                    key={inv.id}
                    className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/50 rounded-xl px-2 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                        FV
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">
                            {inv.number}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {inv.issueDate}
                          </span>
                        </div>
                        <span className="text-xs text-slate-600 block">
                          {inv.customer.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900 tabular-nums block">
                          {formatPLN(totals.totalGross)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {inv.status}
                        </span>
                      </div>
                      <button
                        onClick={() => onPreviewInvoice(inv)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-xl transition"
                      >
                        Podgląd
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
