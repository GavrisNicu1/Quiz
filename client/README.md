# Quiz Shop Frontend

Interfață React (Vite + TypeScript) pentru magazinul online Quiz Shop. Aplicația consumă API-ul backend-ului Express/Prisma și oferă fluxuri pentru autentificare, vizualizarea produselor, gestionarea coșului și ecrane dedicate administratorului.

## Cerințe

- Node.js 18+
- Backend-ul (`server/`) pornit pe `http://localhost:4000` sau o adresă configurată cu `VITE_API_URL`.

## Configurare

```bash
cd client
npm install
cp .env.example .env # editează dacă backend-ul rulează pe alt URL
npm run dev
```

## Scripturi utile

- `npm run dev` – pornește serverul Vite în modul dezvoltare (implicit `http://localhost:5173`).
- `npm run build` – generează versiunea de producție.
- `npm run preview` – rulează build-ul local pentru verificări finale.

## Variabile de mediu

- `VITE_API_URL` – baza API-ului (de ex. `http://localhost:4000`). Dacă lipsește, se folosește implicit această valoare.
