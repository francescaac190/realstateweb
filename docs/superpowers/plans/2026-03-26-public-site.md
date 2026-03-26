# Public Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a multi-page public real estate site (Home, Properties search, Property detail, Agents, Agent listings) with a clean white modern style — no login required.

**Architecture:** Add public routes at the root (`/`, `/properties`, `/agents`, etc.) wrapped in a new `PublicLayout`. Move existing admin routes to `/admin/*`. A new `publicApiClient` (no auth) handles public data fetching. Agents use mock data until the backend `/users` endpoint is available.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v3, React Router v7, Axios

> **Note — no test runner:** The project has no vitest/jest setup. Skip TDD steps; verify manually with `npm run dev` and browser inspection.

---

## File Map

### New files
| File | Responsibility |
|---|---|
| `src/public/lib/publicApiClient.ts` | Axios instance without auth interceptors |
| `src/public/types/agent.types.ts` | `PublicAgent` type + mock data |
| `src/public/services/publicProperties.service.ts` | Public property API calls |
| `src/public/services/publicAgents.service.ts` | Agent API calls (mock until backend ready) |
| `src/public/hooks/usePublicProperties.ts` | Properties fetch hook |
| `src/public/hooks/usePublicAgents.ts` | Agents fetch hook |
| `src/public/layout/PublicNavbar.tsx` | Top nav: logo + links + Admin button |
| `src/public/layout/PublicFooter.tsx` | One-line copyright footer |
| `src/public/layout/PublicLayout.tsx` | Navbar + `<Outlet>` + Footer |
| `src/public/components/HeroSearchBar.tsx` | Search input + type-tag chips |
| `src/public/components/AgentCard.tsx` | Agent avatar + name + count + link |
| `src/public/components/PropertyGallery.tsx` | Main image + thumbnail strip |
| `src/public/components/ContactButtons.tsx` | WhatsApp / Call / Email buttons |
| `src/public/pages/PropertiesSearchPage.tsx` | Filter bar + results grid |
| `src/public/pages/PropertyDetailPage.tsx` | Gallery + specs + contact sidebar |
| `src/public/pages/AgentsPage.tsx` | Agent grid |
| `src/public/pages/AgentListingsPage.tsx` | Agent header + their property grid |

### Modified files
| File | Change |
|---|---|
| `src/public/pages/HomePage.tsx` | Replace stub with full implementation |
| `src/auth/router/AppRouter.tsx` | Admin routes → `/admin/*`, add public routes, fallback → `/` |
| `src/components/SideDrawerMenu.tsx` | Nav links → `/admin/dashboard`, `/admin/properties`, `/admin/contacts` |
| `src/auth/pages/Login.tsx` | Post-login redirect → `/admin/dashboard` |

---

## Task 1: Migrate admin routes to `/admin/*`

**Files:**
- Modify: `src/auth/router/AppRouter.tsx`
- Modify: `src/components/SideDrawerMenu.tsx` (line 81–83)
- Modify: `src/auth/pages/Login.tsx` (line 58)

- [ ] **Step 1: Update `SideDrawerMenu.tsx` — change NAV_ITEMS paths**

  Find lines 80–84 and replace:
  ```tsx
  const NAV_ITEMS = [
    { label: "Dashboard", to: "/admin/dashboard", Icon: IconDashboard },
    { label: "Propiedades", to: "/admin/properties", Icon: IconProperties },
    { label: "Contactos", to: "/admin/contacts", Icon: IconLeads },
  ];
  ```

- [ ] **Step 2: Update `Login.tsx` — redirect to `/admin/dashboard` after login**

  Find line 58 and change:
  ```tsx
  navigate("/admin/dashboard");
  ```

- [ ] **Step 3: Update `AppRouter.tsx` — move admin routes and update fallback**

  Replace the entire file content:
  ```tsx
  import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
  import Login from "../pages/Login";
  import PrivateRoute from "./PrivateRoute";
  import AppLayout from "../../components/AppLayout";
  import Dashboard from "../../features/dashboard/pages/Dashboard";
  import PropertiesList from "../../features/properties/pages/PropertiesList";
  import ContactsList from "../../features/contacts/pages/ContactsList";
  import HomePage from "../../public/pages/HomePage";

  export default function AppRouter() {
    return (
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} />

          {/* Admin — protected */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/properties" element={<PropertiesList />} />
              <Route path="/admin/contacts" element={<ContactsList />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }
  ```

