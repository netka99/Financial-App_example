import React from 'react';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  FileText,
  AlertCircle,
  Banknote,
  Truck,
  FileCheck2,
  History,
  Settings,
  X
} from 'lucide-react';

export type NavigationTab = 
  | 'pulpit'
  | 'klienci'
  | 'zamowienia'
  | 'faktury'
  | 'nowa-faktura'
  | 'niezaplacone'
  | 'gotowkowa'
  | 'trasy'
  | 'dokumenty-dostawy'
  | 'historia'
  | 'ustawienia';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  unpaidCount?: number;
  ordersCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
  unpaidCount = 1,
  ordersCount = 3,
}) => {
  // If currentTab is 'nowa-faktura', highlight 'faktury' tab as in the screenshot
  const isTabActive = (tab: NavigationTab) => {
    if (tab === 'faktury' && currentTab === 'nowa-faktura') return true;
    return currentTab === tab;
  };

  const navItemClass = (active: boolean) =>
    active
      ? 'flex items-center justify-between px-3 py-2 text-white bg-indigo-600 rounded-xl font-medium shadow-sm transition'
      : 'flex items-center justify-between px-3 py-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition';

  const iconClass = (active: boolean) =>
    active ? 'w-4 h-4 mr-3 text-white' : 'w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-600';

  const handleNavClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 flex flex-col shrink-0 select-none transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        data-purpose="main-sidebar"
      >
        {/* Brand header */}
        <div className="px-6 py-6 border-b border-slate-50 flex items-center justify-between">
          <div 
            className="cursor-pointer" 
            onClick={() => handleNavClick('pulpit')}
          >
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              <span>MojeSaldoo</span>
            </h1>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Firma Piekarnia</p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50"
              title="System aktywny - synchronizacja z bazą piekarni"
            />
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              aria-label="Zamknij menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-5 space-y-6 overflow-y-auto custom-scrollbar text-[13px] font-medium">
          {/* Section: Ogólne */}
          <div>
            <button
              type="button"
              onClick={() => handleNavClick('pulpit')}
              className={`w-full ${navItemClass(isTabActive('pulpit'))}`}
            >
              <div className="flex items-center">
                <LayoutDashboard className={iconClass(isTabActive('pulpit'))} />
                Pulpit
              </div>
            </button>
          </div>

          {/* Section: Sprzedaż */}
          <div>
            <span className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Sprzedaż
            </span>
            <div className="mt-2 space-y-1">
              <button
                type="button"
                onClick={() => handleNavClick('klienci')}
                className={`w-full ${navItemClass(isTabActive('klienci'))}`}
              >
                <div className="flex items-center">
                  <Users className={iconClass(isTabActive('klienci'))} />
                  Klienci
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('zamowienia')}
                className={`w-full ${navItemClass(isTabActive('zamowienia'))}`}
              >
                <div className="flex items-center">
                  <ShoppingBag className={iconClass(isTabActive('zamowienia'))} />
                  Zamówienia
                </div>
                {ordersCount > 0 && !isTabActive('zamowienia') && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                    {ordersCount}
                  </span>
                )}
              </button>

              {/* Active Tab: Faktury */}
              <button
                type="button"
                onClick={() => handleNavClick('faktury')}
                className={`w-full ${navItemClass(isTabActive('faktury'))}`}
              >
                <div className="flex items-center">
                  <FileText className={iconClass(isTabActive('faktury'))} />
                  Faktury
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('niezaplacone')}
                className={`w-full ${navItemClass(isTabActive('niezaplacone'))}`}
              >
                <div className="flex items-center">
                  <AlertCircle className={iconClass(isTabActive('niezaplacone'))} />
                  Niezapłacone faktury
                </div>
                {unpaidCount > 0 && !isTabActive('niezaplacone') && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    {unpaidCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('gotowkowa')}
                className={`w-full ${navItemClass(isTabActive('gotowkowa'))}`}
              >
                <div className="flex items-center">
                  <Banknote className={iconClass(isTabActive('gotowkowa'))} />
                  Sprzedaż gotówkowa
                </div>
              </button>
            </div>
          </div>

          {/* Section: Dostawa */}
          <div>
            <span className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Dostawa
            </span>
            <div className="mt-2 space-y-1">
              <button
                type="button"
                onClick={() => handleNavClick('trasy')}
                className={`w-full ${navItemClass(isTabActive('trasy'))}`}
              >
                <div className="flex items-center">
                  <Truck className={iconClass(isTabActive('trasy'))} />
                  Trasy Vana
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Trasy aktywne"></span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('dokumenty-dostawy')}
                className={`w-full ${navItemClass(isTabActive('dokumenty-dostawy'))}`}
              >
                <div className="flex items-center">
                  <FileCheck2 className={iconClass(isTabActive('dokumenty-dostawy'))} />
                  Dokumenty dostawy
                </div>
              </button>
            </div>
          </div>

          {/* Section: System */}
          <div>
            <span className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              System
            </span>
            <div className="mt-2 space-y-1">
              <button
                type="button"
                onClick={() => handleNavClick('historia')}
                className={`w-full ${navItemClass(isTabActive('historia'))}`}
              >
                <div className="flex items-center">
                  <History className={iconClass(isTabActive('historia'))} />
                  Historia aktywności
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('ustawienia')}
                className={`w-full ${navItemClass(isTabActive('ustawienia'))}`}
              >
                <div className="flex items-center">
                  <Settings className={iconClass(isTabActive('ustawienia'))} />
                  Ustawienia
                </div>
              </button>
            </div>
          </div>
        </nav>

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
          <span>Piekarnia v2.4</span>
          <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            Online
          </span>
        </div>
      </aside>
    </>
  );
};
