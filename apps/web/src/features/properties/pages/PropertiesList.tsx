import { useNavigate } from 'react-router-dom';
import { PropertyCard, PropertyCardSkeleton } from '../components/PropertyCard';
import { useAgentProperties } from '../hooks/useAgentProperties';
import { useMe } from '../../../auth/hooks/useMe';

const SKELETON_COUNT = 6;

export default function PropertiesList() {
  const navigate = useNavigate();
  const { me, isLoading: meLoading } = useMe();
  const { data: properties, isLoading: propsLoading, error } = useAgentProperties(me?.id ?? null);

  const isLoading = meLoading || propsLoading;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Mis propiedades</h2>
        <button
          type="button"
          onClick={() => navigate('/admin/properties/new')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f97316] hover:bg-[#ea6c0a] text-white text-sm font-semibold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva propiedad
        </button>
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
          No tenés propiedades asignadas.
        </div>
      )}
    </div>
  );
}