- [ ] **Step 4: Verify the app still starts and admin login still works**

  ```bash
  cd apps/web && npm run dev
  ```
  Navigate to `http://localhost:5173/login`, log in, confirm you land on `/admin/dashboard` and the side drawer links work.

- [ ] **Step 5: Commit**

  ```bash
  git add apps/web/src/auth/router/AppRouter.tsx \
          apps/web/src/components/SideDrawerMenu.tsx \
          apps/web/src/auth/pages/Login.tsx
  git commit -m "feat: move admin routes to /admin/* prefix"
  ```

---

## Task 2: publicApiClient, agent types, and public services

**Files:**
- Create: `src/public/lib/publicApiClient.ts`
- Create: `src/public/types/agent.types.ts`
- Create: `src/public/services/publicProperties.service.ts`
- Create: `src/public/services/publicAgents.service.ts`

- [ ] **Step 1: Create `src/public/lib/publicApiClient.ts`**

  ```ts
  import axios from 'axios';

  const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

  export const publicApiClient = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
  });
  ```

- [ ] **Step 2: Create `src/public/types/agent.types.ts`**

  ```ts
  export interface PublicAgent {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }

  // TODO: replace with real API call once GET /users is available on the backend
  export const MOCK_AGENTS: PublicAgent[] = [
    { id: '1', firstName: 'María',  lastName: 'González', email: 'maria@c21.com',  phone: '+541112345678' },
    { id: '2', firstName: 'Carlos', lastName: 'Ruiz',     email: 'carlos@c21.com', phone: '+541187654321' },
    { id: '3', firstName: 'Ana',    lastName: 'Martínez', email: 'ana@c21.com' },
    { id: '4', firstName: 'Jorge',  lastName: 'López',    email: 'jorge@c21.com',  phone: '+541156789012' },
  ];
  ```

- [ ] **Step 3: Create `src/public/services/publicProperties.service.ts`**

  ```ts
  import { publicApiClient } from '../lib/publicApiClient';
  import type { Property, PropertyFilters } from '../../features/properties/types/property.types';

  export const publicPropertiesService = {
    getAll: (filters?: PropertyFilters): Promise<Property[]> =>
      publicApiClient
        .get<Property[]>('/properties', { params: filters })
        .then((r) => r.data),

    getById: (id: string): Promise<Property> =>
      publicApiClient
        .get<Property>(`/properties/${id}`)
        .then((r) => r.data),
  };
  ```

- [ ] **Step 4: Create `src/public/services/publicAgents.service.ts`**

  ```ts
  import type { PublicAgent } from '../types/agent.types';
  import { MOCK_AGENTS } from '../types/agent.types';

  // TODO: replace mock with publicApiClient.get('/users') once endpoint exists
  export const publicAgentsService = {
    getAll: (): Promise<PublicAgent[]> =>
      Promise.resolve(MOCK_AGENTS),

    getById: (id: string): Promise<PublicAgent | undefined> =>
      Promise.resolve(MOCK_AGENTS.find((a) => a.id === id)),
  };
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add apps/web/src/public/
  git commit -m "feat: add publicApiClient, agent types, and public services"
  ```

---

## Task 3: Public hooks

**Files:**
- Create: `src/public/hooks/usePublicProperties.ts`
- Create: `src/public/hooks/usePublicAgents.ts`

- [ ] **Step 1: Create `src/public/hooks/usePublicProperties.ts`**

  ```ts
  import { useEffect, useRef, useState } from 'react';
  import { publicPropertiesService } from '../services/publicProperties.service';
  import type { Property, PropertyFilters } from '../../features/properties/types/property.types';

  interface State {
    data: Property[];
    isLoading: boolean;
    error: string | null;
  }

  export function usePublicProperties(filters?: PropertyFilters) {
    const [state, setState] = useState<State>({ data: [], isLoading: true, error: null });

    const filtersKey = JSON.stringify(filters ?? {});
    const filtersKeyRef = useRef(filtersKey);
    filtersKeyRef.current = filtersKey;

    useEffect(() => {
      let cancelled = false;
      setState((s) => ({ ...s, isLoading: true, error: null }));

      publicPropertiesService
        .getAll(filters)
        .then((data) => {
          if (!cancelled) setState({ data, isLoading: false, error: null });
        })
        .catch((err: Error) => {
          if (!cancelled)
            setState({ data: [], isLoading: false, error: err?.message ?? 'Error al cargar propiedades.' });
        });

      return () => { cancelled = true; };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtersKey]);

    return state;
  }
  ```

