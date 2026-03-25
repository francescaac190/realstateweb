import { Link } from "react-router-dom";
import { Skeleton } from "../../../components/ui/Skeleton";
import { PropertyCard, PropertyCardSkeleton } from "../../properties/components/PropertyCard";
import { useProperties } from "../../properties/hooks/useProperties";
import { useAuth } from "../../../auth/hooks/useAuth";

// ── Icons ──────────────────────────────────────────────────────────────────

function IconBuilding() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconDraft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="12" y2="17" />
    </svg>
  );
}

function IconPhoto() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent?: string;
}

function StatCard({ label, value, icon, accent = "bg-orange-50 text-[#f97316]" }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 leading-none mb-1">{value}</p>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

// ── Quick action card ──────────────────────────────────────────────────────

interface QuickActionProps {
  label: string;
  description: string;
  to: string;
  icon: React.ReactNode;
}

function QuickAction({ label, description, to, icon }: QuickActionProps) {
  return (
    <Link
      to={to}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:border-orange-200 hover:shadow-md transition-all group"
    >
      <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#f97316] flex items-center justify-center shrink-0 group-hover:bg-[#f97316] group-hover:text-white transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-xs text-gray-400 truncate">{description}</p>
      </div>
      <span className="text-gray-300 group-hover:text-[#f97316] transition-colors">
        <IconArrow />
      </span>
    </Link>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user } = useAuth();
  const { data: properties, isLoading } = useProperties();

  const total     = properties.length;
  const published = properties.filter((p) => !p.isDraft).length;
  const drafts    = properties.filter((p) => p.isDraft).length;
  const withMedia = properties.filter((p) => (p.media?.length ?? 0) > 0).length;

  const recent = properties.slice(0, 4);

  const greeting = user ? `Hola, ${user.firstName}` : "Bienvenido";

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{greeting} 👋</h1>
        <p className="text-sm text-gray-500 mt-1">
          Aquí tienes un resumen de tu actividad.
        </p>
      </div>

      {/* Stats */}
      <section>
        <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
          Resumen
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard label="Total propiedades"  value={total}     icon={<IconBuilding />} />
              <StatCard label="Publicadas"          value={published} icon={<IconCheck />}   accent="bg-green-50 text-green-600" />
              <StatCard label="Borradores"          value={drafts}    icon={<IconDraft />}   accent="bg-yellow-50 text-yellow-600" />
              <StatCard label="Con fotos"           value={withMedia} icon={<IconPhoto />}   accent="bg-blue-50 text-blue-500" />
            </>
          )}
        </div>
      </section>

      {/* Recent properties */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Propiedades recientes
          </h2>
          <Link
            to="/properties"
            className="text-xs font-medium text-[#f97316] hover:underline flex items-center gap-1"
          >
            Ver todas <IconArrow />
          </Link>
        </div>

        {!isLoading && recent.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-sm text-gray-400">
            No hay propiedades aún.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <PropertyCardSkeleton key={i} />)
              : recent.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
          Acciones rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <QuickAction
            to="/properties/new"
            label="Nueva propiedad"
            description="Carga una propiedad al sistema"
            icon={<IconPlus />}
          />
          <QuickAction
            to="/properties"
            label="Ver propiedades"
            description="Gestiona el listado completo"
            icon={<IconBuilding />}
          />
          <QuickAction
            to="/leads"
            label="Ver leads"
            description="Revisa tus contactos y consultas"
            icon={<IconUsers />}
          />
        </div>
      </section>

    </div>
  );
}
