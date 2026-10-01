import React, { useState } from 'react';
import { BakeryProduct, InvoiceItem } from '../types';
import { X, Search, Plus, Check } from 'lucide-react';
import { formatPLN } from '../utils/formatters';

interface ProductPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: BakeryProduct[];
  onAddProduct: (item: Omit<InvoiceItem, 'id'>) => void;
}

export const ProductPickerModal: React.FC<ProductPickerModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Wszystkie');
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ['Wszystkie', 'Pieczywo codzienne', 'Pieczywo drobne', 'Wyroby cukiernicze', 'Półprodukty'];

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Wszystkie' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePick = (product: BakeryProduct) => {
    onAddProduct({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      initialLetter: product.initialLetter || product.name.charAt(0).toUpperCase(),
      badge: product.badge,
      stock: product.stock,
      quantity: 1,
      unit: product.unit,
      unitPriceGross: product.defaultGrossPrice,
      vatRate: product.defaultVatRate,
    });
    setAddedItemName(product.name);
    setTimeout(() => {
      setAddedItemName(null);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-apple-md border border-slate-100 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Katalog pieczywa i wyrobów piekarni</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Wybierz produkty ze świeżego wypieku lub magazynu do pozycji faktury
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-6 pt-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Szukaj produktu po nazwie lub kodzie SKU (np. Chleb, Bagietka, PIEK-001)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600 outline-hidden transition"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid / list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2.5 custom-scrollbar">
          {addedItemName && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              Dodano "{addedItemName}" do listy pozycji faktury!
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Brak produktów odpowiadających kryteriom wyszukiwania.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-indigo-300 hover:shadow-apple-sm transition flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-base shrink-0">
                      {prod.initialLetter}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {prod.name}
                        </span>
                        {prod.badge && (
                          <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded-md">
                            {prod.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        SKU: {prod.sku} • Magazyn: {prod.stock} {prod.unit}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-slate-800 tabular-nums">
                          {formatPLN(prod.defaultGrossPrice)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          (VAT {prod.defaultVatRate})
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePick(prod)}
                    className="shrink-0 p-2.5 bg-slate-50 group-hover:bg-indigo-600 text-slate-600 group-hover:text-white rounded-xl transition duration-150 flex items-center gap-1 text-xs font-semibold"
                    title="Dodaj pozycję"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Dodaj</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Łącznie dostępnych produktów: {products.length}</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition"
          >
            Gotowe
          </button>
        </div>
      </div>
    </div>
  );
};
