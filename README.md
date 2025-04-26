# Smart Delivery Routes

## O Aplikacji

Smart Delivery Routes to nowoczesna aplikacja webowa do zarządzania dostawami, zamówieniami i kurierami. System został zaprojektowany, aby optymalizować procesy logistyczne, śledzić statusy zamówień oraz efektywnie zarządzać flotą kurierów.

## Funkcjonalności

### Zarządzanie Zamówieniami
- **Przeglądanie zamówień** - lista aktywnych zamówień z możliwością filtrowania
- **Dodawanie zamówień** - tworzenie nowych zamówień z określeniem klienta, adresu i opisu dostawy
- **Edycja zamówień** - modyfikacja danych zamówienia, w tym przypisanego kuriera i statusu
- **Usuwanie zamówień** - możliwość usunięcia zamówienia z systemu
- **Śledzenie statusu** - cztery statusy zamówień:
  - Oczekujące - zamówienia oczekujące na przydzielenie kuriera
  - W drodze - zamówienia w trakcie dostawy
  - Dostarczone - zamówienia zrealizowane
  - Anulowane - zamówienia anulowane

### Zarządzanie Kurierami
- **Lista kurierów** - przeglądanie wszystkich dostępnych kurierów
- **Status dostępności** - informacja czy kurier jest aktualnie dostępny do przydzielenia
- **Automatyczna aktualizacja statusu** - przy przydzieleniu kuriera do zamówienia, jego status dostępności jest aktualizowany
- **Zwolnienie kuriera** - po dostarczeniu lub anulowaniu zamówienia, kurier staje się ponownie dostępny

### Archiwizacja
- **Archiwum zamówień** - dostęp do historycznych zamówień (dostarczone i anulowane)
- **Pełna historia** - zachowanie wszystkich informacji o zrealizowanych dostawach
- **Czas dostawy** - wyświetlanie czasu realizacji zamówienia (od utworzenia do dostarczenia/anulowania)
- **Statystyki czasowe** - możliwość analizy wydajności dostaw na podstawie czasu realizacji

### Panel Zarządzania
- **Intuicyjny dashboard** - przejrzysty panel z szybkim dostępem do wszystkich funkcji
- **Statystyki** - informacje o liczbie zamówień i ich statusach
- **Responsywny interfejs** - dostosowany do różnych urządzeń

### Bezpieczeństwo
- **System logowania** - zabezpieczony dostęp do panelu administracyjnego
- **Autoryzacja** - weryfikacja uprawnień użytkowników
- **Ochrona tras** - dostęp do zasobów tylko dla zalogowanych użytkowników

## Technologie

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (baza danych i autentykacja)
- **Hosting**: Możliwość wdrożenia na Vercel

## Instrukcja Instalacji

1. Sklonuj repozytorium:
```bash
git clone [url-repozytorium]
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Skonfiguruj zmienne środowiskowe:
Utwórz plik `.env.local` i dodaj następujące zmienne:
NEXT_PUBLIC_SUPABASE_URL=twój_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=twój_klucz_supabase
