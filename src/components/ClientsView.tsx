import React, { useState } from 'react';
import { Customer } from '../types';
import { formatPLN } from '../utils/formatters';
import {
  Building2,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  FileText,
  BadgeCheck,
} from 'lucide-react';

interface ClientsViewProps {
  customers: Customer[];
  onSelectForInvoice: (customer: Customer) => void;
  onOpenAddModal: () => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  customers,
  onSelectForInvoice,
  onOpenAddModal,
}) => {
  const [search, setSearch] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      c.nip.includes(search) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
      {/* Header */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Klienci i odbiorcy pieczywa
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full tabular-nums">
              {customers.length} kontrahentów
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Baza sklepów, restauracji i cukierni zaopatrywanych przez piekarnię
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-semibold shadow-apple-float transition duration-150 active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Dodaj kontrahenta</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-4">
          {/* Search bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-apple-sm">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Szukaj kontrahenta po nazwie, NIP lub mieście..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 outline-hidden"
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((customer) => (
              <div
                key={customer.id}
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-apple-sm hover:shadow-apple-md hover:border-indigo-200 transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {customer.statusBadge}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {customer.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {customer.companyName}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px] font-medium w-12">NIP:</span>
                      <span className="font-mono font-semibold text-slate-800">{customer.nip}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{customer.address}, {customer.city}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{customer.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                  </div>

                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px]">
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Cennik:</span>
                      <strong className="text-slate-700 font-medium">{customer.defaultPriceList}</strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-500 mt-1">
                      <span>Płatność:</span>
                      <strong className="text-slate-700 font-medium">{customer.defaultPaymentTerm}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-[10px] text-slate-400 block">Należności:</span>
                    <span className={`font-bold tabular-nums ${customer.currentBalance > 0 ? 'text-amber-600' : 'text-slate-700'}`}>
                      {formatPLN(customer.currentBalance)}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectForInvoice(customer)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Wystaw fakturę
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
