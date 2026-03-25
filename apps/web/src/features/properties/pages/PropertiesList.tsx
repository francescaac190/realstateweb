import { PropertyCard, PropertyCardSkeleton } from "../components/PropertyCard";
import { useProperties } from "../hooks/useProperties";

const SKELETON_COUNT = 6;

export default function PropertiesList() {
  const { data: properties, isLoading, error } = useProperties();

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 text-left">
        Propiedades
      </h2>

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
          No se encontraron propiedades.
        </div>
      )}
    </div>
  );
}
