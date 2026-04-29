# Estela Agentes

> App móvil para agentes inmobiliarios. Cartera, pipeline CRM, agenda y mensajería en una experiencia editorial premium.

Plataforma: **iOS · Android** · Stack: **React Native + Expo + TypeScript** · Arquitectura: **Modular por dominios + capa de entidades compartidas**

---

## Estado del proyecto

| Fase | Estado | Notas |
|------|--------|-------|
| 0 — Setup | ✅ Completa | Expo SDK 54, TS strict, paths, ESLint base. Husky/commitlint pendientes. |
| 1 — Cimientos | ✅ Completa | Theme, fuentes (Google Fonts), HTTP, Query, UI base, demo screen. |
| 2 — Auth | ⏳ Pendiente | Próxima. |
| 3+ | ⏳ Pendiente | — |

### Decisiones tomadas durante la implementación

- **Carpeta `src/app/` → `src/core/`** para evitar conflicto visual con la carpeta `app/` raíz que usa Expo Router. El alias `@app/*` resuelve a `./src/core/*`.
- **Sin `babel.config.js` ni `babel-plugin-module-resolver`**. Expo SDK 50+ resuelve los paths del `tsconfig.json` vía Metro nativamente. Habilitado con `experiments.tsconfigPaths: true` en `app.json`.
- **Fuentes vía Google Fonts** (`@expo-google-fonts/playfair-display` + `@expo-google-fonts/inter`) en lugar de TTF locales.
- **Sentry**: el código de inicialización se añadirá cuando haya DSN. Hasta entonces `EXPO_PUBLIC_SENTRY_DSN` queda opcional en la validación de Zod.

---

## Tabla de contenidos

