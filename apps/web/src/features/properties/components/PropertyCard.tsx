import { Skeleton } from "../../../components/ui/Skeleton";
import type { Property } from "../types/property.types";

function formatPrice(price?: string, currencyCode?: string): string | null {
  if (!price) return null;
  const num = parseFloat(price);
  if (isNaN(num)) return null;
  return `${currencyCode ?? "$"} ${num.toLocaleString("es-AR")}`;
}

export function PropertyCard({ property }: { property: Property }) {
  const thumbnail =
    property.media?.find((m) => m.type === "IMAGE" && m.order === 0) ??
    property.media?.find((m) => m.type === "IMAGE");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="aspect-video bg-gray-100 overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail.url}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Sin imagen
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Title + status */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 flex-1">
            {property.title}
          </h3>
          {property.status && (
            <span className="shrink-0 text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium">
              {property.status.name}
            </span>
          )}
        </div>

        {/* Address */}
        {property.address && (
          <p className="text-xs text-gray-500 mb-2 truncate">{property.address}</p>
        )}

        {/* Price */}
        {property.totalPrice && (
          <p className="text-base font-bold text-gray-800 mb-3">
            {formatPrice(property.totalPrice, property.currency?.code)}
          </p>
        )}

        {/* Specs */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1">🛏 {property.bedrooms} hab.</span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1">🚿 {property.bathrooms} baños</span>
          )}
          {property.areaM2 && (
            <span className="flex items-center gap-1">📐 {property.areaM2} m²</span>
          )}
          {property.parking != null && (
            <span className="flex items-center gap-1">🚗 {property.parking}</span>
          )}
        </div>

        {/* Draft badge */}
        {property.isDraft && (
          <span className="mt-3 inline-block text-xs px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded-full">
            Borrador
          </span>
        )}
      </div>
    </div>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-1/3" />
        <div className="flex gap-3">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
    </div>
  );
}
