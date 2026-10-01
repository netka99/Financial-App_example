# MojeSaldoo — Specyfikacja Designu i System Projektowy (Design System)

Kompleksowa dokumentacja systemu projektowego, architektury interfejsu (UI), doświadczenia użytkownika (UX) oraz wytycznych wdrożeniowych dla aplikacji **MojeSaldoo – Firma Piekarnia** (system fakturowania, sprzedaży hurtowej i logistyki dostaw pieczywa).

---

## 1. Koncepcja i Filozofia Projektowa

### 1.1. Misja produktu
System **MojeSaldoo** został zaprojektowany z myślą o specyfice pracy rzemieślniczych piekarni i cukierni. Łączy prostotę fakturowania z poranną logistyką: ekspedycją pieczywa, trasami vanów dostawczych, kartami drogowymi oraz stałymi odbiorcami hurtowymi (sklepy osiedlowe, delikatesy, gastronomia, kawiarnie).

### 1.2. Zasady wizualne (Design Principles)
* **Inspiracja ekosystemem Apple**: Miękkie promienie zaokrągleń (`rounded-3xl`, `rounded-2xl`), delikatne cienie rozproszone (`shadow-apple-sm`, `shadow-apple-float`), rozmycia tła (frosted glass `backdrop-blur-md`) oraz czyste, jasne tło w tonacji chłodnego łupka (`#F8FAFC`).
* **Zero-Pill Discipline & Anti-AI Slop**: Unikanie sztucznego, cukierkowego wyglądu. Tagi i metadane są prezentowane jako elegancki, czytelny tekst z subtelnymi separatorami (`•`), a zaokrąglone kapsułki zarezerwowane są wyłącznie dla funkcjonalnych kontrolek segmentowych, liczników i statusów operacyjnych.
* **Precyzja liczbowa (Tabular Numerals)**: Wszystkie kwoty, stawki VAT, ilości sztuk, wagi w kilogramach oraz kody SKU korzystają z cyfr tabelarycznych (`tabular-nums` / font monotypiczny), co zapobiega drganiu layoutu i gwarantuje wyrównanie kolumn.
* **Jednopoziomowa głębia (Single-Elevation Depth)**: Karty sekcji leżą bezpośrednio na płótnie roboczym o kontraście $\Delta \le 7\%$. Zamiast zagnieżdżania kart w kartach stosuje się przestrzeń wewnętrzną (padding) oraz hairline borders (`border-slate-100`).

---

## 2. Paleta Barw i Tokeny Kolorystyczne (Color Tokens)

System opiera się na formule dystrybucji koloru **60-30-10**:
- **60% Neutralne płótno bazowe**: Jasny, czysty odcień `#F8FAFC` oraz biel kart `#FFFFFF`.
- **30% Struktura i typografia**: Hairline borders (`#E2E8F0`, `#F1F5F9`), neutralny tekst podstawowy (`#0F172A`) oraz teksty pomocnicze (`#64748B`).
- **10% Akcenty i akcje**: Precyzyjny indygo akcent (`#4F46E5`) skupiony w kluczowych punktach konwersji (główny CTA, aktywne pozycje menu, kwota do zapłaty).

### 2.1. Główny akcent marki (Brand Indigo)
| Token | Wartość HEX | Zastosowanie |
| :--- | :--- | :--- |
| `brand-50` | `#EEF2FF` | Tła aktywnych kontrolek, avatary literowe pieczywa, subtelne kapsuły |
| `brand-100` | `#E0E7FF` | Ramki aktywnych elementów, subtelne obramowania |
| `brand-200` | `#C7D2FE` | Stany hover obramowań kart i wierszy |
| `brand-600` | `#4F46E5` | Główny kolor akcji: przycisk *Wystaw fakturę*, aktywne menu, ikony kluczowe |
| `brand-700` | `#4338CA` | Stany hover i active przycisków głównych, nagłówki kwot |

### 2.2. Kolory semantyczne i operacyjne
| Rola | Tokeny Tailwind | Zastosowanie |
| :--- | :--- | :--- |
| **Sukces / Aktywność** | `emerald-50`, `emerald-500`, `emerald-700` | Status *Opłacona*, *Aktywny stały odbiorca*, wskaźnik *Poprawne przeliczenie*, status online systemu |
| **Ostrzeżenie / Szkic** | `amber-50`, `amber-500`, `amber-700` | Status *Szkic roboczy*, status *W piecu*, przypomnienia o zbliżającym się terminie |
| **Zagrożenie / Przeterminowanie** | `rose-50`, `rose-600`, `rose-700` | Status faktury *Po terminie*, usuwanie pozycji, błędy formularza |
| **Informacja / Logistyka** | `blue-50`, `blue-600`, `blue-700` | Status zamówienia *Nowe*, vany *W trasie*, numery dokumentów WZ |

