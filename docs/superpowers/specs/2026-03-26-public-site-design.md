# Public Site Design Spec
**Date:** 2026-03-26
**Project:** realstateweb / Century 21 public-facing website

---

## Overview

A multi-page public website where visitors can browse properties, search with filters, view property details with direct agent contact, and explore the agent team — no login required.

---

## Routing

### Before (current)
| Path | Component |
|---|---|
| `/login` | Login |
| `/dashboard` | Dashboard (private) |
| `/properties` | PropertiesList (private) |
| `/contacts` | ContactsList (private) |
| `*` | → `/login` |

### After
| Path | Component | Auth |
|---|---|---|
| `/` | HomePage | Public |
| `/properties` | PropertiesSearchPage | Public |
| `/properties/:id` | PropertyDetailPage | Public |
| `/agents` | AgentsPage | Public |
| `/agents/:id` | AgentListingsPage | Public |
| `/login` | Login | Public |
| `/admin/dashboard` | Dashboard | Private |
| `/admin/properties` | PropertiesList | Private |
| `/admin/contacts` | ContactsList | Private |
| `*` | → `/` | — |

Admin routes move from `/dashboard`, `/properties`, `/contacts` to `/admin/*`. The `SideDrawerMenu` nav links and `AppRouter` must be updated accordingly.

---

## Visual Style

**Clean white modern** — white background, subtle gray borders/surfaces, orange (`#f97316`) as the only accent color. Matches the feel of Zonaprop / modern real estate portals. Distinct from the admin's warm cream palette.

- Background: `white` / `#f9fafb`
- Borders: `#e5e7eb`
- Headings: `#111827`
- Body text: `#374151`, muted: `#6b7280`, subtle: `#9ca3af`
- Accent: `#f97316` (existing brand orange)
- Hero background: dark gradient (`#111827` → `#1f2937`)

---

## Shared: PublicLayout

Wraps all public pages. Contains:

- **Navbar**: Logo "C21 ·" left, nav links center (Propiedades, Agentes, Contacto), "Admin →" button right (links to `/admin/dashboard`)
- **`<Outlet />`**: page content
- **Footer**: Simple one-line copyright

---

## Pages

### 1. HomePage (`/`)

**Sections (top to bottom):**

1. **Hero** — dark gradient background, large headline ("Encontrá tu próxima propiedad"), prominent search bar with a "Buscar" button that navigates to `/properties?q=...`, quick-filter type tags below (Casas, Departamentos, Terrenos, Oficinas)
2. **Stats bar** — 3 numbers: total properties count, total agents count, years in business — all hardcoded initially (no dedicated stats endpoint)
3. **Featured listings** — heading "Propiedades destacadas" + "Ver todas →" link to `/properties`, 3-column grid of the 6 most recent non-draft properties using the existing `PropertyCard` component
4. **Agents preview** — heading "Nuestros agentes" + "Ver todos →" link to `/agents`, horizontal row of 4 agent cards (avatar placeholder, name, property count)

### 2. PropertiesSearchPage (`/properties`)

- **Filter bar** (sticky): text search input, dropdowns for Tipo (typeId), Estado (statusId), Ciudad (cityId), Precio range. "Aplicar filtros" button.
- URL search params drive the filters (e.g. `/properties?typeId=1&cityId=3`) so links are shareable.
- Results count line: "N propiedades encontradas"
- **3-column responsive grid** of `PropertyCard` components. Each card links to `/properties/:id`.
- Loading state uses existing `PropertyCardSkeleton`.
- Empty state: friendly message + "Limpiar filtros" button.

**Filters map to existing `PropertyFilters` type:** `cityId`, `typeId`, `statusId`. Price range is client-side filtered (min/max on `totalPrice`).

### 3. PropertyDetailPage (`/properties/:id`)

**Layout (two columns on desktop, stacked on mobile):**

