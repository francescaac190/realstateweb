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
