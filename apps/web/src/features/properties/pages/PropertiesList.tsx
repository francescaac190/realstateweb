import { useState } from 'react';
import { PropertyCard, PropertyCardSkeleton } from '../components/PropertyCard';
import { useProperties } from '../hooks/useProperties';
import { useAgentProperties } from '../hooks/useAgentProperties';
import { useAgents } from '../../users/hooks/useAgents';

const SKELETON_COUNT = 6;

export default function PropertiesList() {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const { agents } = useAgents();

  // When an agent is selected, use the dedicated /users/:id/properties endpoint.
  // Otherwise fall back to the full properties list.
  const all = useProperties();
  const byAgent = useAgentProperties(selectedAgentId);

  const { data: properties, isLoading, error } = selectedAgentId ? byAgent : all;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-xl font-semibold text-gray-900">Propiedades</h2>

        {/* Agent filter */}
        <select
          value={selectedAgentId ?? ''}
          onChange={(e) => setSelectedAgentId(e.target.value || null)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#f97316]"
        >
          <option value="">Todos los agentes</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.firstName} {a.lastName}
            </option>
          ))}
        </select>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))
          : properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
      </div>

      {/* Empty state */}
      {!isLoading && !error && properties.length === 0 && (
        <div className="text-center py-20 text-gray-400 text-sm">
          {selectedAgentId
            ? 'Este agente no tiene propiedades asignadas.'
            : 'No se encontraron propiedades.'}
        </div>
      )}
    </div>
  );
}
