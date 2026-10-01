import React from 'react';
import { History, FileText, CheckCircle2, Truck, PlusCircle, AlertCircle } from 'lucide-react';

interface ActivityItem {
  id: string;
  time: string;
  user: string;
  action: string;
  category: 'faktura' | 'dostawa' | 'zamowienie' | 'platnosc';
  details: string;
}

export const ActivityHistoryView: React.FC = () => {
  const activities: ActivityItem[] = [
    {
      id: 'act-1',
      time: '24 wrz 2026, 06:30',
      user: 'Tomasz (Kierownik ekspedycji)',
      action: 'Utworzono szkic faktury FV/2026/09/142',
      category: 'faktura',
      details: 'Klient: Anna Nowak • Wartość: 9,80 zł brutto (2 pozycje)',
    },
    {
      id: 'act-2',
      time: '24 wrz 2026, 05:45',
      user: 'Marek Pawlak (Kierowca Van 1)',
      action: 'Potwierdzono rozładunek pieczywa w Cukierni Słodki Zakątek',
      category: 'dostawa',
      details: 'Trasa 1 • Dostarczono 6 skrzynek pieczywa',
    },
    {
      id: 'act-3',
      time: '24 wrz 2026, 05:15',
      user: 'System ekspedycji',
      action: 'Wyjazd Vana 2 na trasę Kurdwanów & Wieliczka',
      category: 'dostawa',
      details: 'Pojazd: Renault Master (KR 4410E) • 11 punktów odbiorczych',
    },
    {
      id: 'act-4',
      time: '23 wrz 2026, 15:20',
      user: 'Księgowość Piekarni',
      action: 'Zarejestrowano wpłatę przelewem dla faktury FV/2026/09/141',
      category: 'platnosc',
      details: 'Kwota: 1 130,00 zł • Odbiorca: Cukiernia Słodki Zakątek',
    },
    {
      id: 'act-5',
      time: '23 wrz 2026, 14:10',
      user: 'Anna (Biuro zamówień)',
      action: 'Wprowadzono zamówienie poranne ZAM/2026/09/88',
      category: 'zamowienie',
      details: 'Odbiorca: Anna Nowak • 1x Bagietka, 10x Bułka pszenna 100g',
    },
  ];

  const getIcon = (cat: ActivityItem['category']) => {
    switch (cat) {
      case 'faktura':
        return <FileText className="w-4 h-4 text-indigo-600" />;
      case 'dostawa':
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'platnosc':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'zamowienie':
      default:
        return <PlusCircle className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
      {/* Header */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Historia aktywności i audyt operacji
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full">
              Dziennik zdarzeń
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Śledź zmiany w wystawionych dokumentach, dostawach i wpłatach
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-apple-sm space-y-4">
            <div className="divide-y divide-slate-100">
              {activities.map((act) => (
                <div key={act.id} className="py-4 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(act.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-xs text-slate-900">
                        {act.action}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {act.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {act.details}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Wykonał: {act.user}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