1. [Visión general](#visión-general)
2. [Stack tecnológico](#stack-tecnológico)
3. [Arquitectura](#arquitectura)
4. [Roadmap de ejecución](#roadmap-de-ejecución)
5. [Convenciones de código](#convenciones-de-código)
6. [Variables de entorno](#variables-de-entorno)
7. [Comandos útiles](#comandos-útiles)
8. [Testing](#testing)
9. [Despliegue con EAS](#despliegue-con-eas)
10. [Definition of Done por feature](#definition-of-done-por-feature)

---

## Visión general

Estela es la herramienta diaria de un agente inmobiliario:

- **Inicio** — dashboard con cartera activa, eventos del día e inmuebles destacados.
- **Inmuebles** — listado y detalle de propiedades en cartera, con filtros por estado.
- **Pipeline** — tablero kanban tipo CRM con leads en fases (Nuevos · Calificando · Visitando · Negociando · Cerrados).
- **Agenda** — visitas, reuniones y llamadas.
- **Mensajes** — comunicación con clientes y equipo.

El diseño es deliberadamente editorial: tipografía serif para titulares, paleta crema con acentos dorados, fotografía protagonista. La arquitectura debe respetar esa identidad y sostenerla en producción sin degradarse.

---

## Stack tecnológico

### Núcleo

| Categoría             | Elección                            | Por qué                                                                                 |
| --------------------- | ----------------------------------- | --------------------------------------------------------------------------------------- |
| Framework             | **Expo SDK 55+** con Dev Builds     | Workflow moderno, EAS, OTA updates. No Expo Go porque vamos a usar librerías nativas.   |
| Lenguaje              | **TypeScript** estricto             | `strict: true`, `noUncheckedIndexedAccess: true`. Innegociable a largo plazo.           |
| Routing               | **Expo Router v4**                  | File-based, tipado de rutas, deep linking, layouts anidados.                            |
| Estado servidor       | **TanStack Query**                  | Cache, revalidación, optimistic updates, infinite scroll.                               |
| Estado UI local       | **Zustand**                         | Mínimo boilerplate. Solo para estado que no cabe en Query (filtros, drawer, selección). |
| Formularios           | **React Hook Form + Zod**           | Validación tipada extremo a extremo.                                                    |
| HTTP                  | **axios**                           | Interceptors limpios para auth + refresh token + error mapping.                         |
| Almacenamiento seguro | **expo-secure-store**               | Tokens y datos sensibles.                                                               |
| Cache local rápido    | **react-native-mmkv**               | ~30× más rápido que AsyncStorage, soporta cifrado.                                      |
| Imágenes              | **expo-image**                      | Cache automático, blurhash, transiciones. Crítico para el feed.                         |
| Listas                | **@shopify/flash-list**             | Mejor rendimiento que FlatList con celdas heterogéneas.                                 |
| Animación / gestos    | **Reanimated v3 + Gesture Handler** | Worklets en UI thread. Imprescindible para el kanban arrastrable.                       |
| Iconos                | **@expo/vector-icons**              | Suficiente, sin dependencias extra.                                                     |

### Calidad y operaciones

| Categoría                       | Elección                                                          |
| ------------------------------- | ----------------------------------------------------------------- |
| Errores en producción           | **Sentry** (`@sentry/react-native`)                               |
| Tests unitarios y de componente | **Jest + React Native Testing Library**                           |
| Tests de API mockeada           | **MSW** (Mock Service Worker)                                     |
| Tests E2E                       | **Maestro**                                                       |
| Linter                          | **ESLint + eslint-plugin-boundaries + eslint-plugin-react-hooks** |
| Formato                         | **Prettier**                                                      |
| Pre-commit                      | **Husky + lint-staged**                                           |
| Commits                         | **Commitlint** con Conventional Commits                           |
| Build y distribución            | **EAS Build + EAS Update**                                        |

### Lo que NO usamos (decisión consciente)

- **Librerías de UI tipo NativeBase, Tamagui, Gluestack** — el diseño editorial es muy específico, las librerías te empujan a estética genérica. Componentes a mano.
- **Redux** — innecesario. React Query + Zustand cubren todo.
- **AsyncStorage como cache principal** — MMKV es estrictamente superior.
- **Detox** — Maestro tiene mejor DX hoy.

---

## Arquitectura

### Principio rector

Tres capas con dependencia unidireccional:

```
modules → entities → shared
   │          │
   │          └── shared
   └── (NUNCA importa de otro module)
```

- **`shared`**: utilidades reutilizables sin lógica de negocio (UI base, theme, http, formatters).
- **`entities`**: modelos de dominio compartidos entre múltiples módulos (Property, Client, Event, User).
- **`modules`**: bounded contexts del negocio (auth, properties, clients, calendar, home, messages).

**Regla crítica:** un módulo nunca importa de otro módulo. Si Pipeline necesita mostrar un inmueble, importa `entities/property/PropertyCard`, no `modules/properties/...`. Esta única regla previene el 90% del spaghetti a 6 meses.

### Estructura de carpetas

```
src/
├── core/                    # alias @app/*  (renombrado para evitar choque con app/ de Expo Router)
│   ├── providers/           # QueryClient, Theme, GestureHandler
│   └── config/
│       ├── env.ts           # validado con Zod al arrancar
│       └── constants.ts
│
├── shared/
│   ├── ui/                  # Button, Card, Chip, Badge, Text, BottomSheet, Skeleton
│   ├── api/                 # http instance, interceptors, AppError
│   ├── lib/                 # formatters (€, m², fechas), helpers
│   ├── hooks/               # useDebounce, useKeyboard, useAppState
│   └── theme/               # tokens, ThemeProvider, useTheme
│
├── entities/
│   ├── property/            # Inmueble — usado por properties, home, pipeline, calendar
│   │   ├── types.ts
│   │   ├── schema.ts
│   │   ├── api.ts
│   │   ├── queries.ts
│   │   └── ui/
│   │       ├── PropertyCard.tsx
│   │       └── PropertyMiniCard.tsx
│   ├── client/              # Lead/Cliente — usado por clients, pipeline, calendar, messages
│   ├── event/               # Visita/reunión — usado por home, calendar, properties
│   └── user/                # Agente
│
└── modules/
    ├── auth/
    │   ├── api/
    │   ├── model/           # useAuthStore (zustand), useSession
    │   ├── lib/             # tokenStorage, schemas
    │   ├── ui/
    │   └── screens/
    │
    ├── properties/
    │   ├── list/            # PropertyListScreen + filtros
    │   ├── detail/          # PropertyDetailScreen + hero + stats
    │   ├── create/          # PropertyCreateScreen + form
    │   ├── send/            # acción "Enviar" del detalle
    │   └── index.ts         # barrel público
    │
    ├── clients/
    │   ├── list/
    │   ├── detail/
    │   ├── pipeline/        # el kanban
    │   └── index.ts
    │
    ├── calendar/
    │   ├── agenda/
    │   ├── create-event/
    │   └── index.ts
    │
    ├── home/
    │   ├── HomeScreen.tsx
    │   ├── PortfolioCard.tsx
    │   ├── TodayEvents.tsx
    │   └── HotListings.tsx
    │
    └── messages/
```

### Path aliases

En `tsconfig.json`:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": ".",
    "paths": {
      "@app/*": ["src/core/*"],
      "@shared/*": ["src/shared/*"],
      "@entities/*": ["src/entities/*"],
      "@modules/*": ["src/modules/*"]
    }
  }
}
```

No hace falta `babel.config.js`: Metro resuelve estos paths nativamente con `experiments.tsconfigPaths: true` en `app.json`.

### ESLint con boundaries

Configuración mínima del archivo `.eslintrc.cjs` para hacer cumplir las reglas:

```js
{
  plugins: ['boundaries'],
  settings: {
    'boundaries/elements': [
      { type: 'shared',   pattern: 'src/shared/*' },
      { type: 'entities', pattern: 'src/entities/*' },
      { type: 'modules',  pattern: 'src/modules/*' },
      { type: 'app',      pattern: 'src/app/*' },
    ],
  },
  rules: {
    'boundaries/element-types': ['error', {
      default: 'disallow',
      rules: [
        { from: 'shared',   allow: ['shared'] },
        { from: 'entities', allow: ['shared', 'entities'] },
        { from: 'modules',  allow: ['shared', 'entities'] },
        { from: 'app',      allow: ['shared', 'entities', 'modules'] },
      ],
    }],
  },
}
```

---

## Roadmap de ejecución

Plan dividido en 9 fases. Cada fase tiene **objetivo claro, deliverable concreto y checklist**. No avanzar a la siguiente sin completar la actual.

### Fase 0 — Setup del proyecto (Día 1, 2-3h)

**Objetivo:** repo arrancado, herramientas configuradas, primer commit.

```bash
npx create-expo-app@latest estela-agentes --template blank-typescript
cd estela-agentes
git init && git add . && git commit -m "chore: initial commit"
```

**Checklist:**

- [x] Proyecto creado con plantilla TypeScript
- [x] `tsconfig.json` con `strict: true`, `noUncheckedIndexedAccess: true` y path aliases (`@app`, `@shared`, `@entities`, `@modules`)
- [ ] ~~`babel.config.js` con module-resolver~~ — innecesario en Expo SDK 50+; usamos `experiments.tsconfigPaths` en `app.json`
- [x] ESLint base instalado (`eslint-config-expo`)
- [ ] `eslint-plugin-boundaries` con reglas de capas — pendiente
- [ ] Husky + lint-staged + commitlint — pendiente
- [x] Estructura de carpetas creada (`src/core`, `src/shared`, `src/entities`, `src/modules`)
- [x] `.env.example` y validación con Zod en `src/core/config/env.ts`
- [x] README con plan completo
- [x] Primer commit limpio

**Salida:** repo con `npx expo start` arrancando una pantalla en blanco. Lint y typecheck pasando.

---

### Fase 1 — Cimientos (Día 2-3, 1-2 días)

**Objetivo:** sistema de diseño base + capa de red + providers globales. Antes de cualquier pantalla funcional.

#### 1.1 Theme y design system

- [x] `shared/theme/tokens.ts` — paleta carbón/ámbar/oro/crema, tipografía serif+sans, spacing, radius, shadows, motion
- [x] `shared/theme/ThemeProvider.tsx` + hook `useTheme()`
- [x] Carga de fuentes (Playfair Display + Inter) vía `@expo-google-fonts/*` y splash gating
- [x] Componentes base en `shared/ui/`:
  - [x] `Text` (variantes: `display`, `title`, `subtitle`, `body`, `bodyStrong`, `caption`, `overline`, `mono`)
  - [x] `Button` (variantes: `primary`, `secondary`, `ghost`, `destructive` · tamaños sm/md/lg · loading)
  - [x] `Card` (variantes flat/elevated/outlined/cream)
  - [x] `Chip` (selected, opcionalmente interactivo)
  - [x] `Badge` (neutral/accent/success/warning/danger)
  - [x] `Avatar` (con fallback de iniciales)
  - [x] `Skeleton` (animado con Reanimated v3)
  - [x] `EmptyState`

#### 1.2 Capa de red

- [x] `shared/api/http.ts` — instancia de axios con `baseURL`, `timeout`, headers
- [x] `shared/api/error.ts` — clase `AppError` tipada (`NETWORK | AUTH | VALIDATION | NOT_FOUND | SERVER | UNKNOWN`)
- [x] Interceptor de request (inyecta token mediante `setAuthTokenGetter`, listo para Fase 2)
- [x] Interceptor de response (mapea errores a `AppError` vía `AppError.fromStatus`)

#### 1.3 Providers globales

- [x] `core/providers/QueryProvider.tsx` con `QueryClient` (staleTime 30s, retry 2 salvo errores AUTH/VALIDATION/NOT_FOUND, `focusManager` cableado a `AppState`)
- [x] `ThemeProvider` cableado en `app/_layout.tsx`
- [x] `GestureHandlerRootView` en el root
- [x] `SafeAreaProvider`
- [ ] Sentry inicializado — pendiente hasta tener DSN

**Salida:** pantalla de prueba (`app/(tabs)/index.tsx`) que muestra todos los componentes base con la tipografía editorial y la paleta crema/ámbar.

---

### Fase 2 — Autenticación (Día 4-5, 1-2 días)

**Objetivo:** flujo completo de login/logout con persistencia segura. Es la primera prioridad porque todo lo demás depende de tener sesión.

#### Estructura

- [ ] `modules/auth/api/auth.api.ts` — `login`, `refresh`, `logout`, `me`
- [ ] `modules/auth/lib/tokenStorage.ts` — wrapper de `expo-secure-store`
- [ ] `modules/auth/model/auth.store.ts` — zustand store (user, status: `idle | authenticated | unauthenticated`)
- [ ] `modules/auth/model/useSession.ts` — hook que combina store + queries
- [ ] `modules/auth/ui/LoginForm.tsx` — react-hook-form + zod
- [ ] `modules/auth/screens/LoginScreen.tsx`

#### Refresh token

- [ ] Interceptor de axios refactorizado para hacer refresh automático en 401
- [ ] Cola de requests pendientes mientras se refresca
- [ ] Logout automático si refresh falla

#### Routing protegido

- [ ] Estructura de Expo Router:
  ```
  app/
  ├── _layout.tsx
  ├── (auth)/
  │   ├── _layout.tsx
  │   └── login.tsx
  └── (app)/
      ├── _layout.tsx       ← guard de sesión
      └── (tabs)/
          ├── _layout.tsx
          ├── index.tsx     ← Inicio (placeholder)
          ├── properties.tsx
          ├── pipeline.tsx
          ├── agenda.tsx
          └── messages.tsx
  ```
- [ ] Guard que hace `<Redirect href="/login" />` si no hay sesión
- [ ] Pantallas de tabs como placeholders

**Salida:** abrir app → login → entrar al área autenticada con tabs vacíos. Cerrar sesión vuelve a login. Token sobrevive a cierre de app.

---

### Fase 3 — Inmuebles, listado básico (Día 6-7, 1-2 días)

**Objetivo:** primer módulo de negocio funcionando end-to-end. **Momento de la verdad de la arquitectura**.

> Si esta fase fluye, el resto va rápido. Si te traba, antes de seguir descubre qué falta en los cimientos y arréglalo.

#### Entity: Property

- [ ] `entities/property/types.ts` — `Property`, `PropertyStatus`, `EnergyRating`, `Operation`
- [ ] `entities/property/schema.ts` — zod schema y `PropertyDTO`
- [ ] `entities/property/api.ts` — `propertyApi.list`, `propertyApi.byId`
- [ ] `entities/property/queries.ts` — `propertyKeys`, `usePropertyList`, `useProperty`
- [ ] `entities/property/ui/PropertyCard.tsx`

#### Módulo: properties/list

- [ ] `modules/properties/list/PropertyListScreen.tsx`
- [ ] FlashList con `estimatedItemSize`
- [ ] expo-image con blurhash placeholder
- [ ] Estados completos: loading (skeleton), error, vacío, data
- [ ] Pull-to-refresh
- [ ] Header con tabs de estado (Todos / Venta / Alquiler / Reservados)

**Salida:** pantalla "Mis inmuebles" pixel-perfecta contra el diseño, scrolleando datos del backend con buen rendimiento.

---

### Fase 4 — Inmuebles, completar módulo (3-5 días)

**Objetivo:** detalle, crear, editar, filtros avanzados, búsqueda.

- [ ] `modules/properties/detail/PropertyDetailScreen.tsx` con galería de fotos (carousel + zoom)
- [ ] `modules/properties/detail/PropertyHero.tsx`
- [ ] `modules/properties/detail/PropertyStats.tsx` (dormitorios, baños, m², terraza)
- [ ] Acciones: editar, compartir, marcar favorito
- [ ] `modules/properties/create/` — formulario completo con react-hook-form + zod
  - [ ] Subida de imágenes (`expo-image-picker`)
  - [ ] Selector de ubicación (mapa o autocompletado)
- [ ] `modules/properties/send/` — bottom sheet con plantillas de envío
- [ ] Filtros avanzados (`modules/properties/list/PropertyFilters.tsx`)
- [ ] Búsqueda con debounce

---

### Fase 5 — Home dashboard (2-3 días)

**Objetivo:** pantalla de inicio que compone entidades existentes. Validación de la regla "modules pueden importar entities".

- [ ] `modules/home/HomeScreen.tsx`
- [ ] `modules/home/PortfolioCard.tsx` (cartera activa con sparkline)
- [ ] `modules/home/TodayEvents.tsx` (importa `entities/event`)
- [ ] `modules/home/HotListings.tsx` (importa `entities/property`)
- [ ] Saludo con nombre de usuario
- [ ] Iconos de búsqueda y notificaciones en el header
- [ ] Pull-to-refresh agregado

---

### Fase 6 — Calendar / Agenda (3-4 días)

**Objetivo:** módulo de agenda con eventos del agente.

- [ ] Entity: `entities/event/` (types, schema, api, queries, EventRow)
- [ ] `modules/calendar/agenda/AgendaScreen.tsx`
- [ ] `modules/calendar/agenda/DayView.tsx`
- [ ] `modules/calendar/agenda/MonthView.tsx` (opcional fase 2)
- [ ] `modules/calendar/create-event/EventCreateScreen.tsx`
- [ ] Notificaciones locales (`expo-notifications`) para recordatorios

---

### Fase 7 — Clients y Pipeline (kanban) (5-7 días)

**Objetivo:** módulo más complejo. Dejar para cuando ya hay soltura con todo lo demás.

#### Entity: Client / Lead

- [ ] `entities/client/types.ts` — `Client`, `Lead`, `PipelineStage`
- [ ] `entities/client/api.ts`, `queries.ts`, `ClientCard.tsx`

#### Listado de clientes

- [ ] `modules/clients/list/ClientListScreen.tsx`
- [ ] `modules/clients/detail/ClientDetailScreen.tsx` (perfil, historial, propiedades de interés)

#### Pipeline kanban

- [ ] `modules/clients/pipeline/PipelineScreen.tsx`
- [ ] `modules/clients/pipeline/PipelineBoard.tsx` (scroll horizontal entre columnas)
- [ ] `modules/clients/pipeline/PipelineColumn.tsx`
- [ ] `modules/clients/pipeline/LeadCard.tsx` (con animación de entrada)
- [ ] **Drag & drop** entre columnas con Reanimated + Gesture Handler
- [ ] `modules/clients/pipeline/useMoveLeadMutation.ts` con optimistic update
- [ ] Filtros (por agente, por valor, por antigüedad)

> Esta fase es un mini-proyecto. Considera 1 semana como mínimo realista.

---

### Fase 8 — Mensajes (3-5 días)

**Objetivo:** depende del scope. Define primero si es notificaciones o chat real.

#### Variante simple (notificaciones)

- [ ] Lista de notificaciones del agente
- [ ] Marcar como leído
- [ ] Push notifications con `expo-notifications`

#### Variante completa (chat con clientes)

- [ ] Backend con sockets (Socket.IO o WebSocket nativo)
- [ ] Lista de threads
- [ ] Detalle de thread con mensajes
- [ ] Adjuntar archivos / fotos
- [ ] Indicador de "escribiendo"
- [ ] Estado de envío / entregado / leído

---

### Fase 9 — Pulido y producción (1-2 semanas)

**Objetivo:** preparar para tienda.

- [ ] Auditoría de performance (profiler de React DevTools, FPS en gestos)
- [ ] Optimización de imágenes (Cloudinary o backend con resize)
- [ ] Tests E2E con Maestro de los flujos críticos (login, crear inmueble, mover lead)
- [ ] Sentry probado con crashes intencionales
- [ ] Splash screen y app icon definitivos
- [ ] App Store Connect: metadata, screenshots, política de privacidad
- [ ] Google Play Console: ficha completa
- [ ] EAS Build de producción para iOS y Android
- [ ] EAS Submit a tiendas
- [ ] Configuración de OTA updates con `eas update`

---

## Convenciones de código

### Nombres

- **Carpetas**: `kebab-case` (`property-create`, `move-lead`)
- **Componentes**: `PascalCase` (`PropertyCard.tsx`)
- **Hooks**: `useCamelCase` (`useDebounce.ts`)
- **Stores**: `<dominio>.store.ts` (`auth.store.ts`)
- **Types**: `PascalCase` sin sufijo `I` ni `T`

### Imports

Orden: externos → `@app` → `@shared` → `@entities` → `@modules` → relativos. Configurado en ESLint con `import/order`.

### Barrel files

Solo en la **frontera pública** de cada module/entity. Nunca en sub-carpetas internas. Los barrels internos rompen tree-shaking y crean ciclos.

### Componentes

- Un componente por archivo
- Props tipadas con interface (no `React.FC`)
- Estilos co-localizados (no `StyleSheet.create` separados)
- Memoizar solo cuando hay re-renders medibles, no por defecto

### Queries

Convención de keys factory por entidad:

```ts
export const propertyKeys = {
  all: ["properties"] as const,
  list: (filters: PropertyFilters) =>
    [...propertyKeys.all, "list", filters] as const,
  detail: (id: string) => [...propertyKeys.all, "detail", id] as const,
};
```

### Commits

Conventional commits obligatorio:

```
feat(properties): add filters by status
fix(auth): handle expired refresh token
chore(deps): bump expo to 55.0.20
refactor(pipeline): extract drag logic to hook
```

---

## Variables de entorno

Validadas con Zod al arrancar. Si falta una, la app no arranca.

```env
EXPO_PUBLIC_API_URL=https://api.estela.example.com
EXPO_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
EXPO_PUBLIC_ENV=development
```

```ts
// src/app/config/env.ts
import { z } from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url(),
  EXPO_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  EXPO_PUBLIC_ENV: z.enum(["development", "staging", "production"]),
});

export const env = envSchema.parse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
  EXPO_PUBLIC_ENV: process.env.EXPO_PUBLIC_ENV,
});
```

---

## Comandos útiles

```bash
# Desarrollo
npx expo start                  # arranca el dev server
npx expo start --clear          # limpia caché de Metro
npx expo start --tunnel         # útil con redes restrictivas

# Builds nativos locales
npx expo prebuild               # genera /ios y /android
npx expo run:ios
npx expo run:android

# Calidad
pnpm typecheck                  # tsc --noEmit
pnpm lint                       # eslint
pnpm lint:fix
pnpm format                     # prettier --write
pnpm test                       # jest
pnpm test:watch

# E2E
maestro test .maestro/login.flow.yaml

# EAS
eas login
eas build:configure
eas build --platform ios --profile preview
eas build --platform android --profile production
eas update --branch production --message "fix: notification crash"
eas submit --platform ios --latest
```

---

## Testing

### Pirámide de tests

| Nivel                         | Cobertura objetivo                              | Herramientas      |
| ----------------------------- | ----------------------------------------------- | ----------------- |
| Unit (utils, hooks puros)     | 80%+                                            | Jest              |
| Componente                    | 60%+ en `shared/ui` y `entities/*/ui`           | Jest + RNTL       |
| Integración (módulos con MSW) | flujos críticos                                 | Jest + RNTL + MSW |
| E2E                           | login, crear inmueble, mover lead, crear evento | Maestro           |

### Convenciones

- Archivos `*.test.ts(x)` co-localizados junto al archivo testeado
- Un `describe` por archivo, un `it` por comportamiento
- Mocks de API con MSW en `src/shared/test/mocks/`
- No se hace snapshot testing salvo en componentes muy estables

---

## Despliegue con EAS

`eas.json` con tres perfiles:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "channel": "development"
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "channel": "production",
      "autoIncrement": true
    }
  }
}
```

### OTA updates

Cualquier cambio que NO toque dependencias nativas se puede liberar por OTA:

```bash
eas update --branch production --message "feat(home): show portfolio sparkline"
```

Cambios que **sí** requieren build nuevo:

- Nueva librería con código nativo
- Cambios en `app.json` (permisos, plugins)
- Bump de Expo SDK

### CI/CD (GitHub Actions sugerido)

- **Pull request** → typecheck + lint + tests
- **Merge a `main`** → EAS Build perfil `preview` + EAS Update branch `preview`
- **Tag `v*.*.*`** → EAS Build perfil `production` + EAS Submit

---

## Definition of Done por feature

Antes de marcar un feature como terminado, verificar:

- [ ] Funciona en iOS y Android (probado en device real, no solo simulador)
- [ ] Estados completos: loading, error, vacío, éxito
- [ ] Pull-to-refresh donde aplique
- [ ] Sin warnings en consola
- [ ] TypeScript sin `any`, sin `@ts-ignore`
- [ ] Lint y typecheck pasan
- [ ] Tests unitarios de la lógica clave
- [ ] Test de componente del happy path
- [ ] Acessibilidad mínima: `accessibilityLabel` en botones e inputs
- [ ] Funciona offline o degrada con mensaje claro
- [ ] Performance: 60 FPS en scroll y animaciones (validado con dev menu)
- [ ] PR con descripción, capturas y checklist
- [ ] Code review aprobada

---

## Próximos pasos inmediatos

1. Ejecutar **Fase 0** completa (setup del proyecto).
2. Pedir a Claude el código de **Fase 1** (theme + componentes base + http instance).
3. Implementar **Fase 2** (auth completo).
4. A partir de aquí, replicar el patrón con cada módulo.

> Mantén este README como documento vivo. Marca el progreso, ajusta lo que aprendas, anota decisiones tomadas en `docs/adr/` (Architecture Decision Records).

---

**Autor:** Francesca Antelo Callau
**Última revisión:** Abril 2026
