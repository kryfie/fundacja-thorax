# Fundacja Thorax — one-page + Decap CMS + Netlify

Ta wersja nie korzysta z Sanity. Treści są przechowywane w `content/site.json`, a Decap CMS edytuje ten plik przez GitHub.

## Docelowa architektura

- `fundacjathorax.pl` — strona Fundacji (po zakończeniu demo)
- tymczasowo: adres `*.netlify.app`
- `/admin/` — Decap CMS
- GitHub — repozytorium i historia zmian
- Netlify — automatyczny deploy po każdym zapisie z CMS

## Uruchomienie demo

1. Utwórz repozytorium GitHub, np. `fundacja-thorax`.
2. W `admin/config.yml` zmień:
   `repo: YOUR_GITHUB_USERNAME/fundacja-thorax`
   na prawdziwe `uzytkownik/repo`.
3. Wgraj CAŁĄ zawartość tego ZIP-a do repo na branch `main`.
4. W Netlify wybierz **Add new project / Import an existing project** i wskaż repo GitHub.
   Build command: zostaw puste. Publish directory: `.`
5. Utwórz GitHub OAuth App dla logowania Decap CMS.
   Homepage URL: adres demo Netlify.
   Authorization callback URL: `https://api.netlify.com/auth/done`
6. W Netlify: **Project configuration → Access & security → OAuth → Authentication providers → GitHub** i wpisz Client ID + Client Secret z OAuth App.
7. Wejdź na `https://TWOJ-ADRES.netlify.app/admin/` i zaloguj się kontem GitHub mającym dostęp zapisu do repo.

## Edycja

Panel CMS edytuje: dane Fundacji, hero, misję, sekcję 1,5%, programy pomocy, wydarzenia, artykuły, zespół i dokumenty. Po kliknięciu Publish Decap wykonuje commit do GitHub, a Netlify automatycznie wdraża nową wersję strony.

## Ważne

Git Gateway Netlify jest obecnie funkcją deprecated, dlatego ta paczka używa bezpośredniego backendu GitHub w Decap CMS. Każdy użytkownik CMS musi mieć uprawnienia zapisu do repozytorium.