- [ ] **Step 2: Create `src/public/hooks/usePublicAgents.ts`**

  ```ts
  import { useEffect, useState } from 'react';
  import { publicAgentsService } from '../services/publicAgents.service';
  import type { PublicAgent } from '../types/agent.types';

  interface State {
    data: PublicAgent[];
    isLoading: boolean;
    error: string | null;
  }

  export function usePublicAgents() {
    const [state, setState] = useState<State>({ data: [], isLoading: true, error: null });

    useEffect(() => {
      let cancelled = false;
      publicAgentsService
        .getAll()
        .then((data) => {
          if (!cancelled) setState({ data, isLoading: false, error: null });
        })
        .catch((err: Error) => {
          if (!cancelled) setState({ data: [], isLoading: false, error: err?.message ?? 'Error.' });
        });
      return () => { cancelled = true; };
    }, []);

    return state;
  }

  export function usePublicAgent(id: string) {
    const [state, setState] = useState<{ data: PublicAgent | null; isLoading: boolean; error: string | null }>({
      data: null,
      isLoading: true,
      error: null,
    });

    useEffect(() => {
      let cancelled = false;
      publicAgentsService
        .getById(id)
        .then((data) => {
          if (!cancelled) setState({ data: data ?? null, isLoading: false, error: null });
        })
        .catch((err: Error) => {
          if (!cancelled) setState({ data: null, isLoading: false, error: err?.message ?? 'Error.' });
        });
      return () => { cancelled = true; };
    }, [id]);

    return state;
  }
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add apps/web/src/public/hooks/
  git commit -m "feat: add usePublicProperties and usePublicAgents hooks"
  ```

---

## Task 4: PublicLayout (Navbar + Footer)

**Files:**
- Create: `src/public/layout/PublicNavbar.tsx`
- Create: `src/public/layout/PublicFooter.tsx`
- Create: `src/public/layout/PublicLayout.tsx`

- [ ] **Step 1: Create `src/public/layout/PublicNavbar.tsx`**

  ```tsx
  import { NavLink } from 'react-router-dom';

  export default function PublicNavbar() {
    return (
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-1.5 font-bold text-gray-900 text-base">
            C21
            <span className="text-[#f97316]">·</span>
          </NavLink>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-6">
            {[
              { label: 'Propiedades', to: '/properties' },
              { label: 'Agentes', to: '/agents' },
            ].map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? 'text-[#f97316]' : 'text-gray-500 hover:text-gray-900'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Admin button */}
          <NavLink
            to="/login"
            className="text-xs font-semibold text-gray-500 border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors"
          >
            Admin →
          </NavLink>
        </div>
      </header>
    );
  }
  ```

- [ ] **Step 2: Create `src/public/layout/PublicFooter.tsx`**

  ```tsx
  export default function PublicFooter() {
    return (
      <footer className="border-t border-gray-100 py-6 mt-16">
        <p className="text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Century 21 · Todos los derechos reservados
        </p>
      </footer>
    );
  }
  ```

- [ ] **Step 3: Create `src/public/layout/PublicLayout.tsx`**

  ```tsx
  import { Outlet } from 'react-router-dom';
  import PublicNavbar from './PublicNavbar';
  import PublicFooter from './PublicFooter';

  export default function PublicLayout() {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <PublicNavbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <PublicFooter />
      </div>
    );
  }
  ```

- [ ] **Step 4: Wire PublicLayout into AppRouter**

  Update `src/auth/router/AppRouter.tsx` — import `PublicLayout` and wrap the public page routes:

  ```tsx
  import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
  import Login from "../pages/Login";
  import PrivateRoute from "./PrivateRoute";
  import AppLayout from "../../components/AppLayout";
  import Dashboard from "../../features/dashboard/pages/Dashboard";
  import PropertiesList from "../../features/properties/pages/PropertiesList";
  import ContactsList from "../../features/contacts/pages/ContactsList";
  import PublicLayout from "../../public/layout/PublicLayout";
  import HomePage from "../../public/pages/HomePage";

  export default function AppRouter() {
    return (
      <BrowserRouter>
        <Routes>
          {/* Standalone public page (no layout) */}
          <Route path="/login" element={<Login />} />

          {/* Public site — wrapped in PublicLayout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            {/* Additional public routes added in later tasks */}
          </Route>

          {/* Admin — protected */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/properties" element={<PropertiesList />} />
              <Route path="/admin/contacts" element={<ContactsList />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }
  ```

