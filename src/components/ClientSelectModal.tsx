import React, { useState } from 'react';
import { Customer, PaymentMethod, PaymentTerms } from '../types';
import { X, Search, Plus, Building2, Check, ArrowRight } from 'lucide-react';

interface ClientSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Customer[];
  selectedCustomerId: string;
  onSelectCustomer: (customer: Customer) => void;
  onAddCustomer: (newCustomer: Customer) => void;
}

export const ClientSelectModal: React.FC<ClientSelectModalProps> = ({
  isOpen,
  onClose,
  clients,
  selectedCustomerId,
  onSelectCustomer,
  onAddCustomer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New client form state
  const [newName, setNewName] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newNip, setNewNip] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('Kraków');
  const [newPostalCode, setNewPostalCode] = useState('30-001');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPriceList, setNewPriceList] = useState('Indywidualny (Piekarnia)');
  const [newPaymentMethod, setNewPaymentMethod] = useState<PaymentMethod>('Przelew bankowy');
  const [newPaymentTerm, setNewPaymentTerm] = useState<PaymentTerms>('Termin: 14 dni');

  if (!isOpen) return null;

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.nip.includes(searchTerm) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newNip.trim()) return;

    const customer: Customer = {
      id: `cust-${Date.now()}`,
      name: newName.trim(),
      companyName: newCompanyName.trim() || newName.trim(),
      nip: newNip.replace(/\D/g, ''),
      address: newAddress.trim() || 'ul. Floriańska 1',
      city: newCity.trim(),
      postalCode: newPostalCode.trim(),
      email: newEmail.trim() || 'biuro@klient.pl',
      phone: newPhone.trim() || '+48 600 000 000',
      defaultPriceList: newPriceList,
      statusBadge: 'Nowy odbiorca',
      defaultPaymentMethod: newPaymentMethod,
      defaultPaymentTerm: newPaymentTerm,
      currentBalance: 0,
    };

    onAddCustomer(customer);
    onSelectCustomer(customer);
    setIsAddingNew(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-apple-md border border-slate-100 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isAddingNew ? 'Dodaj nowego klienta' : 'Wybierz klienta do faktury'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAddingNew
                ? 'Wprowadź dane kontrahenta lub pobierz z bazy GUS'
                : 'Wybierz stałego odbiorcę pieczywa lub dodaj nowego'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-4 flex items-center justify-between gap-3">
          {!isAddingNew ? (
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Szukaj po nazwisku, nazwie firmy lub NIP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600 outline-hidden transition"
                autoFocus
              />
            </div>
          ) : (
            <button
              onClick={() => setIsAddingNew(false)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              ← Wróć do listy klientów
            </button>
          )}

          {!isAddingNew && (
            <button
              onClick={() => setIsAddingNew(true)}
              className="px-3.5 py-2 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Nowy klient
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
          {isAddingNew ? (
            <form onSubmit={handleAddNewSubmit} className="space-y-4 text-xs">
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-semibold text-indigo-900 block">Szybkie uzupełnienie z bazy GUS</span>
                  <span className="text-[11px] text-indigo-700">Wpisz NIP, a system automatycznie pobierze nazwę i adres</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (newNip.replace(/\D/g, '').length >= 10) {
                      setNewName('Piekarnia & Bistro Pod Wawelem');
                      setNewCompanyName('Pod Wawelem Sp. z o.o.');
                      setNewAddress('ul. Stradomska 11');
                      setNewCity('Kraków');
                      setNewPostalCode('31-068');
                    } else {
                      setNewNip('6762589012');
                      setNewName('Piekarnia & Bistro Pod Wawelem');
                      setNewCompanyName('Pod Wawelem Sp. z o.o.');
                      setNewAddress('ul. Stradomska 11');
                      setNewCity('Kraków');
                      setNewPostalCode('31-068');
                    }
                  }}
                  className="px-3 py-1.5 bg-indigo-600 text-white font-medium rounded-xl shadow-xs hover:bg-indigo-700 transition"
                >
                  Pobierz z GUS
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">NIP kontrahenta *</label>
                  <input
                    type="text"
                    required
                    placeholder="np. 9481234567"
                    value={newNip}
                    onChange={(e) => setNewNip(e.target.value)}
                    className="w-full py-2 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-indigo-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Nazwa wyświetlana *</label>
                  <input
                    type="text"
                    required
                    placeholder="np. Anna Nowak lub Sklep ABC"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full py-2 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-indigo-600 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Pełna nazwa firmy (do faktury)</label>
                <input
                  type="text"
                  placeholder="np. Sklep Spożywczo-Monopolowy Anna Nowak"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-indigo-600 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-medium mb-1">Ulica i numer</label>
                  <input
                    type="text"
                    placeholder="np. ul. Floriańska 12/4"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full py-2 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-indigo-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Kod i Miasto</label>
                  <input
                    type="text"
                    placeholder="31-021 Kraków"
                    value={`${newPostalCode} ${newCity}`}
                    onChange={(e) => {
                      const parts = e.target.value.split(' ');
                      setNewPostalCode(parts[0] || '30-001');
                      setNewCity(parts.slice(1).join(' ') || 'Kraków');
                    }}
                    className="w-full py-2 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-indigo-600 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Domyślny cennik</label>
                  <select
                    value={newPriceList}
                    onChange={(e) => setNewPriceList(e.target.value)}
                    className="w-full py-2 px-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800"
                  >
                    <option>Indywidualny (Piekarnia)</option>
                    <option>Cennik Hurtowy B2B</option>
                    <option>Standardowy Detal/Hurt</option>
                    <option>Gastronomia VIP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Płatność</label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full py-2 px-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800"
                  >
                    <option>Przelew bankowy</option>
                    <option>Gotówka przy odbiorze</option>
                    <option>Karta płatnicza</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Termin płatności</label>
                  <select
                    value={newPaymentTerm}
                    onChange={(e) => setNewPaymentTerm(e.target.value as PaymentTerms)}
                    className="w-full py-2 px-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800"
                  >
                    <option>Termin: 7 dni</option>
                    <option>Termin: 14 dni</option>
                    <option>Termin: 21 dni</option>
                    <option>Płatne natychmiast</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Zapisz i wybierz do faktury
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              {filteredClients.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Nie znaleziono kontrahenta dla zapytania "{searchTerm}".
                </div>
              ) : (
                filteredClients.map((client) => {
                  const isSelected = client.id === selectedCustomerId;
                  return (
                    <div
                      key={client.id}
                      onClick={() => {
                        onSelectCustomer(client);
                        onClose();
                      }}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-apple-sm'
                          : 'border-slate-200/80 bg-white hover:border-indigo-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-indigo-50 border border-indigo-100 text-indigo-600'
                          }`}
                        >
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-900 truncate">
                              {client.name}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                              {client.statusBadge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">
                            NIP: {client.nip} • {client.city}, {client.address}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                            <span>Cennik: <strong className="text-slate-600 font-medium">{client.defaultPriceList}</strong></span>
                            <span>•</span>
                            <span>{client.defaultPaymentTerm}</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {isSelected ? (
                          <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-100/70 px-3 py-1.5 rounded-xl">
                            <Check className="w-3.5 h-3.5" />
                            Wybrany
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="text-xs font-medium text-slate-500 hover:text-indigo-600 p-2 rounded-xl hover:bg-slate-100 transition flex items-center gap-1"
                          >
                            Wybierz
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
