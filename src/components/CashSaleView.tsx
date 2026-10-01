import React, { useState } from 'react';
import { BakeryProduct, Invoice, Customer } from '../types';
import { formatPLN, formatNumberPL } from '../utils/formatters';
import {
  Banknote,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Printer,
  CreditCard,
  RotateCcw,
} from 'lucide-react';

interface CashSaleViewProps {
  products: BakeryProduct[];
  defaultCustomer: Customer;
  onCompleteSale: (invoice: Invoice) => void;
}

export const CashSaleView: React.FC<CashSaleViewProps> = ({
  products,
  defaultCustomer,
  onCompleteSale,
}) => {
  const [basket, setBasket] = useState<{ product: BakeryProduct; quantity: number }[]>([
    { product: products[0], quantity: 2 }, // Bagietka
    { product: products[1], quantity: 5 }, // Bułka pszenna
  ]);
  const [cashGiven, setCashGiven] = useState<number>(20);
  const [paymentType, setPaymentType] = useState<'gotowka' | 'karta' | 'blik'>('gotowka');
  const [saleCompleted, setSaleCompleted] = useState(false);

  const addToBasket = (product: BakeryProduct) => {
    setBasket((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setBasket((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { product: BakeryProduct; quantity: number }[]
    );
  };

  const removeFromBasket = (productId: string) => {
    setBasket((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearBasket = () => {
    setBasket([]);
  };

  const totalGross = basket.reduce(
    (sum, item) => sum + item.quantity * item.product.defaultGrossPrice,
    0
  );
  const changeDue = Math.max(0, cashGiven - totalGross);

  const handleFinalize = () => {
    if (basket.length === 0) return;

    const newInvoice: Invoice = {
      id: `inv-cash-${Date.now()}`,
      number: `FV-GOT/2026/09/${Math.floor(100 + Math.random() * 900)}`,
      type: 'krajowa',
      issueDate: '2026-09-24',
      saleDate: '2026-09-24',
      dueDate: '2026-09-24',
      customerId: defaultCustomer.id,
      customer: {
        ...defaultCustomer,
        name: 'Sprzedaż gotówkowa (Odbiorca detaliczny / hurt)',
      },
      items: basket.map((b, idx) => ({
        id: `item-cash-${idx}`,
        productId: b.product.id,
        name: b.product.name,
        sku: b.product.sku,
        initialLetter: b.product.initialLetter,
        quantity: b.quantity,
        unit: b.product.unit,
        unitPriceGross: b.product.defaultGrossPrice,
        vatRate: b.product.defaultVatRate,
      })),
      paymentMethod:
        paymentType === 'gotowka'
          ? 'Gotówka przy odbiorze'
          : paymentType === 'karta'
          ? 'Karta płatnicza'
          : 'BLIK',
      paymentTerm: 'Płatne natychmiast',
      status: 'Opłacona',
      paidAmount: totalGross,
      createdAt: new Date().toISOString(),
    };

    onCompleteSale(newInvoice);
    setSaleCompleted(true);
    setTimeout(() => {
      setSaleCompleted(false);
      clearBasket();
    }, 2500);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
      {/* Header */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Sprzedaż gotówkowa / Kasa ekspedycji
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full">
              Kasa aktywna
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Szybkie wydawanie pieczywa z odbiorem osobistym i wystawianie faktur uproszczonych
          </p>
        </div>

        <button
          onClick={clearBasket}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Wyczyść koszyk
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="max-w-6xl mx-auto h-full grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Product Touch Grid */}
          <div className="lg:col-span-7 flex flex-col h-full overflow-hidden bg-white rounded-3xl p-5 border border-slate-100 shadow-apple-sm">
            <div className="mb-4">
              <h3 className="font-bold text-sm text-slate-900">
                Wybierz produkt z lady (dotknij lub kliknij)
              </h3>
              <p className="text-xs text-slate-400">
                Ceny brutto wg standardowego cennika ekspedycji piekarni
              </p>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 gap-3 custom-scrollbar">
              {products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addToBasket(p)}
                  className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-indigo-50/60 hover:border-indigo-300 hover:shadow-apple-sm transition duration-150 text-left flex flex-col justify-between group active:scale-95"
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
                      {p.initialLetter}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {p.stock} szt.
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-tight">
                      {p.name}
                    </h4>
                    <span className="text-xs font-bold text-indigo-700 block mt-1.5 tabular-nums">
                      {formatPLN(p.defaultGrossPrice)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Active Counter Register */}
          <div className="lg:col-span-5 flex flex-col h-full bg-white rounded-3xl p-6 border border-slate-100 shadow-apple-sm justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h3 className="font-bold text-sm text-slate-900">
                  Paragon / Rachunek bieżący
                </h3>
                <span className="text-xs text-slate-400">
                  {basket.length} pozycji
                </span>
              </div>

              {/* Basket list */}
              <div className="max-h-64 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {basket.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    Koszyk jest pusty. Dotknij produktu po lewej, aby dodać.
                  </div>
                ) : (
                  basket.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 block truncate">
                          {item.product.name}
                        </span>
                        <span className="text-[11px] text-slate-400 tabular-nums">
                          {formatPLN(item.product.defaultGrossPrice)} / {item.product.unit}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="w-6 h-6 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-bold text-slate-900 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="w-6 h-6 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-bold text-slate-900 w-16 text-right tabular-nums">
                          {formatPLN(item.quantity * item.product.defaultGrossPrice)}
                        </span>

                        <button
                          onClick={() => removeFromBasket(item.product.id)}
                          className="text-slate-300 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Total calculation & Payment form */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Wartość zamówienia:</span>
                  <span className="font-bold text-lg text-slate-900 tabular-nums">
                    {formatPLN(totalGross)}
                  </span>
                </div>

                {paymentType === 'gotowka' && (
                  <div className="flex justify-between items-center text-slate-500 pt-1">
                    <span>Otrzymano gotówkę:</span>
                    <input
                      type="number"
                      value={cashGiven}
                      onChange={(e) => setCashGiven(parseFloat(e.target.value) || 0)}
                      className="w-24 text-right py-1 px-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 tabular-nums"
                    />
                  </div>
                )}

                {paymentType === 'gotowka' && (
                  <div className="flex justify-between items-center text-emerald-700 font-semibold pt-1">
                    <span>Reszta do wydania:</span>
                    <span className="text-base tabular-nums">
                      {formatPLN(changeDue)}
                    </span>
                  </div>
                )}
              </div>

              {/* Payment selector */}
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPaymentType('gotowka')}
                  className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition ${
                    paymentType === 'gotowka'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5" />
                  Gotówka
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType('karta')}
                  className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition ${
                    paymentType === 'karta'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Karta
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType('blik')}
                  className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition ${
                    paymentType === 'blik'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  BLIK
                </button>
              </div>

              {/* Complete sale button */}
              <button
                onClick={handleFinalize}
                disabled={basket.length === 0 || saleCompleted}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl text-xs tracking-wide shadow-apple-float transition duration-150 active:scale-95 flex items-center justify-center gap-2"
              >
                {saleCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    Wydrukowano i rozliczono!
                  </>
                ) : (
                  <>
                    <Printer className="w-4 h-4" />
                    Rozlicz i wystaw dokument ({formatPLN(totalGross)})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
