import React, { useState } from 'react';
import {
  Customer,
  BakeryProduct,
  InvoiceItem,
  InvoiceType,
  PaymentMethod,
  PaymentTerms,
  VatRate,
  Invoice,
} from '../types';
import { calculateTotals, calculateItemRow, formatNumberPL } from '../utils/formatters';
import { kwotaSlownie } from '../utils/numberToWordsPl';
import { ProductPickerModal } from './ProductPickerModal';
import {
  ArrowLeft,
  ChevronRight,
  Plus,
  Trash2,
  Search,
  Building2,
  ArrowRight,
  Check,
} from 'lucide-react';

interface NowaFakturaProps {
  customers: Customer[];
  products: BakeryProduct[];
  onBack: () => void;
  onSaveInvoice: (invoice: Invoice, isDraft: boolean) => void;
  onOpenClientModal: () => void;
  selectedCustomer: Customer;
  onOpenProductPicker?: () => void;
}

export const NowaFaktura: React.FC<NowaFakturaProps> = ({
  products,
  onBack,
  onSaveInvoice,
  onOpenClientModal,
  selectedCustomer,
}) => {
  const [invoiceType, setInvoiceType] = useState<InvoiceType>('krajowa');
  const [issueDate, setIssueDate] = useState<string>('2026-09-24');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    selectedCustomer.defaultPaymentMethod || 'Przelew bankowy'
  );
  const [paymentTerm, setPaymentTerm] = useState<PaymentTerms>(
    selectedCustomer.defaultPaymentTerm || 'Termin: 14 dni'
  );
  const [notes, setNotes] = useState<string>('Numer zamówienia klienta: ZAM/2026/09/88');
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);

  // Initial items exactly as in reference image:
  // 1: Bagietka, 1 szt, 3,00 zł, 5%
  // 2: Bułka pszenna 100g, 10 szt, 0,68 zł, 5%
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 'item-ref-1',
      productId: 'prod-1',
      name: 'Bagietka',
      sku: 'PIEK-001',
      initialLetter: 'B',
      badge: 'cena indyw.',
      stock: 45,
      quantity: 1,
      unit: 'szt.',
      unitPriceGross: 3.00,
      vatRate: '5%',
    },
    {
      id: 'item-ref-2',
      productId: 'prod-2',
      name: 'Bułka pszenna 100g',
      sku: 'PIEK-004',
      initialLetter: 'B',
      stock: 65,
      quantity: 10,
      unit: 'szt.',
      unitPriceGross: 0.68,
      vatRate: '5%',
    },
  ]);

  // Quick search input state
  const [quickSearch, setQuickSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Stepper handlers
  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, (item.quantity || 1) + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handleQuantityInput = (id: string, value: string) => {
    const val = parseInt(value, 10);
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: isNaN(val) ? 1 : Math.max(1, val) };
        }
        return item;
      })
    );
  };

  const handlePriceInput = (id: string, value: string) => {
    const clean = value.replace(',', '.').replace(/[^\d.]/g, '');
    const num = parseFloat(clean);
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, unitPriceGross: isNaN(num) ? 0 : num };
        }
        return item;
      })
    );
  };

  const handleUnitChange = (id: string, unit: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unit } : item))
    );
  };

  const handleVatChange = (id: string, vatRate: VatRate) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, vatRate } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = (itemData: Omit<InvoiceItem, 'id'>) => {
    const newItem: InvoiceItem = {
      ...itemData,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setItems((prev) => [...prev, newItem]);
    showToast(`Dodano "${itemData.name}" do faktury`);
  };

  const addProductFromQuickSearch = (prod: BakeryProduct) => {
    handleAddItem({
      productId: prod.id,
      name: prod.name,
      sku: prod.sku,
      initialLetter: prod.initialLetter || prod.name.charAt(0).toUpperCase(),
      badge: prod.badge,
      stock: prod.stock,
      quantity: 1,
      unit: prod.unit,
      unitPriceGross: prod.defaultGrossPrice,
      vatRate: prod.defaultVatRate,
    });
    setQuickSearch('');
    setIsDropdownOpen(false);
  };

  // Autocomplete products
  const searchResults = quickSearch.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(quickSearch.toLowerCase()) ||
          p.sku.toLowerCase().includes(quickSearch.toLowerCase())
      )
    : [];

  // Totals calculations
  const totals = calculateTotals(items);
  const wordsAmount = kwotaSlownie(totals.totalGross);

  // Formatting date for display: "24 wrz 2026"
  const formatDisplayDate = (dStr: string) => {
    try {
      const date = new Date(dStr);
      return date.toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dStr;
    }
  };

  const handleIssueInvoice = (isDraft: boolean = false) => {
    if (items.length === 0) {
      showToast('Dodaj przynajmniej jedną pozycję do faktury.');
      return;
    }

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      number: `FV/2026/09/${Math.floor(145 + Math.random() * 50)}`,
      type: invoiceType,
      issueDate,
      saleDate: issueDate,
      dueDate: '2026-10-08',
      customerId: selectedCustomer.id,
      customer: selectedCustomer,
      items,
      paymentMethod,
      paymentTerm,
      notes,
      status: isDraft ? 'Szkic' : 'Wystawiona',
      paidAmount: isDraft ? 0 : 0,
      createdAt: new Date().toISOString(),
    };

    onSaveInvoice(newInvoice, isDraft);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header / App Bar with Apple-like frosted glass styling */}
      <header
        className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20"
        data-purpose="content-header"
      >
        <div className="flex items-center gap-4">
          {/* Back button (Soft round circle matching screenshot) */}
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition active:scale-95"
            title="Wróć"
            type="button"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Ręcznie - Nowa Faktura
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
                Szkic
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              Klient powiązany:{' '}
              <span className="font-medium text-slate-700">
                {selectedCustomer.name}
              </span>
            </p>
          </div>
        </div>

        {/* Action & View Pill Controls */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-100/80 p-1 rounded-2xl flex items-center space-x-1 text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setInvoiceType('krajowa')}
              className={`px-3 py-1.5 rounded-xl transition ${
                invoiceType === 'krajowa'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Krajowa
            </button>
            <button
              type="button"
              onClick={() => setInvoiceType('wewnatrzwspolnotowa')}
              className={`px-3 py-1.5 rounded-xl transition ${
                invoiceType === 'wewnatrzwspolnotowa'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Wewnątrzwspólnotowa
            </button>
          </div>

          <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          <div className="text-right text-xs hidden sm:block">
            <span className="text-slate-400 block text-[11px]">Data wystawienia</span>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-transparent border-none p-0 cursor-pointer text-right focus:ring-0"
              title="Zmień datę wystawienia"
            />
          </div>
        </div>
      </header>

      {/* Scrollable Workspace Container */}
      <div
        className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 space-y-6 custom-scrollbar"
        data-purpose="form-container"
      >
        <div className="max-w-5xl mx-auto space-y-6 pb-12">
          {/* BEGIN: ClientSelectionSection */}
          <section
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-apple-sm transition hover:shadow-apple-md"
            data-purpose="client-selection-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Klient
              </h3>
              <button
                onClick={onOpenClientModal}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group cursor-pointer"
                type="button"
              >
                Zmień klienta
                <ChevronRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/70 rounded-2xl border border-slate-100 gap-4">
              <div className="flex items-center gap-4">
                {/* Rounded pill avatar */}
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-base text-slate-900">
                      {selectedCustomer.name}
                    </h4>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {selectedCustomer.statusBadge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    NIP: {selectedCustomer.nip} • {selectedCustomer.city}, {selectedCustomer.address} • Płatność: {selectedCustomer.defaultPaymentTerm}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-slate-400 block font-normal">
                  Cennik domyślny
                </span>
                <span className="text-xs font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 inline-block mt-0.5">
                  {selectedCustomer.defaultPriceList}
                </span>
              </div>
            </div>
          </section>
          {/* END: ClientSelectionSection */}

          {/* BEGIN: InvoiceItemsSection */}
          <section
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-apple-sm"
            data-purpose="invoice-line-items"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Pozycje faktury
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Produkty dodane na podstawie cennika piekarni
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full tabular-nums">
                {items.length} {items.length === 1 ? 'pozycja' : items.length < 5 ? 'pozycje' : 'pozycji'}
              </span>
            </div>

            {/* Items List Stack */}
            <div className="space-y-3" id="invoice-items-list">
              {items.map((item) => {
                const row = calculateItemRow(item);
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200/70 hover:border-indigo-200 hover:shadow-apple-sm transition duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    {/* Item details with initial badge */}
                    <div className="flex items-center gap-3.5 min-w-[260px] flex-1">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-lg shrink-0">
                        {item.initialLetter || item.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-800 text-sm">
                            {item.name}
                          </span>
                          {item.badge && (
                            <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          SKU: {item.sku}
                          {item.stock !== undefined ? ` • Magazyn: ${item.stock} ${item.unit}` : ''}
                        </p>
                      </div>
                    </div>

                    {/* Controls Group: Quantity, Unit, Price, Tax, Subtotal */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
                      {/* Apple-like Stepper */}
                      <div className="flex items-center bg-slate-50 border border-slate-200/80 rounded-2xl p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-xs font-bold transition active:scale-90 text-sm"
                          type="button"
                          title="Zmniejsz ilość"
                        >
                          −
                        </button>
                        <input
                          className="w-12 text-center bg-transparent border-0 font-bold text-sm text-slate-900 focus:ring-0 p-0 tabular-nums"
                          min="1"
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityInput(item.id, e.target.value)}
                        />
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-xs font-bold transition active:scale-90 text-sm"
                          type="button"
                          title="Zwiększ ilość"
                        >
                          +
                        </button>
                      </div>

                      {/* Unit of measure */}
                      <div className="w-20">
                        <select
                          value={item.unit}
                          onChange={(e) => handleUnitChange(item.id, e.target.value)}
                          className="w-full text-xs font-medium border-slate-200 rounded-xl bg-slate-50/50 py-2 px-2.5 text-slate-700 focus:border-indigo-500 focus:ring-indigo-500 cursor-pointer"
                        >
                          <option value="szt.">szt.</option>
                          <option value="kg">kg</option>
                          <option value="opak.">opak.</option>
                          <option value="bochenek">bochenek</option>
                        </select>
                      </div>

                      {/* Unit Price Brutto Input */}
                      <div className="w-28 relative">
                        <input
                          className="w-full text-right text-xs font-semibold border-slate-200 rounded-xl bg-slate-50/50 py-2 pr-7 pl-2.5 text-slate-800 focus:border-indigo-500 focus:ring-indigo-500 tabular-nums"
                          type="text"
                          value={formatNumberPL(item.unitPriceGross)}
                          onChange={(e) => handlePriceInput(item.id, e.target.value)}
                        />
                        <span className="absolute right-2.5 top-2 text-xs font-medium text-slate-400 pointer-events-none">
                          zł
                        </span>
                      </div>

                      {/* VAT Selector */}
                      <div className="w-20">
                        <select
                          value={item.vatRate}
                          onChange={(e) => handleVatChange(item.id, e.target.value as VatRate)}
                          className="w-full text-xs font-medium border-slate-200 rounded-xl bg-slate-50/50 py-2 px-2.5 text-slate-700 focus:border-indigo-500 focus:ring-indigo-500 cursor-pointer"
                        >
                          <option value="23%">23%</option>
                          <option value="8%">8%</option>
                          <option value="5%">5%</option>
                          <option value="0%">0%</option>
                          <option value="zw.">zw.</option>
                        </select>
                      </div>

                      {/* Row Total */}
                      <div className="w-28 text-right">
                        <span className="text-sm font-bold text-slate-900 block tabular-nums">
                          {formatNumberPL(row.gross)} zł
                        </span>
                        <span className="text-[11px] text-slate-400 tabular-nums">
                          netto: {formatNumberPL(row.net)} zł
                        </span>
                      </div>

                      {/* Remove row action */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-300 hover:text-red-500 p-1.5 rounded-lg transition"
                        title="Usuń pozycję"
                        type="button"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* New Entry Line (Quick-input and Product Catalog trigger) */}
              <div className="relative">
                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200/90 hover:border-indigo-300 bg-slate-50/40 transition flex flex-col md:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 placeholder-slate-400"
                      placeholder="Szukaj produktu lub kod SKU (np. Chleb wiejski, Bułka grahamka...)"
                      type="text"
                      value={quickSearch}
                      onChange={(e) => {
                        setQuickSearch(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                    />
                  </div>

                  <button
                    onClick={() => setIsCatalogModalOpen(true)}
                    className="w-full md:w-auto px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                    type="button"
                  >
                    <Plus className="w-4 h-4 text-indigo-600" />
                    Dodaj pozycję
                  </button>
                </div>

                {/* Quick search dropdown */}
                {isDropdownOpen && searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-30 max-h-60 overflow-y-auto custom-scrollbar">
                    {searchResults.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => addProductFromQuickSearch(prod)}
                        className="p-2.5 rounded-xl hover:bg-indigo-50/70 flex items-center justify-between cursor-pointer transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                            {prod.initialLetter}
                          </span>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              {prod.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              SKU: {prod.sku} • Magazyn: {prod.stock} {prod.unit}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-800 tabular-nums">
                            {formatNumberPL(prod.defaultGrossPrice)} zł
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            brutto (VAT {prod.defaultVatRate})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
          {/* END: InvoiceItemsSection */}

          {/* BEGIN: AdditionalInvoiceDetails */}
          <section
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            data-purpose="invoice-meta-options"
          >
            {/* Payment and Delivery Details Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-apple-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Płatność i Dostawa
              </h3>
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Metoda płatności
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-full text-xs border-slate-200 rounded-xl bg-slate-50/50 py-2.5 px-3 text-slate-800 focus:border-indigo-500 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="Przelew bankowy">Przelew bankowy</option>
                      <option value="Gotówka przy odbiorze">Gotówka przy odbiorze</option>
                      <option value="Karta płatnicza">Karta płatnicza</option>
                      <option value="BLIK">BLIK</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Termin płatności
                    </label>
                    <select
                      value={paymentTerm}
                      onChange={(e) => setPaymentTerm(e.target.value as PaymentTerms)}
                      className="w-full text-xs border-slate-200 rounded-xl bg-slate-50/50 py-2.5 px-3 text-slate-800 focus:border-indigo-500 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="Termin: 7 dni">Termin: 7 dni</option>
                      <option value="Termin: 14 dni">Termin: 14 dni</option>
                      <option value="Termin: 21 dni">Termin: 21 dni</option>
                      <option value="Termin: 30 dni">Termin: 30 dni</option>
                      <option value="Płatne natychmiast">Płatne natychmiast</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Uwagi na fakturze
                  </label>
                  <input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs border-slate-200 rounded-xl bg-slate-50/50 py-2 px-3 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Np. Numer zamówienia klienta: ZAM/2026/09/88"
                    type="text"
                  />
                </div>
              </div>
            </div>

            {/* Financial Breakdown Summary */}
            <div
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-apple-sm flex flex-col justify-between"
              data-purpose="cost-summary-card"
            >
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Podsumowanie kwot
              </h3>
              <div className="space-y-2.5 text-xs py-2">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Wartość netto</span>
                  <span className="font-medium text-slate-800 tabular-nums">
                    {formatNumberPL(totals.totalNet)} zł
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Stawka VAT 5%</span>
                  <span className="font-medium text-slate-800 tabular-nums">
                    {formatNumberPL(totals.vatBreakdown['5%']?.vat || 0)} zł
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Stawka VAT 23%</span>
                  <span className="font-medium text-slate-800 tabular-nums">
                    {formatNumberPL(totals.vatBreakdown['23%']?.vat || 0)} zł
                  </span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">
                    Do zapłaty (Brutto)
                  </span>
                  <span className="text-2xl font-bold tracking-tight text-indigo-600 tabular-nums">
                    {formatNumberPL(totals.totalGross)} zł
                  </span>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                <span className="capitalize">Słownie: {wordsAmount}</span>
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{' '}
                  Poprawne przeliczenie
                </span>
              </div>
            </div>
          </section>
          {/* END: AdditionalInvoiceDetails */}
        </div>
      </div>

      {/* BEGIN: BottomStickyActionBar */}
      <footer
        className="bg-white/90 backdrop-blur-md border-t border-slate-200/70 px-4 sm:px-8 py-4 shrink-0 flex items-center justify-between z-30"
        data-purpose="action-dock"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition active:scale-95 flex items-center gap-2 cursor-pointer"
            type="button"
          >
            <ArrowLeft className="w-4 h-4" />
            Wstecz
          </button>
          <button
            onClick={() => {
              handleIssueInvoice(true);
              showToast('Zapisano wersję roboczą faktury.');
            }}
            className="px-4 py-2.5 rounded-2xl text-slate-500 hover:text-slate-800 text-xs font-medium transition cursor-pointer"
            type="button"
          >
            Zapisz jako wersję roboczą
          </button>
        </div>

        {/* Right Action Group with Prominent Total and Primary CTA */}
        <div className="flex items-center gap-4">
          {/* Floating summary capsule */}
          <div className="hidden sm:flex items-center bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-2xl">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center mr-2.5 tabular-nums">
              {items.length}
            </span>
            <span className="text-xs font-medium text-slate-600 mr-3">
              Razem pozycje:
            </span>
            <span className="text-sm font-bold text-indigo-700 tabular-nums">
              {formatNumberPL(totals.totalGross)} zł brutto
            </span>
          </div>

          {/* Primary Button */}
          <button
            onClick={() => handleIssueInvoice(false)}
            className="px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs tracking-wide shadow-apple-float transition duration-150 active:scale-95 flex items-center gap-2 cursor-pointer"
            type="button"
          >
            <span>Wystaw fakturę</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
      {/* END: BottomStickyActionBar */}

      {/* Product Catalog Modal */}
      <ProductPickerModal
        isOpen={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
        products={products}
        onAddProduct={handleAddItem}
      />
    </div>
  );
};