- [ ] **Step 5: Verify in browser — `http://localhost:5173/` shows the navbar and footer**

- [ ] **Step 6: Commit**

  ```bash
  git add apps/web/src/public/layout/ apps/web/src/auth/router/AppRouter.tsx
  git commit -m "feat: add PublicLayout with navbar and footer"
  ```

---

## Task 5: Shared public components

**Files:**
- Create: `src/public/components/HeroSearchBar.tsx`
- Create: `src/public/components/AgentCard.tsx`
- Create: `src/public/components/PropertyGallery.tsx`
- Create: `src/public/components/ContactButtons.tsx`

- [ ] **Step 1: Create `src/public/components/HeroSearchBar.tsx`**

  ```tsx
  import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';

  const QUICK_TAGS = ['Casas', 'Departamentos', 'Terrenos', 'Oficinas'];

  // Maps tag label to the typeId used by the backend
  const TAG_TYPE_IDS: Record<string, number> = {
    Casas: 1,
    Departamentos: 2,
    Terrenos: 3,
    Oficinas: 4,
  };

  export default function HeroSearchBar() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      navigate(`/properties?${params.toString()}`);
    };

    const handleTagClick = (tag: string) => {
      const typeId = TAG_TYPE_IDS[tag];
      navigate(`/properties?typeId=${typeId}`);
    };

    return (
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        {/* Search bar */}
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-lg">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Ciudad, tipo de propiedad..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-[#f97316] text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Buscar
          </button>
        </div>

        {/* Quick-filter tags */}
        <div className="flex gap-2 flex-wrap">
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="text-xs text-white/80 border border-white/20 bg-white/10 hover:bg-white/20 rounded-full px-3 py-1 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Create `src/public/components/AgentCard.tsx`**

  ```tsx
  import { Link } from 'react-router-dom';
  import type { PublicAgent } from '../types/agent.types';

  interface Props {
    agent: PublicAgent;
    propertyCount?: number;
  }

  function getInitials(agent: PublicAgent) {
    return `${agent.firstName[0]}${agent.lastName[0]}`.toUpperCase();
  }

  export default function AgentCard({ agent, propertyCount }: Props) {
    return (
      <Link
        to={`/agents/${agent.id}`}
        className="flex flex-col items-center gap-3 p-5 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-gray-200 transition-all text-center"
      >
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-orange-50 text-[#f97316] text-lg font-bold flex items-center justify-center">
          {getInitials(agent)}
        </div>

        {/* Name */}
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {agent.firstName} {agent.lastName}
          </p>
          {propertyCount !== undefined && (
            <p className="text-xs text-gray-400 mt-0.5">{propertyCount} propiedades</p>
          )}
        </div>

        <span className="text-xs text-[#f97316] font-medium border border-orange-200 rounded-full px-3 py-0.5">
          Ver propiedades →
        </span>
      </Link>
    );
  }
  ```

- [ ] **Step 3: Create `src/public/components/PropertyGallery.tsx`**

  ```tsx
  import { useState } from 'react';
  import type { PropertyMedia } from '../../features/properties/types/property.types';

  const MAX_THUMBS = 4;

  interface Props {
    media: PropertyMedia[];
    title: string;
  }

  export default function PropertyGallery({ media, title }: Props) {
    const images = media.filter((m) => m.type === 'IMAGE').sort((a, b) => a.order - b.order);
    const [activeIdx, setActiveIdx] = useState(0);

    if (images.length === 0) {
      return (
        <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
          Sin imágenes
        </div>
      );
    }

    const visibleThumbs = images.slice(0, MAX_THUMBS);
    const extra = images.length - MAX_THUMBS;

    return (
      <div className="flex flex-col gap-2">
        {/* Main image */}
        <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
          <img
            src={images[activeIdx].url}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2">
            {visibleThumbs.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveIdx(i)}
                className={`flex-1 aspect-video rounded-lg overflow-hidden border-2 transition-colors ${
                  activeIdx === i ? 'border-[#f97316]' : 'border-transparent'
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
            {extra > 0 && (
              <div className="flex-1 aspect-video rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                +{extra}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  ```

- [ ] **Step 4: Create `src/public/components/ContactButtons.tsx`**

  ```tsx
  import type { PublicAgent } from '../types/agent.types';

  interface Props {
    agent: PublicAgent;
  }

  export default function ContactButtons({ agent }: Props) {
    return (
      <div className="flex flex-col gap-2">
        {agent.phone && (
          <a
            href={`https://wa.me/${agent.phone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25d366] text-white text-sm font-semibold py-2.5 rounded-lg hover:brightness-95 transition-all"
          >
            💬 WhatsApp
          </a>
        )}
        {agent.phone && (
          <a
            href={`tel:${agent.phone}`}
            className="flex items-center justify-center gap-2 bg-[#f97316] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-orange-600 transition-colors"
          >
            📞 Llamar
          </a>
        )}
        {agent.email && (
          <a
            href={`mailto:${agent.email}`}
            className="flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ✉ Email
          </a>
        )}
      </div>
    );
  }
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add apps/web/src/public/components/
  git commit -m "feat: add HeroSearchBar, AgentCard, PropertyGallery, ContactButtons"
  ```

---

## Task 6: HomePage

**Files:**
- Modify: `src/public/pages/HomePage.tsx`

- [ ] **Step 1: Replace the stub with the full implementation**

  ```tsx
  import { Link } from 'react-router-dom';
  import HeroSearchBar from '../components/HeroSearchBar';
  import AgentCard from '../components/AgentCard';
  import { PropertyCard, PropertyCardSkeleton } from '../../features/properties/components/PropertyCard';
  import { usePublicProperties } from '../hooks/usePublicProperties';
  import { usePublicAgents } from '../hooks/usePublicAgents';

  export default function HomePage() {
    const { data: properties, isLoading: propsLoading } = usePublicProperties({ isDraft: false });
    const { data: agents } = usePublicAgents();

    const featured = properties.slice(0, 6);

    return (
      <>
        {/* ── Hero ── */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-20 px-4">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-6">
            <p className="text-xs tracking-widest text-white/40 uppercase">Century 21</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              Encontrá tu próxima<br />propiedad
            </h1>
            <HeroSearchBar />
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 py-6 grid grid-cols-3 divide-x divide-gray-100 text-center">
            {[
              { value: '200+', label: 'Propiedades' },
              { value: '15', label: 'Agentes' },
              { value: '10+', label: 'Años' },
            ].map(({ value, label }) => (
              <div key={label} className="px-4">
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Featured listings ── */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Propiedades destacadas</h2>
            <Link to="/properties" className="text-sm text-[#f97316] font-medium hover:underline">
              Ver todas →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {propsLoading
              ? Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)
              : featured.map((p) => (
                  <Link key={p.id} to={`/properties/${p.id}`} className="block hover:scale-[1.01] transition-transform">
                    <PropertyCard property={p} />
                  </Link>
                ))}
          </div>
        </section>

        {/* ── Agents preview ── */}
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Nuestros agentes</h2>
            <Link to="/agents" className="text-sm text-[#f97316] font-medium hover:underline">
              Ver todos →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {agents.slice(0, 4).map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                propertyCount={properties.filter((p) => p.agentId === agent.id).length}
              />
            ))}
          </div>
        </section>
      </>
    );
  }
  ```

- [ ] **Step 2: Verify at `http://localhost:5173/`** — hero, stats bar, 6 property cards (or skeletons), 4 agent cards all visible.

- [ ] **Step 3: Commit**

  ```bash
  git add apps/web/src/public/pages/HomePage.tsx
  git commit -m "feat: implement HomePage with hero, stats, featured listings, agents preview"
  ```

---

## Task 7: PropertiesSearchPage

**Files:**
- Create: `src/public/pages/PropertiesSearchPage.tsx`

- [ ] **Step 1: Create `src/public/pages/PropertiesSearchPage.tsx`**

  ```tsx
  import { useMemo } from 'react';
  import { Link, useSearchParams } from 'react-router-dom';
  import { PropertyCard, PropertyCardSkeleton } from '../../features/properties/components/PropertyCard';
  import { usePublicProperties } from '../hooks/usePublicProperties';

  const PROPERTY_TYPES = [
    { id: 1, name: 'Casa' },
    { id: 2, name: 'Departamento' },
    { id: 3, name: 'Terreno' },
    { id: 4, name: 'Oficina' },
  ];

  const STATUSES = [
    { id: 1, name: 'Venta' },
    { id: 2, name: 'Alquiler' },
  ];

  export default function PropertiesSearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const typeId   = searchParams.get('typeId')   ? Number(searchParams.get('typeId'))   : undefined;
    const statusId = searchParams.get('statusId') ? Number(searchParams.get('statusId')) : undefined;
    const cityId   = searchParams.get('cityId')   ? Number(searchParams.get('cityId'))   : undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

    const { data: allProperties, isLoading } = usePublicProperties({
      typeId,
      statusId,
      cityId,
      isDraft: false,
    });

    // Client-side price filter
    const properties = useMemo(() => {
      return allProperties.filter((p) => {
        if (!p.totalPrice) return true;
        const price = parseFloat(p.totalPrice);
        if (minPrice !== undefined && price < minPrice) return false;
        if (maxPrice !== undefined && price > maxPrice) return false;
        return true;
      });
    }, [allProperties, minPrice, maxPrice]);

    const setFilter = (key: string, value: string | undefined) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      });
    };

    const clearFilters = () => setSearchParams({});

    const hasFilters = typeId || statusId || cityId || minPrice || maxPrice;

    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filter bar */}
        <div className="flex flex-wrap gap-2 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 sticky top-14 z-10">
          {/* Type */}
          <select
            value={typeId ?? ''}
            onChange={(e) => setFilter('typeId', e.target.value || undefined)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#f97316]"
          >
            <option value="">Tipo</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          {/* Status */}
          <select
            value={statusId ?? ''}
            onChange={(e) => setFilter('statusId', e.target.value || undefined)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#f97316]"
          >
            <option value="">Estado</option>
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Price range */}
          <input
            type="number"
            placeholder="Precio mín"
            value={minPrice ?? ''}
            onChange={(e) => setFilter('minPrice', e.target.value || undefined)}
            className="w-32 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#f97316]"
          />
          <input
            type="number"
            placeholder="Precio máx"
            value={maxPrice ?? ''}
            onChange={(e) => setFilter('maxPrice', e.target.value || undefined)}
            className="w-32 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#f97316]"
          />

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-400 hover:text-gray-600 underline ml-auto"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Results count */}
        {!isLoading && (
          <p className="text-sm text-gray-500 mb-4">
            {properties.length} {properties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
          </p>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🏠</p>
            <p className="text-base font-medium text-gray-600">No se encontraron propiedades</p>
            <p className="text-sm mt-1">Probá con otros filtros</p>
            {hasFilters && (
              <button onClick={clearFilters} className="mt-4 text-sm text-[#f97316] underline">
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {properties.map((p) => (
              <Link key={p.id} to={`/properties/${p.id}`} className="block hover:scale-[1.01] transition-transform">
                <PropertyCard property={p} />
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }
  ```

- [ ] **Step 2: Add the route in `AppRouter.tsx`**

  Import and add inside the `<Route element={<PublicLayout />}>` block:
  ```tsx
  import PropertiesSearchPage from "../../public/pages/PropertiesSearchPage";
  // ...
  <Route path="/properties" element={<PropertiesSearchPage />} />
  ```

- [ ] **Step 3: Verify — navigate to `http://localhost:5173/properties`, confirm filter dropdowns and card grid work. Test "Limpiar filtros" button.**

- [ ] **Step 4: Commit**

  ```bash
  git add apps/web/src/public/pages/PropertiesSearchPage.tsx \
          apps/web/src/auth/router/AppRouter.tsx
  git commit -m "feat: add PropertiesSearchPage with filter bar and results grid"
  ```

---

## Task 8: PropertyDetailPage

**Files:**
- Create: `src/public/pages/PropertyDetailPage.tsx`

- [ ] **Step 1: Create `src/public/pages/PropertyDetailPage.tsx`**

  ```tsx
  import { useParams, Link } from 'react-router-dom';
  import { useEffect, useState } from 'react';
  import { publicPropertiesService } from '../services/publicProperties.service';
  import { publicAgentsService } from '../services/publicAgents.service';
  import type { Property } from '../../features/properties/types/property.types';
  import type { PublicAgent } from '../types/agent.types';
  import PropertyGallery from '../components/PropertyGallery';
  import ContactButtons from '../components/ContactButtons';

  function formatPrice(price?: string, currencyCode?: string) {
    if (!price) return null;
    const num = parseFloat(price);
    if (isNaN(num)) return null;
    return `${currencyCode ?? 'USD'} ${num.toLocaleString('es-AR')}`;
  }

  export default function PropertyDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [property, setProperty] = useState<Property | null>(null);
    const [agent, setAgent] = useState<PublicAgent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if (!id) return;
      setIsLoading(true);

      publicPropertiesService
        .getById(id)
        .then(async (prop) => {
          setProperty(prop);
          if (prop.agentId) {
            const ag = await publicAgentsService.getById(prop.agentId).catch(() => undefined);
            setAgent(ag ?? null);
          }
          setIsLoading(false);
        })
        .catch((err: Error) => {
          setError(err?.message ?? 'No se pudo cargar la propiedad.');
          setIsLoading(false);
        });
    }, [id]);

    if (isLoading) return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center text-gray-400">Cargando...</div>
    );

    if (error || !property) return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 mb-4">{error ?? 'Propiedad no encontrada.'}</p>
        <Link to="/properties" className="text-[#f97316] underline text-sm">← Volver a propiedades</Link>
      </div>
    );

    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-4">
          <Link to="/properties" className="hover:text-gray-600">Propiedades</Link>
          <span className="mx-1">/</span>
          <span className="text-gray-600">{property.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Left column ── */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Gallery */}
            <PropertyGallery media={property.media ?? []} title={property.title} />

            {/* Title + address */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
                {property.status && (
                  <span className="shrink-0 text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                    {property.status.name}
                  </span>
                )}
              </div>
              {property.address && (
                <p className="text-sm text-gray-500 mt-1">📍 {property.address}</p>
              )}
            </div>

            {/* Price */}
            {property.totalPrice && (
              <p className="text-3xl font-bold text-gray-900">
                {formatPrice(property.totalPrice, property.currency?.code)}
              </p>
            )}

            {/* Specs grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.bedrooms != null && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">🛏 {property.bedrooms} habitaciones</div>
              )}
              {property.bathrooms != null && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">🚿 {property.bathrooms} baños</div>
              )}
              {property.areaM2 && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">📐 {property.areaM2} m² totales</div>
              )}
              {property.builtAreaM2 && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">🏗 {property.builtAreaM2} m² cubiertos</div>
              )}
              {property.parking != null && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">🚗 {property.parking} cochera(s)</div>
              )}
              {property.suites != null && property.suites > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">🌟 {property.suites} suite(s)</div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-2">Descripción</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{property.description}</p>
              </div>
            )}
          </div>

          {/* ── Right column (sticky sidebar) ── */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-20 flex flex-col gap-4">
              {/* Agent card */}
              {agent && (
                <div className="border border-gray-100 rounded-xl p-4 flex flex-col items-center text-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-orange-50 text-[#f97316] text-lg font-bold flex items-center justify-center">
                    {agent.firstName[0]}{agent.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{agent.firstName} {agent.lastName}</p>
                    <p className="text-xs text-gray-400">Agente</p>
                  </div>
                  <Link to={`/agents/${agent.id}`} className="text-xs text-[#f97316] hover:underline">
                    Ver perfil →
                  </Link>
                </div>
              )}

              {/* Contact buttons */}
              {agent && <ContactButtons agent={agent} />}
            </div>
          </div>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Add the route in `AppRouter.tsx`**

  Import and add inside `<Route element={<PublicLayout />}>`:
  ```tsx
  import PropertyDetailPage from "../../public/pages/PropertyDetailPage";
  // ...
  <Route path="/properties/:id" element={<PropertyDetailPage />} />
  ```

- [ ] **Step 3: Verify — click a property card from the home page or `/properties`, confirm the detail page loads with gallery and contact buttons.**

- [ ] **Step 4: Commit**

  ```bash
  git add apps/web/src/public/pages/PropertyDetailPage.tsx \
          apps/web/src/auth/router/AppRouter.tsx
  git commit -m "feat: add PropertyDetailPage with gallery, specs, and contact sidebar"
  ```

---

## Task 9: AgentsPage and AgentListingsPage

**Files:**
- Create: `src/public/pages/AgentsPage.tsx`
- Create: `src/public/pages/AgentListingsPage.tsx`

- [ ] **Step 1: Create `src/public/pages/AgentsPage.tsx`**

  ```tsx
  import AgentCard from '../components/AgentCard';
  import { usePublicAgents } from '../hooks/usePublicAgents';
  import { usePublicProperties } from '../hooks/usePublicProperties';

  export default function AgentsPage() {
    const { data: agents, isLoading } = usePublicAgents();
    const { data: properties } = usePublicProperties({ isDraft: false });

    if (isLoading) return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center text-gray-400">Cargando...</div>
    );

    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nuestro equipo</h1>
        <p className="text-sm text-gray-500 mb-8">Conocé a los agentes de Century 21</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              propertyCount={properties.filter((p) => p.agentId === agent.id).length}
            />
          ))}
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Create `src/public/pages/AgentListingsPage.tsx`**

  ```tsx
  import { useParams, Link } from 'react-router-dom';
  import { PropertyCard, PropertyCardSkeleton } from '../../features/properties/components/PropertyCard';
  import ContactButtons from '../components/ContactButtons';
  import { usePublicAgent } from '../hooks/usePublicAgents';
  import { usePublicProperties } from '../hooks/usePublicProperties';

  export default function AgentListingsPage() {
    const { id } = useParams<{ id: string }>();

    const { data: agent, isLoading: agentLoading } = usePublicAgent(id ?? '');
    const { data: properties, isLoading: propsLoading } = usePublicProperties({
      agentId: id,
      isDraft: false,
    });

    if (agentLoading) return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center text-gray-400">Cargando...</div>
    );

    if (!agent) return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 mb-4">Agente no encontrado.</p>
        <Link to="/agents" className="text-[#f97316] underline text-sm">← Volver a agentes</Link>
      </div>
    );

    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Agent header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-8 border-b border-gray-100 mb-8">
          <div className="w-16 h-16 rounded-full bg-orange-50 text-[#f97316] text-xl font-bold flex items-center justify-center shrink-0">
            {agent.firstName[0]}{agent.lastName[0]}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{agent.firstName} {agent.lastName}</h1>
            <p className="text-sm text-gray-400 mt-0.5">Agente · {properties.length} propiedades</p>
          </div>
          <div className="w-full sm:w-56">
            <ContactButtons agent={agent} />
          </div>
        </div>

        {/* Their listings */}
        {propsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-3xl mb-3">🏠</p>
            <p className="text-sm">Este agente aún no tiene propiedades publicadas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {properties.map((p) => (
              <Link key={p.id} to={`/properties/${p.id}`} className="block hover:scale-[1.01] transition-transform">
                <PropertyCard property={p} />
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }
  ```

