Rozszerzony zakres CRUD dla Operatora
4. Operator (zweryfikowany przez administrację) - ROZSZERZONY

C (Create):

Tworzy/aktualizuje profil operatora programu (dane instytucji)
# Generuje raporty/statystyki (zapytania, aktywność)
NOWE: Rejestruje klientów (beneficjentów) w systemie:

Wypełnia dane klienta (imię, nazwisko, telefon, adres, kod pocztowy)
System automatycznie przypisuje klienta do operatora
Wysyła dane dostępowe do klienta (beneficjenta) (supabase email)


NOWE: Składa zlecenia w imieniu klienta:

Wypełnia formularz zlecenia dla wykonawcy (zakładka 2)
Zaznacza checkbox "Potrzebny audyt" - zlecenie trafia wtedy najpierw na giełdę audytorów
Po otrzymaniu audytu, zlecenie automatycznie trafia na giełdę wykonawców


NOWE: Tworzy i zarządza checklistą procesu dla każdego klienta


R (Read):

Przegląda wszystkie zapytania o wykonawców (zakładki 2 i 3) oraz audytorów (zakładki 4 i 5)
Monitoruje panel utworzonych zleceń beneficjentów (zakładka 8)
NOWE: Przegląda listę "swoich" klientów (przypisanych do operatora)
NOWE: Podgląda szczegóły profilu każdego klienta:

Dane osobowe i kontaktowe
Historia złożonych zleceń
Status realizacji projektów
Postęp w checkliście procesu




U (Update):

Weryfikuje/oznacza jako „zweryfikowane" zapytania i oferty
Edytuje status zlecenia (blokuje nadużycia, moderuje opinie)
NOWE: Uzupełnia/aktualizuje dane klientów:

Dane kontaktowe
Dodatkowe informacje o nieruchomości
Preferencje kontaktu


NOWE: Aktualizuje checklistę procesu klienta:

✓ Kompletacja dokumentów
✓ Wykonanie audytu energetycznego
✓ Wybór wykonawcy
✓ Wniosek podpisany przez pełnomocnika
✓ Wniosek wysłany do funduszu
✓ Przedstawienie dyspozycji wpłaty zalicki
✓ Umowa z funduszem
✓ Pierwsza transza przyznana
✓ Realizacja zakończona
✓ Kontrola wykonana
✓ Rozliczenie doatacji
✓ Potwierdzenie rozliczenia przez fundusz


D (Delete):

Usuwa/odrzuca nieprawidłowe zapytania/oferty
Dezaktywuje konta wykonawców/audytorów w razie naruszeń
NOWE: Może usunąć powiązanie z klientem (przekazanie do innego operatora)


Nowe pola formularzy dla Operatora:
Panel zarządzania klientami:

Dane klienta:

Imię i nazwisko
PESEL
Telefon kontaktowy
Email
Adres zamieszkania
Kod pocztowy
Preferowana forma kontaktu
Uwagi operatora


Zlecenie w imieniu klienta:

Wszystkie pola z zakładki 2 (Wyszukiwarka Wykonawców)
Checkbox: "Potrzebny audyt energetyczny"
Uwagi dla wykonawcy/audytora
Termin realizacji (opcjonalnie)


Checklista procesu:

Lista kroków z możliwością zaznaczenia
Data realizacji każdego kroku
Notatki przy każdym kroku
Status ogólny: "W trakcie" / "Zakończony"




Przepływ procesu z udziałem Operatora:

Operator rejestruje klienta → klient otrzymuje dostęp do systemu
Operator składa zlecenie:

Jeśli zaznaczono "Potrzebny audyt" → zlecenie trafia na giełdę audytorów
Po otrzymaniu audytu → zlecenie automatycznie trafia na giełdę wykonawców
Jeśli nie zaznaczono → zlecenie od razu trafia na giełdę wykonawców


Operator monitoruje proces poprzez checklistę i może wspierać klienta na każdym etapie
Klient zachowuje pełną kontrolę - może sam przeglądać oferty i wybierać wykonawców/audytorów