import { PropertyCard, PropertyCardSkeleton } from '../components/PropertyCard';
import { useAgentProperties } from '../hooks/useAgentProperties';
import { useMe } from '../../../auth/hooks/useMe';

const SKELETON_COUNT = 6;

export default function PropertiesList() {
  const { me, isLoading: meLoading } = useMe();
  const { data: properties, isLoading: propsLoading, error } = useAgentProperties(me?.id ?? null);

  const isLoading = meLoading || propsLoading;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Mis propiedades</h2>
        {me && (
          <span className="text-sm text-gray-400">
            {me.firstName} {me.lastName}
          </span>
        )}
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
