import React, { useState } from 'react';
import { BakeryOrder, Customer } from '../types';
import { formatPLN } from '../utils/formatters';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Flame,
  Truck,
  Plus,
  ArrowRight,
  FileText,
} from 'lucide-react';

interface OrdersViewProps {
  orders: BakeryOrder[];
  customers: Customer[];
  onConvertOrderToInvoice: (order: BakeryOrder) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: BakeryOrder['status']) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  customers,
  onConvertOrderToInvoice,
  onUpdateOrderStatus,
}) => {
  const [filter, setFilter] = useState<string>('Wszystkie');

  const filteredOrders = orders.filter((o) => {
    if (filter === 'Wszystkie') return true;
    return o.status === filter;
  });

  const getStatusBadge = (status: BakeryOrder['status']) => {
    switch (status) {
      case 'Nowe':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            <Clock className="w-3 h-3" />
            Nowe
          </span>
        );
      case 'W piecu':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
            <Flame className="w-3 h-3 text-amber-600" />
            W piecu
          </span>
        );
      case 'Skompletowane':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <CheckCircle className="w-3 h-3" />
            Skompletowane
          </span>
        );
      case 'W dostawie':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Truck className="w-3 h-3" />
            W dostawie
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            Zrealizowane
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
              Zamówienia dzienne na pieczywo
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full tabular-nums">
              {orders.length} zamówień
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Zlecenia wypieku i dostaw dla odbiorców hurtowych z opcją 1-kliknięcia do faktury
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-4">
          {/* Status filters */}
          <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-apple-sm flex items-center gap-1 overflow-x-auto text-xs font-medium">
            {['Wszystkie', 'Nowe', 'W piecu', 'Skompletowane', 'W dostawie'].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                  filter === st
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Orders list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-apple-sm hover:shadow-apple-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-slate-400">
                        Dostawa: {order.deliveryTime}
                      </span>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="mb-3">
                    <span className="text-xs font-bold text-slate-800 block">
                      {order.customerName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      NIP: {order.customerNip}
                    </span>
                  </div>

                  {/* Order items stack */}
                  <div className="bg-slate-50/70 rounded-2xl p-3 border border-slate-100 space-y-1.5 text-xs mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-slate-700">
                          {item.productName} <strong className="text-slate-900 font-bold">× {item.quantity} {item.unit}</strong>
                        </span>
                        <span className="text-slate-600 font-medium tabular-nums">
                          {formatPLN(item.quantity * item.unitPriceGross)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">
                      Wartość zamówienia
                    </span>
                    <span className="text-base font-bold text-indigo-700 tabular-nums">
                      {formatPLN(order.totalGross)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status === 'W piecu' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'Skompletowane')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                      >
                        Oznacz jako skompletowane
                      </button>
                    )}

                    <button
                      onClick={() => onConvertOrderToInvoice(order)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Wystaw fakturę
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
