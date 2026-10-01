export type InvoiceType = 'krajowa' | 'wewnatrzwspolnotowa';

export type PaymentMethod = 
  | 'Przelew bankowy' 
  | 'Gotówka przy odbiorze' 
  | 'Karta płatnicza' 
  | 'BLIK' 
  | 'Kompensata';

export type PaymentTerms = 
  | 'Płatne natychmiast' 
  | 'Termin: 7 dni' 
  | 'Termin: 14 dni' 
  | 'Termin: 21 dni' 
  | 'Termin: 30 dni';

export type VatRate = '5%' | '8%' | '23%' | '0%' | 'zw.';

export interface Customer {
  id: string;
  name: string;
  companyName: string;
  nip: string;
  address: string;
  city: string;
  postalCode: string;
  email: string;
  phone: string;
  defaultPriceList: string;
  statusBadge: string;
  defaultPaymentMethod: PaymentMethod;
  defaultPaymentTerm: PaymentTerms;
  currentBalance: number;
}

export interface BakeryProduct {
  id: string;
  name: string;
  sku: string;
  unit: string;
  stock: number;
  defaultVatRate: VatRate;
  defaultGrossPrice: number;
  category: 'Pieczywo codzienne' | 'Pieczywo drobne' | 'Wyroby cukiernicze' | 'Półprodukty';
  initialLetter: string;
  badge?: string;
}

export interface InvoiceItem {
  id: string;
  productId?: string;
  name: string;
  sku: string;
  initialLetter: string;
  badge?: string;
  stock?: number;
  quantity: number;
  unit: string;
  unitPriceGross: number;
  vatRate: VatRate;
}

export type InvoiceStatus = 'Wystawiona' | 'Opłacona' | 'Częściowo opłacona' | 'Przeterminowana' | 'Szkic';

export interface Invoice {
  id: string;
  number: string;
  type: InvoiceType;
  issueDate: string;
  saleDate: string;
  dueDate: string;
  customerId: string;
  customer: Customer;
  items: InvoiceItem[];
  paymentMethod: PaymentMethod;
  paymentTerm: PaymentTerms;
  notes?: string;
  status: InvoiceStatus;
  paidAmount: number;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPriceGross: number;
  vatRate: VatRate;
}

export interface BakeryOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerNip: string;
  date: string;
  deliveryTime: string;
  status: 'Nowe' | 'W piecu' | 'Skompletowane' | 'W dostawie' | 'Zrealizowane';
  items: OrderItem[];
  totalGross: number;
  invoiceId?: string;
}

export interface DeliveryRouteStop {
  id: string;
  orderId: string;
  customerName: string;
  address: string;
  cratesCount: number;
  completed: boolean;
  notes?: string;
}

export interface DeliveryRoute {
  id: string;
  name: string;
  driverName: string;
  vehicle: string;
  departureTime: string;
  status: 'Przygotowanie' | 'W trasie' | 'Zakończona';
  stops: DeliveryRouteStop[];
}

export interface DeliveryDocumentWZ {
  id: string;
  number: string;
  date: string;
  customerName: string;
  nip: string;
  itemsCount: number;
  totalWeightKg: number;
  relatedInvoiceNumber?: string;
  driverName: string;
  status: 'Wydany z magazynu' | 'Dostarczony' | 'Zafakturowany';
}

export interface CompanySettings {
  name: string;
  fullCompanyName: string;
  nip: string;
  regon: string;
  bdo: string;
  address: string;
  city: string;
  postalCode: string;
  bankName: string;
  bankAccount: string;
  email: string;
  phone: string;
  invoicePrefix: string;
  currentYear: number;
  currentMonth: number;
  nextInvoiceIndex: number;
}
