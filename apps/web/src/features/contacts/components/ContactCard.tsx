import React from "react";
import type { Contact } from "../types/contact.types";

interface ContactCardProps {
  contact: Contact;
}

export function ContactCard({ contact }: ContactCardProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm flex-shrink-0">
          {contact.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{contact.name}</p>
          <p className="text-xs text-gray-500">{contact.email}</p>
        </div>
      </div>
      {contact.phone && (
        <span className="text-xs text-gray-400">{contact.phone}</span>
      )}
    </div>
  );
}
