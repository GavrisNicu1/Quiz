# Ecommerce

Aplicație e-commerce full-stack construită cu **Node.js + Express + Prisma (SQL Server)** pentru backend și **React + Vite + TypeScript** pentru frontend. Platforma oferă autentificare cu roluri (USER/ADMIN), administrare de produse, coș de cumpărături cu actualizări în timp real și procesare de comenzi.

## Funcționalități principale

- Autentificare JWT (stocată în cookie + header) și protecție role-based.
- CRUD produse, vizibil doar pentru administratori.
- Catalog public și coș persistent per utilizator (cu Socket.IO pentru update-uri live).
- Checkout care generează comenzi și itemi asociați.
- Dashboard admin pentru vizualizarea și actualizarea comenzilor (status).
- Teste API automate (Jest + Supertest) pentru scenarii critice RBAC.

## Arhitectură & tehnologii

- **Backend (`server/`)**: Express, Prisma, SQL Server, Zod pentru validări, Socket.IO, Jest/Supertest.
- **Frontend (`client/`)**: React 18, React Router, React Hook Form, Axios, Vite.
- **Comunicație**: REST API + WebSocket (pentru notificări de coș).

Structură de bază:

```
Quiz/
├─ server/          # API Express + Prisma (TypeScript)
│  ├─ prisma/       # schema, seed script, migrații
│  ├─ src/
│  │  ├─ controllers, routes, middleware, services, validators
│  │  └─ app.ts / server.ts entrypoints
│  └─ tests/        # Jest + Supertest suite
└─ client/          # React + Vite frontend
   ├─ src/
   │  ├─ api, context, hooks, pages, components
   │  └─ main.tsx / App.tsx
   └─ README.md / vite config
```

## Cerințe

- Node.js 18+
- npm 9+
- SQL Server 2019+ (sau Azure SQL) accesibil pe conexiunea indicată în `.env`.

---

## Backend (`server/`) – configurare & rulare

1. **Instalare dependențe**
   ```bash
   cd server
   npm install
   ```
2. **Config mediu**
   ```bash
   cp .env.example .env
   ```
   Completează `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `COOKIE_NAME`. Exemplu de connection string pentru SQL Express local:
   ```
   DATABASE_URL="sqlserver://sa:yourStrong(!)Password@localhost:1433;database=ShopDb;encrypt=false"
   ```
3. **Prisma**
   ```bash
   npm run prisma:generate   # opțional după modificarea schemei
   npm run prisma:migrate    # rulează migrate dev + suitea Jest
   npm run prisma:seed       # populează admin + user + produse demo
   ```
4. **Pornire server dev**
   ```bash
   npm run dev
   ```
   API-ul rulează implicit pe `http://localhost:4000`. Pentru build producție: `npm run build && npm start`.
5. **Teste API**
   ```bash
   npm run test:api
   ```
   Rulează scenarii RBAC (creare produse de către admin, user checkout, vizualizare comenzi).

### Variabile backend

| Variabilă     | Descriere                                                |
| ------------- | -------------------------------------------------------- |
| `PORT`        | Portul Express (implicit 4000).                          |
| `DATABASE_URL`| Conexiune SQL Server pentru Prisma.                      |
| `JWT_SECRET`  | Cheie HMAC pentru token-uri.                             |
| `CORS_ORIGIN` | Originea permisă pentru frontend (ex. `http://localhost:5173`). |
| `COOKIE_NAME` | Numele cookie-ului ce stochează JWT-ul.                  |

---

## Frontend (`client/`) – configurare & rulare

1. **Instalare dependențe**
   ```bash
   cd client
   npm install
   ```
2. **Config mediu**
   ```bash
   cp .env.example .env
   ```
   Editați `VITE_API_URL` dacă backend-ul rulează pe alt host/port.
3. **Pornire dezvoltare**
   ```bash
   npm run dev
   ```
   Interfața dev este disponibilă pe `http://localhost:5173` cu proxy către backend.
4. **Build & preview**
   ```bash
   npm run build
   npm run preview
   ```

### Fluxuri acoperite în UI

- Pagini publice (listă produse, detalii).
- Autentificare/înregistrare, menținere sesiune în context.
- Coș + checkout pentru USER.
- Panou ADMIN cu gestiune produse și comenzi.

*(Componentizarea completă se află în `client/src/`; vezi README-ul dedicat pentru detalii suplimentare.)*

---

## Rezumat API (role-aware)

| Metodă | Endpoint                  | Autentificare | Rol          | Descriere                                 |
| ------ | ------------------------- | ------------- | ------------ | ----------------------------------------- |
| POST   | `/api/auth/register`      | Nu            | -            | Înregistrare, întoarce user + token.      |
| POST   | `/api/auth/login`         | Nu            | -            | Login, setează cookie + JWT.              |
| GET    | `/api/auth/me`            | Da            | USER/ADMIN   | Profilul curent.                          |
| POST   | `/api/products`           | Da            | ADMIN        | Creează produs.                           |
| PATCH  | `/api/products/:id`       | Da            | ADMIN        | Actualizează produs.                      |
| DELETE | `/api/products/:id`       | Da            | ADMIN        | Șterge produs.                            |
| GET    | `/api/products`           | Nu            | -            | Listă produse.                            |
| GET    | `/api/products/:id`       | Nu            | -            | Detaliu produs.                           |
| GET    | `/api/cart`               | Da            | USER/ADMIN   | Items din coșul utilizatorului curent.    |
| POST   | `/api/cart/items`         | Da            | USER/ADMIN   | Adaugă/actualizează item în coș.          |
| PATCH  | `/api/cart/items/:id`     | Da            | USER/ADMIN   | Modifică cantitatea unui item.           |
| DELETE | `/api/cart/items/:id`     | Da            | USER/ADMIN   | Elimină un item.                          |
| POST   | `/api/orders/checkout`    | Da            | USER/ADMIN   | Transformă coșul în comandă.              |
| GET    | `/api/orders`             | Da            | USER → doar propriile comenzi<br>ADMIN → toate | Listă comenzi filtrată după rol. |
| PATCH  | `/api/orders/:id/status`  | Da            | ADMIN        | Actualizează statusul comenzii.           |

Socket.IO expune canalul `cart:{userId}` (eveniment `cart:update`) pentru a sincroniza conținutul coșului între tab-uri/dispozitive.

---

## Flux recomandat pentru dezvoltare

1. Pornește backend-ul (`npm run dev` în `server/`).
2. Rulează frontend-ul (`npm run dev` în `client/`).
3. Folosește utilizatorii generați de `prisma/seed.ts` (admin & user demo) sau creează alții via `/api/auth/register`.
4. Rulează `npm run test:api` după modificări ale permisiunilor sau logicii de comandă pentru a te asigura că scenariile RBAC rămân stabile.

## Suport & extinderi

- Poți conecta aplicația la SQL Server on-prem sau Azure SQL; actualizează doar `DATABASE_URL`.
- Pentru deployment, construiește backend-ul (`npm run build`) și livrează frontend-ul static (`npm run build` în `client/`).
- Adaugă alte roluri sau gateway-uri de plată extinzând validatorii și controllers existente.

Documentația de mai sus acoperă cap-coadă inițializarea, rularea și testarea aplicației. Ajustează după nevoile mediului tău.
