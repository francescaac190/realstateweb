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