**Left column (wider):**
- Breadcrumb: Propiedades / [title]
- Photo gallery: main image large, thumbnail strip below, "+N más" overflow badge
- Title, address (📍)
- Price + currency + status badge
- Specs grid (2-col): bedrooms, bathrooms, total area, built area, parking
- Full description text

**Right column (sidebar, sticky):**
- Agent card: avatar placeholder, name, "Agente" label, link to `/agents/:id`
- Contact buttons:
  - 💬 WhatsApp (opens `https://wa.me/{phone}` in new tab)
  - 📞 Llamar (opens `tel:{phone}`)
  - ✉ Email (opens `mailto:{email}`)
- Buttons are hidden individually if the agent has no phone/email

### 4. AgentsPage (`/agents`)

- Page heading "Nuestro equipo"
- **Responsive grid** (3 cols desktop, 2 tablet, 1 mobile) of agent cards
- Each agent card: avatar placeholder (initials fallback), name, property count ("N propiedades"), "Ver propiedades →" link to `/agents/:id`

### 5. AgentListingsPage (`/agents/:id`)

- **Agent header**: avatar, name, role, WhatsApp + Llamar buttons
- Below: same 3-column `PropertyCard` grid filtered by `agentId`, linking to `/properties/:id`

---

## Data / API

### Public API client

A new `publicApiClient` (no auth interceptors, no token refresh) hitting the same `VITE_API_URL`. The existing `apiClient` is for the admin only.

### Data needs per page

| Page | Endpoints needed |
|---|---|
| HomePage | `GET /properties?isDraft=false&limit=6` (featured), `GET /users` (agents) |
| PropertiesSearchPage | `GET /properties` with filters |
| PropertyDetailPage | `GET /properties/:id` |
| AgentsPage | `GET /users` (agents list) |
| AgentListingsPage | `GET /users/:id`, `GET /properties?agentId=:id` |

> **Note:** The backend may need to expose a public `/users` (agents) endpoint and ensure `/properties` works without an auth token. This is a backend task outside this spec's scope but must be resolved before the frontend can be connected to live data. The skeleton uses mock/placeholder data for agents until the endpoint exists.

---

## Component Structure

```
src/
  public/
    layout/
      PublicLayout.tsx          # Navbar + Outlet + Footer
      PublicNavbar.tsx
      PublicFooter.tsx
    pages/
      HomePage.tsx              # (already exists, replace stub)
      PropertiesSearchPage.tsx
      PropertyDetailPage.tsx
      AgentsPage.tsx
      AgentListingsPage.tsx
    components/
      HeroSearchBar.tsx         # Search bar + type tag chips
      AgentCard.tsx             # Used on AgentsPage and HomePage preview
      PropertyGallery.tsx       # Main image + thumbnail strip
      ContactButtons.tsx        # WhatsApp / Call / Email buttons
    hooks/
      usePublicProperties.ts    # Wraps publicApiClient, no auth
      usePublicAgents.ts
    services/
      publicProperties.service.ts
      publicAgents.service.ts
    lib/
      publicApiClient.ts        # Axios instance, no interceptors
```

Existing `PropertyCard` and `PropertyCardSkeleton` from `features/properties/components/PropertyCard.tsx` are reused as-is.

---

## Admin Route Migration

Changes required in `apps/web/src/`:

1. **`auth/router/AppRouter.tsx`** — change admin route paths from `/dashboard`, `/properties`, `/contacts` to `/admin/dashboard`, `/admin/properties`, `/admin/contacts`
2. **`components/SideDrawerMenu.tsx`** — update nav link hrefs to `/admin/*`
3. **`auth/router/AppRouter.tsx`** — fallback `*` redirects to `/` instead of `/login`
4. **`auth/pages/Login.tsx`** — after login, redirect to `/admin/dashboard`

---

## Out of Scope

- Map view for properties
- Favorites / saved listings (requires auth)
- Multi-language support
- SEO meta tags / Open Graph (can be added later)
- Backend changes (public endpoints, agent data) — tracked separately