---

## 3. Typografia i Skala Tekstu (Typography System)

### 3.1. Rodziny krojów pisma (Font Stack)
* **Krój podstawowy (UI / Display / Body)**: `Plus Jakarta Sans`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`.
  * Włączone funkcje zecerskie OpenType: `cv02`, `cv03`, `cv04`, `cv11` dla maksymalnej czystości liter cyfrowych.
* **Krój danych liczbowych i finansowych (Tabular / Monospace)**: `JetBrains Mono` lub standardowy `tabular-nums` dla stałej szerokości cyfr.

### 3.2. Skala typograficzna (Type Scale)
| Poziom | Rozmiar / Line-height | Grubość | Zastosowanie |
| :--- | :--- | :--- | :--- |
| **Headline Display** | `24px (1.5rem)` / 1.2 | `Bold 700` / `Black 900` | Tytuł faktury na wydruku, kwota brutto na podsumowaniu |
| **Section Title** | `20px (1.25rem)` / 1.3 | `Bold 700` | Nagłówki widoków (*Ręcznie - Nowa Faktura*, *Rejestr faktur*) |
| **Card Header** | `16px (1.0rem)` / 1.4 | `Bold 700` | Tytuły sekcji (*Pozycje faktury*, *Płatność i Dostawa*) |
| **Body Medium** | `13px–14px` / 1.5 | `Medium 500` / `SemiBold 600` | Nazwy pozycji, etykiety formularza, pozycje menu |
| **Muted Metadata** | `11px–12px` / 1.4 | `Regular 400` / `Medium 500` | NIP, adresy kontrahentów, kody SKU, stany magazynowe |
| **Micro Caption** | `10px–11px` / 1.3 | `SemiBold 600` uppercase | Etykiety nadrzędne sekcji (*KLIENT*, *SPRZEDAŻ*, *DOSTAWA*, *SYSTEM*) |

---

## 4. Matematyka Przestrzenna, Promienie i Cienie (Spatial Math)

### 4.1. Reguła zaokrągleń zagnieżdżonych (Nested Radius Formula)
Aby zachować perfekcyjną geometrię optyczną Apple, promień elementu wewnętrznego wynika z promienia zewnętrznego i paddingu:
$$r_{\text{inner}} = r_{\text{outer}} - \text{padding}$$

* **Karta główna sekcji**: `rounded-3xl` ($24\text{px}$) z paddingiem `p-6` ($24\text{px}$).
* **Wewnętrzny wiersz / boks klienta**: `rounded-2xl` ($16\text{px}$).
* **Przyciski i kontrolki wewnętrzne**: `rounded-xl` ($12\text{px}$) z paddingiem `py-2 px-3`.
* **Kapsuły numeryczne i statusy**: `rounded-full` ($9999\text{px}$).

### 4.2. Skala cieni (Elevation Hierarchy)
```css
/* Subtelny cień kart formularzy i tabel */
.shadow-apple-sm {
  box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.05), 
              0 1px 4px -1px rgba(0, 0, 0, 0.03);
}

/* Podniesienie karty przy interakcji (hover) i modale */
.shadow-apple-md {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.04), 
              0 8px 10px -6px rgba(0, 0, 0, 0.02);
}

