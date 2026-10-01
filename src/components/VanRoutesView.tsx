import React, { useState } from 'react';
import { DeliveryRoute } from '../types';
import { Truck, CheckCircle2, Clock, MapPin, Package, User } from 'lucide-react';

interface VanRoutesViewProps {
  routes: DeliveryRoute[];
  onToggleStop: (routeId: string, stopId: string) => void;
}

export const VanRoutesView: React.FC<VanRoutesViewProps> = ({
  routes,
  onToggleStop,
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0]?.id || '');
  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
      {/* Header */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Trasy Vana - Dostawy poranne pieczywa
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full">
              3 vany w terenie
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Zarządzaj trasami kierowców, punktami rozładunku i skrzynkami ze świeżym pieczywem
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Route selector cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {routes.map((route) => {
              const completedCount = route.stops.filter((s) => s.completed).length;
              const totalStops = route.stops.length;
              const percent = Math.round((completedCount / totalStops) * 100);
              const isSelected = route.id === activeRoute.id;

              return (
                <div
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`p-5 rounded-3xl border transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-indigo-600 shadow-apple-md'
                      : 'bg-white/70 border-slate-200/70 hover:border-indigo-200 hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                        <Truck className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        Wyjazd: {route.departureTime}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 leading-tight">
                      {route.name}
                    </h4>

                    <div className="mt-3 space-y-1 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Kierowca: <strong className="text-slate-700">{route.driverName}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-slate-400" />
                        <span>{route.vehicle}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-400">Postęp doręczeń:</span>
                      <span className="font-bold text-indigo-700 tabular-nums">
                        {completedCount}/{totalStops} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Route Stops Manifest */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-apple-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Karta drogowa: {activeRoute.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Kierowca: {activeRoute.driverName} • Pojazd: {activeRoute.vehicle}
                </p>
              </div>

              <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-xl">
                {activeRoute.stops.length} punktów dostawy
              </span>
            </div>

            {/* Stops list */}
            <div className="space-y-3">
              {activeRoute.stops.map((stop, index) => (
                <div
                  key={stop.id}
                  className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
                    stop.completed
                      ? 'bg-slate-50/60 border-slate-200/60 opacity-80'
                      : 'bg-white border-slate-200 hover:border-indigo-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        stop.completed
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {stop.customerName}
                        </span>
                        {stop.completed && (
                          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
                            Dostarczono
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {stop.address}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-700 font-medium">
                          <Package className="w-3.5 h-3.5 text-indigo-600" />
                          {stop.cratesCount} skrzynek pieczywa
                        </span>
                      </div>

                      {stop.notes && (
                        <p className="text-[11px] text-amber-600 mt-1 italic">
                          Uwagi kierowcy: {stop.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleStop(activeRoute.id, stop.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                      stop.completed
                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {stop.completed ? 'Cofnij potwierdzenie' : 'Potwierdź rozładunek'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
