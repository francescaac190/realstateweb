import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMe } from "../../../auth/hooks/useMe";
import { apiClient } from "../../../lib/apiClient";
import {
  usePropertyTypes,
  usePropertyStatuses,
  useCurrencies,
  useCities,
  useZones,
} from "../hooks/useCatalog";

function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">
      {title}
    </h3>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 bg-white transition-[border-color,box-shadow] focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316]";

const selectCls =
  "w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white transition-[border-color,box-shadow] focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] disabled:bg-gray-50 disabled:text-gray-400";

function Select({
  value,
  onChange,
  disabled,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder: string;
  options: { id: number; name: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={selectCls}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.id} value={String(o.id)}>
          {o.name}
        </option>
      ))}
    </select>
  );
}

interface FormState {
  title: string;
  description: string;
  typeId: string;
  statusId: string;
  currencyId: string;
  totalPrice: number;
  pricePerM2: number;
  cityId: string;
  zoneId: string;
  address: string;
  areaM2: number;
  builtAreaM2: number;
  frontM2: number;
  depthM2: number;
  bedrooms: string;
  bathrooms: string;
  suites: string;
  parking: string;
  isDraft: boolean;
}

const INITIAL: FormState = {
  title: "",
  description: "",
  typeId: "",
  statusId: "",
  currencyId: "",
  totalPrice: 0,
  pricePerM2: 0,
  cityId: "",
  zoneId: "",
  address: "",
  areaM2: 0,
  builtAreaM2: 0,
  frontM2: 0,
  depthM2: 0,
  bedrooms: "",
  bathrooms: "",
  suites: "",
  parking: "",
  isDraft: true,
};