/* Promienny akcent przycisków CTA */
.shadow-apple-float {
  box-shadow: 0 20px 35px -10px rgba(79, 70, 229, 0.25);
}
```

---

## 5. Architektura Układu (Layout & Navigation Framework)

Struktura interfejsu oparta jest na trwałym, desktopowym podziale ekranu (`1440px+` baseline z pełną responsywnością):

```
+------------------------------------------------------------------------------------+
|  SIDEBAR (w-64)   |  TOP APP BAR (h-20, frosted glass backdrop-blur-md)            |
|  - Logo MojeSaldoo|  [<-] Tytuł widoku  [Szkic]   [Krajowa | UE]  Data wystawienia |
|  - Piekarnia      +----------------------------------------------------------------+
|  - Stan systemu   |  OBSZAR ROBOCZY (max-w-5xl, scrollowany pionowo)              |
|  ---------------- |                                                                |
|  OGÓLNE           |  [ Sekcja 1: Karta Klienta                                  ]  |
|  - Pulpit         |                                                                |
|  SPRZEDAŻ         |  [ Sekcja 2: Pozycje Faktury (Bagietka, Bułki...)           ]  |
|  - Klienci        |  [ + Szybkie dodawanie / Szukaj SKU                         ]  |
|  - Zamówienia     |                                                                |
|  - Faktury (Active|  [ Płatność i Dostawa ]            [ Podsumowanie Kwot i VAT ] |
|  - Niezapłacone   |                                                                |
|  - Gotówkowa      +----------------------------------------------------------------+
|  DOSTAWA / SYSTEM |  DOLNY DOCK AKCJI (h-18, sticky bottom)                        |
|  - Trasy Vana     |  [<- Wstecz] [Zapisz szkic]        ([2] 9,80 zł) [Wystaw fakturę ->] |
+------------------------------------------------------------------------------------+
```

### 5.1. Pasek boczny (Sidebar Navigation)
* **Szerokość**: Stała $256\text{px}$ (`w-64`), białe tło z prawym obramowaniem hairline `#F1F5F9`.
* **Górny brand lockup**: Logotyp *MojeSaldoo*, dopisek *Firma Piekarnia*, pulsujący wskaźnik stanu systemu online (zielona dioda z pierścieniem `ring-4 ring-emerald-50`).
* **Aktywna zakładka**: Pełne tło `bg-indigo-600` z białym tekstem i ikoną, zaokrąglenie `rounded-xl`.
* **Nieaktywne pozycje**: Czysty szary `text-slate-600`, zmiana na `text-slate-900` i `bg-slate-50` przy najechaniu myszą.
* **Liczniki zadań**: Wyraźne wskaźniki przy pozycjach *Zamówienia* (nowe zamówienia w piecu) oraz *Niezapłacone faktury* (zaległości płatnicze).

### 5.2. Górna belka kontekstowa (Top App Bar)
* Wysokość $80\text{px}$ (`h-20`), półprzezroczyste tło `bg-white/80` z filtrem `backdrop-blur-md`.
* Lewa strefa: Okrągły przycisk powrotu (`w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200`), tytuł dokumentu, tag edycyjny oraz nazwa kontrahenta.
* Prawa strefa: Kontrolka segmentowa typu faktury (*Krajowa* vs *Wewnątrzwspólnotowa*), pionowy divider oraz pole daty wystawienia.

### 5.3. Dolny dock akcji (Bottom Sticky Action Dock)
* Pływający dock przyklejony do dołu ekranu (`sticky bottom-0 z-30`).
* Lewa strefa: Przycisk *Wstecz* oraz link *Zapisz jako wersję roboczą*.
* Prawa strefa: Pływająca kapsuła podsumowania zamówienia (`Razem pozycje: 9,80 zł brutto`) oraz główny przycisk akcji (`Wystaw fakturę ->`) ze specjalnym miękkim cieniem `shadow-apple-float`.

---

## 6. Szczegółowa Specyfikacja Ekranów i Komponentów

### 6.1. Ekran Główny: „Ręcznie – Nowa Faktura”
To wiodący ekran aplikacji, odtworzony zgodnie ze specyfikacją makietową.

#### A. Karta Wyboru Klienta
* **Nagłówek sekcji**: Mikro-etykieta `KLIENT` w wielkich literach oraz interaktywny link `Zmień klienta >` z animowaną strzałką hover.
* **Awatara kontrahenta**: Zaokrąglony kontener `w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600` z ikoną budynku biurowego.
* **Dane Nabywcy**: Pełna nazwa, NIP (`9481234567`), adres w Krakowie, warunki płatności (*Przelew 14 dni*).
* **Tag statusu klienta**: `Aktywny stały odbiorca` (`bg-emerald-50 text-emerald-700`).
* **Boks cennika domyślnego**: Wyróżniony kafelek `Indywidualny (Piekarnia)`.

#### B. Pozycje Faktury (Line Items Grid)
Każdy wiersz produktu stanowi niezależną mikro-kartę:
1. **Awatara i Identyfikacja Produktu**:
   - Kwadratowa awatara z pierwszą literą (`B` dla Bagietki i Bułki, `C` dla Chleba, `R` dla Rogala).
   - Nazwa wyrobu, etykieta cenowa (np. `cena indyw.`), kod magazynowy SKU oraz aktualny stan w magazynie ekspedycji (np. `Magazyn: 45 szt.`).
2. **Apple-like Stepper ilościowy**:
   - Zintegrowany, wygładzony moduł z przyciskami `−` (biały) i `+` (akcent indygo) oraz wycentrowanym inputem liczbowym bez natywnych strzałek przeglądarki.
3. **Jednostka miary**: Dropdown z opcjami: `szt.`, `kg`, `opak.`, `bochenek`.
4. **Cena jednostkowa brutto**: Input z sufiksem walutowym `zł`.
5. **Stawka VAT**: Dedykowany selektor stawek: `5%` (stawka podstawowa dla świeżego pieczywa), `8%` (wyroby cukiernicze), `23%` (usługi/półprodukty), `0%`, `zw.`.
6. **Kalkulacja wiersza**: Pogrubiona wartość brutto oraz wyliczona pod spodem wartość netto.
7. **Akcja usunięcia**: Dyskretna ikona kosza aktywująca się po najechaniu kursorem.

#### C. Szybkie dodawanie z autouzupełnianiem
* Pasek z ramką kreskowaną (`border-2 border-dashed border-slate-200/90 hover:border-indigo-300`).
* Live autocomplete filtrujący w czasie rzeczywistym bazę wyrobów piekarniczych (chleby żytnie, razowe, orkiszowe, bułki, rogale, drożdżówki, ciasta).
* Przycisk `+ Dodaj pozycję` otwierający pełny katalog produktowy z podziałem na kategorie.

#### D. Płatność i Dostawa
* Dwukolumnowy układ formularza:
  * Metoda płatności: *Przelew bankowy*, *Gotówka przy odbiorze*, *Karta płatnicza*, *BLIK*.
  * Termin płatności: *Płatne natychmiast*, *Termin: 7 dni*, *Termin: 14 dni*, *Termin: 21 dni*, *Termin: 30 dni*.
  * Uwagi na fakturze: Dowolny tekst lub powiązany numer zlecenia pieca (np. `ZAM/2026/09/88`).

#### E. Podsumowanie Finansowe i Algorytm Słownie
* Precyzyjna siatka rozbicia podstawy opodatkowania:
  * Wartość netto łączna
  * Stawka VAT 5% (świeże pieczywo)
  * Stawka VAT 8% / 23%
  * Wyróżniona kwota **Do zapłaty (Brutto)** dużą, czytelną czcionką indygo
* **Polski generator kwoty słownie**: Automatyczna odmiana gramatyczna liczebników (złote, złotych, grosze) generująca zapis typu: `Słownie: dziewięć złotych 80/100`.
* Wskaźnik walidacji: Zielony punkt `● Poprawne przeliczenie`.

---

### 6.2. Ekran: Rejestr Faktur (`Faktury`)
* **Wyszukiwarka i filtry**: Błyskawiczne filtrowanie po numerze FV, nazwisku kontrahenta i numerze NIP.
* **Segmenty stanów**: *Wszystkie*, *Opłacona*, *Oczekujące*, *Po terminie*, *Szkic*.
* **Tabela danych**: Kompaktowy, przejrzysty widok z kolumnami wyrównanymi do lewej (dane tekstowe) i prawej (finanse).
* **Akcje podręczne**: Podgląd oficjalnego dokumentu, oznaczanie szybkiej wpłaty na konto, duplikowanie oraz usuwanie.

---

### 6.3. Ekran: Pulpit Zarządzania Piekarnią (`Pulpit`)
* **Baner porannego wypieku**: Podsumowanie bieżącej zmiany piekarzy (liczba wypieczonych bochenków, status załadunku aut dostawczych).
* **Karty KPI**:
  1. Miesięczny obrót zafakturowany
  2. Suma niezapłaconych faktur (z liczbą oczekujących przelewów)
  3. Dzisiejsze zamówienia hurtowe
  4. Flota transportowa (vany w trasie)
* **Wykres słupkowy obrotu 7-dniowego**: Dynamiczny podgląd sprzedaży dzień po dniu z wyróżnieniem dnia dzisiejszego.
* **Szybkie operacje**: Skróty do wystawienia faktury, sprzedaży gotówkowej w ekspedycji oraz kart drogowych.

---

### 6.4. Ekran: Baza Kontrahentów (`Klienci`)
* Karty stałych punktów odbiorczych: sklepów, restauracji, kawiarni specialty i cukierni.
* Szczegółowe dane teleadresowe, przypisany dedykowany cennik pieczywa oraz aktualne saldo rozliczeń.
* Przycisk natychmiastowego fakturowania `Wystaw fakturę`, który automatycznie wstępnie konfiguruje dokument dla wybranego kontrahenta.

---

### 6.5. Ekran: Zamówienia Dzienne na Pieczywo (`Zamówienia`)
* Reprezentacja cyklu życia zamówienia piekarni:
  $$\text{Nowe} \longrightarrow \text{W piecu (Wypiek)} \longrightarrow \text{Skompletowane} \longrightarrow \text{W dostawie} \longrightarrow \text{Faktura VAT}$$
* Przycisk `Wystaw fakturę z zamówienia`, który przenosi pozycje koszyka i klienta bezpośrednio do formularza fakturowania bez konieczności ponownego wprowadzania danych.

---

### 6.6. Ekran: Niezapłacone Faktury i Windykacja (`Niezapłacone faktury`)
* Przejrzyste zestawienie zaległości płatniczych.
* Wskaźniki dni po terminie.
* Generator powiadomień SMS i e-mail z gotową, uprzejmą treścią przypomnienia oraz numerem rachunku IBAN piekarni.
* Przycisk rejestracji wpłaty jednym kliknięciem.

---

### 6.7. Ekran: Kasa Ekspedycji (`Sprzedaż gotówkowa`)
* Zoptymalizowany pod ekrany dotykowe interfejs POS dla odbioru własnego pieczywa w piekarni.
* Duże kafelki wyrobów ze stanem magazynowym.
* Automatyczny kalkulator reszty gotówkowej przy wpłacie banknotem.
* Obsługa metod: Gotówka, Karta płatnicza, BLIK.

---

### 6.8. Ekran: Trasy Vana i Logistyka Dostaw (`Trasy Vana`)
* Karty tras porannych (np. *Trasa 1: Stare Miasto & Śródmieście*, *Trasa 2: Wieliczka & Południe*).
* Przypisani kierowcy, numery rejestracyjne vanów i godziny wyjazdu (np. 04:45 rano).
* Punkty rozładunku z liczbą skrzynek pieczywa, uwagami kierowcy (kody do bram, rampy) oraz statusem potwierdzenia odbioru.

---

### 6.9. Modal: Oficjalny Dokument Faktura VAT (Wydruk i KSeF)
Komponent generujący prawnie wiążący dokument zgodny z polską Ustawą o podatku od towarów i usług:
* Precyzyjne dane Sprzedawcy (Piekarnia, NIP, REGON, BDO, numer konta bankowego).
* Dane Nabywcy z adresem i NIP.
* Tabela pozycji z LP, nazwą towaru, ilością, jednostką, ceną netto, stawką VAT i wartością brutto.
* Tabela rozliczenia podatku VAT według stawek.
* Dedykowany arkusz stylów `@media print` ukrywający elementy nawigacyjne i generujący czysty PDF.

---

## 7. Stany Komponentów i Interakcje (Component States & Feedback)

1. **Stany przycisków**:
   - `Default`: Wysoki kontrast, czytelna typografia.
   - `Hover`: Przejście koloru w $\le 150\text{ms}$ (`transition-colors duration-150`).
   - `Active`: Subtelne kliknięcie sprężynowe `active:scale-95`.
   - `Focus-Visible`: Elegancki pierścień dostępności `focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2`.
2. **Powiadomienia Toast**:
   - Dyskretne kapsuły potwierdzające zapis szkicu, dodanie produktu lub wysłanie monitu pojawiające się w prawym górnym rogu ekranu i znikające po 3 sekundach.
3. **Płynność scrollowania**:
   - Własny styl paska przewijania (`.custom-scrollbar`), wąski ($5\text{px}$), półprzezroczysty, zaokrąglony, nieodwracający uwagi od treści.

---

## 8. Dostępność (Accessibility & WCAG AA)

* **Kontrast tekstu**: Wszystkie teksty spełniają normę kontrastu $\ge 4.5:1$ względem tła (dla dużych nagłówków $\ge 3:1$).
* **Niezależność od koloru**: Statusy (np. opłacona, po terminie) nigdy nie są komunikowane wyłącznie kolorem — zawsze towarzyszy im jednoznaczna etykieta tekstowa oraz ikona.
* **Rozmiary celów dotykowych (Touch Targets)**: Wszystkie klikalne elementy na urządzeniach mobilnych mają wysokość $\ge 40\text{px}$ (rekomendowane $44\text{px}$).

---

*Dokument stanowi oficjalną referencję projektową dla aplikacji MojeSaldoo.*
