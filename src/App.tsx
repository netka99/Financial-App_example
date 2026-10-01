/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  initialCustomers,
  initialProducts,
  initialInvoices,
  initialOrders,
  initialVanRoutes,
  initialDeliveryDocuments,
  initialCompanySettings,
} from './data/mockData';
import {
  Customer,
  BakeryProduct,
  Invoice,
  BakeryOrder,
  DeliveryRoute,
  DeliveryDocumentWZ,
  CompanySettings,
  InvoiceItem,
  InvoiceStatus,
} from './types';
import { Sidebar, NavigationTab } from './components/Sidebar';
import { NowaFaktura } from './components/NowaFaktura';
import { InvoicesList } from './components/InvoicesList';
import { DashboardView } from './components/DashboardView';
import { ClientsView } from './components/ClientsView';
import { OrdersView } from './components/OrdersView';
import { UnpaidInvoicesView } from './components/UnpaidInvoicesView';
import { CashSaleView } from './components/CashSaleView';
import { VanRoutesView } from './components/VanRoutesView';
import { DeliveryDocumentsView } from './components/DeliveryDocumentsView';
import { SettingsView } from './components/SettingsView';
import { ActivityHistoryView } from './components/ActivityHistoryView';
import { ClientSelectModal } from './components/ClientSelectModal';
import { InvoicePrintModal } from './components/InvoicePrintModal';
import { Menu } from 'lucide-react';

export default function App() {
  // Navigation state - default to 'nowa-faktura' matching user's screenshot
  const [currentTab, setCurrentTab] = useState<NavigationTab>('nowa-faktura');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // App data state
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [products, setProducts] = useState<BakeryProduct[]>(initialProducts);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [orders, setOrders] = useState<BakeryOrder[]>(initialOrders);
  const [vanRoutes, setVanRoutes] = useState<DeliveryRoute[]>(initialVanRoutes);
  const [deliveryDocuments, setDeliveryDocuments] = useState<DeliveryDocumentWZ[]>(
    initialDeliveryDocuments
  );
  const [companySettings, setCompanySettings] =
    useState<CompanySettings>(initialCompanySettings);

  // Selected client for invoice creation (defaults to Anna Nowak matching reference)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(initialCustomers[0]);

  // Modals state
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  // Handlers for adding and modifying data
  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
  };

  const handleSaveInvoice = (invoice: Invoice, isDraft: boolean) => {
    setInvoices((prev) => {
      const existsIndex = prev.findIndex((i) => i.id === invoice.id);
      if (existsIndex >= 0) {
        const copy = [...prev];
        copy[existsIndex] = invoice;
        return copy;
      }
      return [invoice, ...prev];
    });

    if (!isDraft) {
      // Open the print / completion preview modal
      setPreviewInvoice(invoice);
    }
  };

  const handleToggleInvoiceStatus = (id: string, newStatus: InvoiceStatus) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: newStatus } : inv))
    );
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  };

  const handleToggleRouteStop = (routeId: string, stopId: string) => {
    setVanRoutes((prev) =>
      prev.map((route) => {
        if (route.id === routeId) {
          return {
            ...route,
            stops: route.stops.map((stop) =>
              stop.id === stopId ? { ...stop, completed: !stop.completed } : stop
            ),
          };
        }
        return route;
      })
    );
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: BakeryOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // Convert an existing order into an invoice
  const handleConvertOrderToInvoice = (order: BakeryOrder) => {
    const cust = customers.find((c) => c.id === order.customerId) || customers[0];
    setSelectedCustomer(cust);
    setCurrentTab('nowa-faktura');
  };

  // Select customer from CRM to issue invoice
  const handleSelectCustomerForInvoice = (cust: Customer) => {
    setSelectedCustomer(cust);
    setCurrentTab('nowa-faktura');
  };

  const unpaidCount = invoices.filter(
    (i) => i.status === 'Wystawiona' || i.status === 'Przeterminowana'
  ).length;

  return (
    <div className="h-full flex overflow-hidden text-slate-800 bg-[#F8FAFC]">
      {/* Mobile top toggle button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="w-10 h-10 rounded-2xl bg-white shadow-apple-md border border-slate-200 flex items-center justify-center text-slate-700"
          aria-label="Otwórz menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Main Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        unpaidCount={unpaidCount}
        ordersCount={orders.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {currentTab === 'nowa-faktura' && (
          <NowaFaktura
            customers={customers}
            products={products}
            selectedCustomer={selectedCustomer}
            onBack={() => setCurrentTab('faktury')}
            onSaveInvoice={handleSaveInvoice}
            onOpenClientModal={() => setIsClientModalOpen(true)}
          />
        )}

        {currentTab === 'faktury' && (
          <InvoicesList
            invoices={invoices}
            onOpenNewInvoice={() => setCurrentTab('nowa-faktura')}
            onPreviewInvoice={(inv) => setPreviewInvoice(inv)}
            onToggleStatus={handleToggleInvoiceStatus}
            onDeleteInvoice={handleDeleteInvoice}
          />
        )}

        {currentTab === 'pulpit' && (
          <DashboardView
            invoices={invoices}
            orders={orders}
            routes={vanRoutes}
            customers={customers}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onOpenNewInvoice={() => setCurrentTab('nowa-faktura')}
            onPreviewInvoice={(inv) => setPreviewInvoice(inv)}
          />
        )}

        {currentTab === 'klienci' && (
          <ClientsView
            customers={customers}
            onSelectForInvoice={handleSelectCustomerForInvoice}
            onOpenAddModal={() => setIsClientModalOpen(true)}
          />
        )}

        {currentTab === 'zamowienia' && (
          <OrdersView
            orders={orders}
            customers={customers}
            onConvertOrderToInvoice={handleConvertOrderToInvoice}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {currentTab === 'niezaplacone' && (
          <UnpaidInvoicesView
            invoices={invoices}
            onMarkPaid={(id) => handleToggleInvoiceStatus(id, 'Opłacona')}
            onPreviewInvoice={(inv) => setPreviewInvoice(inv)}
          />
        )}

        {currentTab === 'gotowkowa' && (
          <CashSaleView
            products={products}
            defaultCustomer={selectedCustomer}
            onCompleteSale={(inv) => {
              setInvoices((prev) => [inv, ...prev]);
              setPreviewInvoice(inv);
            }}
          />
        )}

        {currentTab === 'trasy' && (
          <VanRoutesView
            routes={vanRoutes}
            onToggleStop={handleToggleRouteStop}
          />
        )}

        {currentTab === 'dokumenty-dostawy' && (
          <DeliveryDocumentsView documents={deliveryDocuments} />
        )}

        {currentTab === 'historia' && <ActivityHistoryView />}

        {currentTab === 'ustawienia' && (
          <SettingsView
            settings={companySettings}
            onSaveSettings={(s) => setCompanySettings(s)}
          />
        )}
      </main>

      {/* Client Select / Add Modal */}
      <ClientSelectModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        clients={customers}
        selectedCustomerId={selectedCustomer.id}
        onSelectCustomer={(c) => setSelectedCustomer(c)}
        onAddCustomer={handleAddCustomer}
      />

      {/* Official Polish Invoice Print / Preview Modal */}
      <InvoicePrintModal
        isOpen={!!previewInvoice}
        onClose={() => setPreviewInvoice(null)}
        invoice={previewInvoice}
        companySettings={companySettings}
      />
    </div>
  );
}
