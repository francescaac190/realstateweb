import { useContacts } from "../hooks/useContacts";
import { ContactCard } from "../components/ContactCard";

export default function ContactsList() {
  const { data: contacts, isLoading, error } = useContacts();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 text-left">
        Contactos
      </h2>

      {/* Error state */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* List */}
      <div className="flex flex-col gap-2">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-14 rounded-lg bg-gray-100 animate-pulse"
              />
            ))
          : contacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
      </div>

      {/* Empty state */}
      {!isLoading && !error && contacts.length === 0 && (
        <div className="text-center py-20 text-gray-400 text-sm">
          No se encontraron contactos.
        </div>
      )}
    </div>
  );
}
