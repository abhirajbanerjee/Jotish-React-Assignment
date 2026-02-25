# Employee Directory App

A 6-page React app built for the Jotish internship assignment. Demonstrates clean architecture with OOP patterns (ES6 classes), Zustand state management, and a modern dark UI.

## Live URLs
| Route | Page |
|---|---|
| `/login` | Hardcoded auth with validation |
| `/list` | Employee list — search + skeleton loader |
| `/details/:id` | Employee detail + live camera capture |
| `/photo` | Display captured photo |
| `/chart` | Top-10 salary bar chart with average line |
| `/map` | Interactive map with employee markers |

**Demo credentials:** `testuser` / `Test123`

## Tech Stack
| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| State | Zustand |
| HTTP | Axios |
| Forms | React Hook Form |
| Charts | Recharts |
| Maps | React Leaflet + Leaflet |
| Styling | Vanilla CSS (dark theme) |
| Notifications | React Hot Toast |

## Setup & Run
```bash
npm install
npm run dev
```

## Architecture

### OOP in a React App
React components are functions, but the data layer doesn't have to be. This project uses ES6 classes with private fields to encapsulate API response shapes and business logic — so components never touch raw API data directly.

| Where | Class / Pattern | Principle |
|---|---|---|
| `Employee.js` | `Employee` class | **Encapsulation** — raw API field names hidden |
| `Employee.js` | `getDisplaySalary()` | **Abstraction** — Intl formatting hidden from callers |
| `Employee.js` | `toMapMarker()` | **Abstraction** — map page never touches raw API |
| `EmployeeService.js` | `#employees` private field | **Encapsulation** — cannot be mutated externally |
| `EmployeeService.js` | `EmployeeService` | **SRP** — only fetches/queries, no UI concerns |
| `ProtectedRoute.jsx` | HOC wrapper | **Decorator** — adds auth-check without modifying pages |
| `useCamera.js` | Custom hook | **Facade** — simplifies MediaDevices into 3 calls |
| Zustand store | `service` singleton | **Singleton** — one instance shared across all pages |

### Data Flow
```
POST /gettabledata.php
        │
        ▼
  EmployeeApi.js       ← raw Axios call
        │
        ▼
 EmployeeService.js    ← maps raw[] → Employee[] (model hydration)
        │
        ▼
 useEmployeeStore.js   ← stores Employee[], exposes service singleton
        │
   ┌────┴────────────┬──────────────────┬──────────────────┐
   ▼                 ▼                  ▼                  ▼
ListPage         DetailsPage        ChartPage           MapPage
```

**The API is called exactly once** — the Zustand store guard `if (get().status === 'success') return;` ensures this regardless of how many pages mount.

## Project Structure
```
src/
├── api/EmployeeApi.js          # Axios instance + raw API call
├── models/Employee.js          # ES6 class: raw JSON → typed object
├── services/EmployeeService.js # ES6 class: fetch, filter, sort, slice
├── store/useEmployeeStore.js   # Zustand store: single source of truth
├── hooks/
│   ├── useEmployees.js         # Triggers fetch, exposes loading/error
│   └── useCamera.js            # Facade over MediaDevices API
├── pages/
│   ├── LoginPage.jsx
│   ├── ListPage.jsx
│   ├── DetailsPage.jsx
│   ├── PhotoResultPage.jsx
│   ├── ChartPage.jsx
│   └── MapPage.jsx
├── components/
│   ├── EmployeeCard.jsx
│   ├── SkeletonCard.jsx
│   ├── SearchBar.jsx
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
└── utils/formatCurrency.js
```

## Known Limitations
- Camera requires HTTPS or `localhost` to function (browser security restriction)
- Map coordinates: if the API returns `lat=0, lng=0`, the app falls back to city-name lookup or random offset near India