export default function CreatePropertyPage() {
  const navigate = useNavigate();
  const { me } = useMe();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: types, isLoading: typesLoading } = usePropertyTypes();
  const { data: statuses, isLoading: statusesLoading } = usePropertyStatuses();
  const { data: currencies, isLoading: currenciesLoading } = useCurrencies();
  const { data: cities, isLoading: citiesLoading } = useCities();
  const { data: zones, isLoading: zonesLoading } = useZones(
    form.cityId ? Number(form.cityId) : undefined,
  );

  function set(key: keyof FormState, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleCityChange(cityId: string) {
    setForm((f) => ({ ...f, cityId, zoneId: "" }));
  }

  function addFiles(files: FileList | null) {
    if (!files) return;
    const valid = Array.from(files).filter((f) =>
      ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(f.type),
    );
    setImageFiles((prev) => [...prev, ...valid]);
    setPreviews((prev) => [
      ...prev,
      ...valid.map((f) => URL.createObjectURL(f)),
    ]);
  }

  function removeImage(index: number) {
    URL.revokeObjectURL(previews[index]);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("El título es obligatorio.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const fd = new FormData();

      // Text / ID fields — only append when non-empty
      fd.append("title", form.title.trim());
      if (form.description.trim()) fd.append("description", form.description.trim());
      if (form.typeId) fd.append("typeId", form.typeId);
      if (form.statusId) fd.append("statusId", form.statusId);
      if (form.currencyId) fd.append("currencyId", form.currencyId);
      if (form.totalPrice) fd.append("totalPrice", String(form.totalPrice));
      if (form.pricePerM2) fd.append("pricePerM2", String(form.pricePerM2));
      if (form.cityId) fd.append("cityId", form.cityId);
      if (form.zoneId) fd.append("zoneId", form.zoneId);
      if (form.address.trim()) fd.append("address", form.address.trim());
      if (form.areaM2) fd.append("areaM2", String(form.areaM2));
      if (form.builtAreaM2) fd.append("builtAreaM2", String(form.builtAreaM2));
      if (form.frontM2) fd.append("frontM2", String(form.frontM2));
      if (form.depthM2) fd.append("depthM2", String(form.depthM2));
      if (form.bedrooms) fd.append("bedrooms", form.bedrooms);
      if (form.bathrooms) fd.append("bathrooms", form.bathrooms);
      if (form.suites) fd.append("suites", form.suites);
      if (form.parking) fd.append("parking", form.parking);
      fd.append("isDraft", String(form.isDraft));
      if (me?.id) fd.append("agentId", me.id);

      // Image files — multer reads them under the key "images"
      imageFiles.forEach((file) => fd.append("images", file));

      await apiClient.post("/properties", fd);
      navigate("/admin/properties");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Error al crear la propiedad.";
      setError(msg);
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => navigate("/admin/properties")}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
          aria-label="Volver"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Nueva propiedad
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Completá los datos de la propiedad
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información básica */}
        <div>
          <SectionHeader title="Información básica" />
          <div className="space-y-4">
            <Field label="Título *">
              <input
                className={inputCls}
                placeholder="Ej. Casa en barrio privado con piscina"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                required
              />
            </Field>
            <Field label="Descripción">
              <textarea
                className={`${inputCls} resize-none`}
                rows={4}
                placeholder="Descripción detallada de la propiedad..."
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </Field>

            {/* Draft / Published toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Estado de publicación
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {form.isDraft
                    ? "Borrador — solo visible para vos"
                    : "Publicada — visible en el sitio público"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => set("isDraft", !form.isDraft)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#f97316]/50 ${
                  form.isDraft ? "bg-gray-300" : "bg-[#f97316]"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${
                    form.isDraft ? "translate-x-1" : "translate-x-6"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Clasificación */}
        <div>
          <SectionHeader title="Clasificación" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tipo de propiedad">
              <Select
                value={form.typeId}
                onChange={(v) => set("typeId", v)}
                placeholder={typesLoading ? "Cargando..." : "Seleccionar tipo"}
                options={types}
                disabled={typesLoading}
              />
            </Field>
            <Field label="Estado de la propiedad">
              <Select
                value={form.statusId}
                onChange={(v) => set("statusId", v)}
                placeholder={
                  statusesLoading ? "Cargando..." : "Seleccionar estado"
                }
                options={statuses}
                disabled={statusesLoading}
              />
            </Field>
          </div>
        </div>

        {/* Precio */}
        <div>
          <SectionHeader title="Precio" />
          <div className="grid grid-cols-3 gap-4">
            <Field label="Moneda">
              <Select
                value={form.currencyId}
                onChange={(v) => set("currencyId", v)}
                placeholder={currenciesLoading ? "Cargando..." : "Moneda"}
                options={currencies}
                disabled={currenciesLoading}
              />
            </Field>
            <Field label="Precio total">
              <input
                className={inputCls}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.totalPrice}
                onChange={(e) => set("totalPrice", e.target.value)}
              />
            </Field>
            <Field label="Precio por m²">
              <input
                className={inputCls}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.pricePerM2}
                onChange={(e) => set("pricePerM2", e.target.value)}
              />
            </Field>
          </div>
        </div>

        {/* Ubicación */}
        <div>
          <SectionHeader title="Ubicación" />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Ciudad">
                <Select
                  value={form.cityId}
                  onChange={handleCityChange}
                  placeholder={
                    citiesLoading ? "Cargando..." : "Seleccionar ciudad"
                  }
                  options={cities}
                  disabled={citiesLoading}
                />
              </Field>
              <Field label="Zona / Barrio">
                <Select
                  value={form.zoneId}
                  onChange={(v) => set("zoneId", v)}
                  placeholder={
                    !form.cityId
                      ? "Seleccioná una ciudad primero"
                      : zonesLoading
                        ? "Cargando..."
                        : zones.length === 0
                          ? "Sin zonas disponibles"
                          : "Seleccionar zona"
                  }
                  options={zones}
                  disabled={!form.cityId || zonesLoading}
                />
              </Field>
            </div>
            <Field label="Dirección">
              <input
                className={inputCls}
                placeholder="Ej. Av. Siempre Viva 742"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
              />
            </Field>
          </div>
        </div>

        {/* Medidas */}
        <div>
          <SectionHeader title="Medidas" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Superficie total (m²)">
              <input
                className={inputCls}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.areaM2}
                onChange={(e) => set("areaM2", e.target.value)}
              />
            </Field>
            <Field label="Superficie cubierta (m²)">
              <input
                className={inputCls}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.builtAreaM2}
                onChange={(e) => set("builtAreaM2", e.target.value)}
              />
            </Field>
            <Field label="Frente (m)">
              <input
                className={inputCls}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.frontM2}
                onChange={(e) => set("frontM2", e.target.value)}
              />
            </Field>
            <Field label="Fondo (m)">
              <input
                className={inputCls}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.depthM2}
                onChange={(e) => set("depthM2", e.target.value)}
              />
            </Field>
          </div>
        </div>

        {/* Ambientes */}
        <div>
          <SectionHeader title="Ambientes" />
          <div className="grid grid-cols-4 gap-4">
            {(
              [
                { key: "bedrooms", label: "Dormitorios" },
                { key: "bathrooms", label: "Baños" },
                { key: "suites", label: "Suites" },
                { key: "parking", label: "Cocheras" },
              ] as { key: keyof FormState; label: string }[]
            ).map(({ key, label }) => (
              <Field key={key} label={label}>
                <input
                  className={inputCls}
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={form[key] as string}
                  onChange={(e) => set(key, e.target.value)}
                />
              </Field>
            ))}
          </div>
        </div>

        {/* Fotos */}
        <div>
          <SectionHeader title="Fotos" />
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-2 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
              dragOver
                ? "border-[#f97316] bg-orange-50"
                : "border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium text-gray-600">
              Arrastrá imágenes aquí o <span className="text-[#f97316]">hacé clic para seleccionar</span>
            </p>
            <p className="text-xs text-gray-400">JPEG, PNG, WEBP, GIF · Máx. 10 MB por imagen</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />
          </div>

          {/* Previews */}
          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
              {previews.map((src, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden aspect-square bg-gray-100">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    aria-label="Eliminar imagen"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#f97316] text-white">
                      Principal
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate("/admin/properties")}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#f97316] hover:bg-[#ea6c0a] active:bg-[#c2410c] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#f97316]/50 focus:ring-offset-2"
          >
            {submitting && (
              <svg
                className="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            {submitting
              ? "Guardando..."
              : form.isDraft
                ? "Guardar borrador"
                : "Publicar propiedad"}
          </button>
        </div>
      </form>
    </div>
  );
}
