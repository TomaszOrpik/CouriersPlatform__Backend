# Backend

###  Opis

Jest to Backend działający po stronie serwera, odpowiadający za przyjmowanie i wysyłanie danych do poszczególnych aplikacji poprzez protokół HTTP. Aplikacja ta jest niezbędna do prawidłowego działania wszystkich pozostałych.

###  1. Instalacja

- Przygotowanie Bazy Danych <br/>
   Aby aplikacja działała poprawnie należy utworzyć nową bazę danych według [instrukcji instalacji Firebase Database](https://firebase.google.com/docs/database/web/start). 
- Przygotowanie niezbędnych zmiennych <br/>
   Po poprawnym utworzeniu bazy danych należy skopiować plik `firebase-config.example.ts` i zmienić znajdujące się w nim zmienne na te prowadzące do własnej bazy danych, a nazwę pliku na `firebase-config.ts`. Następnie należy skopiować plik `.env.example` i zmienić jego nazwę na `.env`.
- Instalacja Pakietów <br/>
   Po przygotowaniu bazy danych i zmiennych instalujemy wszystkie niezbędne pakiety komendą `npm install`.

###  2. Uruchomienie

Po poprawnej instalacji aplikację uruchamiamy komendą `npm run start:dev`

### 3. Wersja Produkcyjna

W celu skompilowania aplikacji do wersji produkcyjnej należy uruchomić komendę `npm run build`. Wszystkie niezbędne pliki do działania będą znajdować się w folderze dist.