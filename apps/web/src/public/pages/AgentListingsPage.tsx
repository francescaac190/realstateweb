import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PropertyCard, PropertyCardSkeleton } from '../../features/properties/components/PropertyCard';
import ContactButtons from '../components/ContactButtons';
import { usePublicAgent } from '../hooks/usePublicAgents';
import { publicAgentsService } from '../services/publicAgents.service';
import type { Property } from '../../features/properties/types/property.types';

export default function AgentListingsPage() {
  const { id } = useParams<{ id: string }>();

  const { data: agent, isLoading: agentLoading } = usePublicAgent(id ?? '');

  const [properties, setProperties] = useState<Property[]>([]);
  const [propsLoading, setPropsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setPropsLoading(true);
    publicAgentsService
      .getProperties(id)
      .then((data) => { setProperties(data); setPropsLoading(false); })
      .catch(() => setPropsLoading(false));
  }, [id]);

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