- [ ] **Step 3: Add both routes in `AppRouter.tsx`**

  Import and add inside `<Route element={<PublicLayout />}>`:
  ```tsx
  import AgentsPage from "../../public/pages/AgentsPage";
  import AgentListingsPage from "../../public/pages/AgentListingsPage";
  // ...
  <Route path="/agents" element={<AgentsPage />} />
  <Route path="/agents/:id" element={<AgentListingsPage />} />
  ```

  The final `<Route element={<PublicLayout />}>` block should look like:
  ```tsx
  <Route element={<PublicLayout />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/properties" element={<PropertiesSearchPage />} />
    <Route path="/properties/:id" element={<PropertyDetailPage />} />
    <Route path="/agents" element={<AgentsPage />} />
    <Route path="/agents/:id" element={<AgentListingsPage />} />
  </Route>
  ```

- [ ] **Step 4: Verify — navigate to `http://localhost:5173/agents`, click an agent card, confirm their listings page loads.**

- [ ] **Step 5: Commit**

  ```bash
  git add apps/web/src/public/pages/AgentsPage.tsx \
          apps/web/src/public/pages/AgentListingsPage.tsx \
          apps/web/src/auth/router/AppRouter.tsx
  git commit -m "feat: add AgentsPage and AgentListingsPage"
  ```

