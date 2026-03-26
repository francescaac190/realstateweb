import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { publicPropertiesService } from '../services/publicProperties.service';
import { publicAgentsService } from '../services/publicAgents.service';
import type { Property } from '../../features/properties/types/property.types';
import type { PublicAgent } from '../types/agent.types';
import PropertyGallery from '../components/PropertyGallery';
import ContactButtons from '../components/ContactButtons';

function formatPrice(price?: string, currencyCode?: string) {
  if (!price) return null;
  const num = parseFloat(price);
  if (isNaN(num)) return null;
  return `${currencyCode ?? 'USD'} ${num.toLocaleString('es-AR')}`;
}

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [agent, setAgent] = useState<PublicAgent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);

    publicPropertiesService
      .getById(id)
      .then(async (prop) => {
        setProperty(prop);
        if (prop.agentId) {
          const ag = await publicAgentsService.getById(prop.agentId).catch(() => undefined);
          setAgent(ag ?? null);
        }
        setIsLoading(false);
      })
      .catch((err: Error) => {
        setError(err?.message ?? 'No se pudo cargar la propiedad.');
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-center text-gray-400">Cargando...</div>
  );

  if (error || !property) return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-center">
      <p className="text-gray-500 mb-4">{error ?? 'Propiedad no encontrada.'}</p>
      <Link to="/properties" className="text-[#f97316] underline text-sm">← Volver a propiedades</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4">
        <Link to="/properties" className="hover:text-gray-600">Propiedades</Link>
        <span className="mx-1">/</span>
        <span className="text-gray-600">{property.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Left column ── */}
        <div className="flex-1 flex flex-col gap-6">
          <PropertyGallery media={property.media ?? []} title={property.title} />

          <div>
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
              {property.status && (
                <span className="shrink-0 text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                  {property.status.name}
                </span>
              )}
            </div>
            {property.address && (
              <p className="text-sm text-gray-500 mt-1">📍 {property.address}</p>
            )}
          </div>

          {property.totalPrice && (
            <p className="text-3xl font-bold text-gray-900">
              {formatPrice(property.totalPrice, property.currency?.code)}
            </p>
          )}

          {/* Specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {property.bedrooms != null && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">🛏 {property.bedrooms} habitaciones</div>
            )}
            {property.bathrooms != null && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">🚿 {property.bathrooms} baños</div>
            )}
            {property.areaM2 && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">📐 {property.areaM2} m² totales</div>
            )}
            {property.builtAreaM2 && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">🏗 {property.builtAreaM2} m² cubiertos</div>
            )}
            {property.parking != null && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">🚗 {property.parking} cochera(s)</div>
            )}
            {property.suites != null && property.suites > 0 && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">🌟 {property.suites} suite(s)</div>
            )}
          </div>

          {property.description && (
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-2">Descripción</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{property.description}</p>
            </div>
          )}
        </div>

        {/* ── Right column (sticky sidebar) ── */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="lg:sticky lg:top-20 flex flex-col gap-4">
            {agent && (
              <div className="border border-gray-100 rounded-xl p-4 flex flex-col items-center text-center gap-2">
                <div className="w-14 h-14 rounded-full bg-orange-50 text-[#f97316] text-lg font-bold flex items-center justify-center">
                  {agent.firstName[0]}{agent.lastName[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{agent.firstName} {agent.lastName}</p>
                  <p className="text-xs text-gray-400">Agente</p>
                </div>
                <Link to={`/agents/${agent.id}`} className="text-xs text-[#f97316] hover:underline">
                  Ver perfil →
                </Link>
              </div>
            )}
            {agent && <ContactButtons agent={agent} />}
          </div>
        </div>
      </div>
    </div>
  );
}
