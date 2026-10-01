import React, { useState } from 'react';
import { CompanySettings } from '../types';
import { Save, Building, CreditCard, FileText, Check } from 'lucide-react';

interface SettingsViewProps {
  settings: CompanySettings;
  onSaveSettings: (settings: CompanySettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<CompanySettings>(settings);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
      {/* Header */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Ustawienia firmy i fakturowania
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dane sprzedawcy, numer rachunku bankowego oraz seria numeracji faktur piekarni
          </p>
        </div>

        {saved && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <Check className="w-4 h-4 text-emerald-600" />
            Zapisano zmiany!
          </span>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dane Sprzedawcy */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-apple-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <Building className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Dane identyfikacyjne piekarni (Sprzedawca na fakturze)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Nazwa skrócona
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full py-2.5 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-indigo-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Pełna nazwa rejestrowa spółki *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullCompanyName}
                    onChange={(e) => setFormData({ ...formData, fullCompanyName: e.target.value })}
                    className="w-full py-2.5 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-indigo-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    NIP sprzedawcy *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    className="w-full py-2.5 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-indigo-600 outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    REGON / BDO
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="REGON"
                      value={formData.regon}
                      onChange={(e) => setFormData({ ...formData, regon: e.target.value })}
                      className="w-full py-2.5 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-indigo-600 outline-hidden"
                    />
                    <input
                      type="text"
                      placeholder="BDO"
                      value={formData.bdo}
                      onChange={(e) => setFormData({ ...formData, bdo: e.target.value })}
                      className="w-full py-2.5 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-indigo-600 outline-hidden"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-medium mb-1">
                      Adres siedziby / piekarni
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full py-2.5 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-indigo-600 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Kod i Miasto
                    </label>
                    <input
                      type="text"
                      value={`${formData.postalCode} ${formData.city}`}
                      onChange={(e) => {
                        const parts = e.target.value.split(' ');
                        setFormData({
                          ...formData,
                          postalCode: parts[0] || '',
                          city: parts.slice(1).join(' ') || '',
                        });
                      }}
                      className="w-full py-2.5 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-indigo-600 outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Rachunek Bankowy */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-apple-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Rachunek bankowy do przelewów z faktur
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-medium mb-1">
                    Numer rachunku IBAN *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                    className="w-full py-2.5 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-indigo-600 outline-hidden font-mono font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Nazwa banku
                  </label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full py-2.5 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-indigo-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    E-mail do powiadomień
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full py-2.5 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-indigo-600 outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Numeracja faktur */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-apple-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Wzorzec numeracji faktur
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Prefiks faktury
                  </label>
                  <input
                    type="text"
                    value={formData.invoicePrefix}
                    onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                    className="w-full py-2.5 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-indigo-600 outline-hidden font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-medium mb-1">
                    Podgląd formatu numeru faktury
                  </label>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-indigo-700 font-bold">
                    {formData.invoicePrefix}/{formData.currentYear}/09/{formData.nextInvoiceIndex}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-2xl shadow-apple-float transition duration-150 active:scale-95 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Zapisz ustawienia</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