---

## Task 10: Final wiring and smoke-test

- [ ] **Step 1: Run TypeScript check**

  ```bash
  cd apps/web && npx tsc --noEmit
  ```
  Expected: no errors. Fix any type errors before continuing.

- [ ] **Step 2: Run ESLint**

  ```bash
  npm run lint
  ```
  Expected: no errors.

- [ ] **Step 3: Full manual smoke-test**

  | Action | Expected |
  |---|---|
  | Visit `/` | Hero + stats + 6 featured properties + 4 agent cards |
  | Click "Ver todas →" on featured | Lands on `/properties` |
  | Change "Tipo" dropdown | Grid updates |
  | Click a property card | Lands on `/properties/:id` with gallery and contact buttons |
  | Click "Ver perfil →" on agent | Lands on `/agents/:id` |
  | Visit `/agents` | Grid of all agents |
  | Click agent card | Lands on `/agents/:id` with their listings |
  | Visit `/login` and log in | Redirects to `/admin/dashboard` |
  | In admin, check nav links | All point to `/admin/*` |
  | Visit unknown URL `/foo` | Redirects to `/` |

- [ ] **Step 4: Commit any lint/type fixes**

  ```bash
  git add -p
  git commit -m "fix: resolve TypeScript and lint issues"
  ```
