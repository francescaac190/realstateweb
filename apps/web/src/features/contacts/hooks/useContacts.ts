import { useEffect, useState } from "react";
import type { Contact } from "../types/contact.types";
import { contactsService } from "../services/contacts.service";

interface UseContactsState {
  data: Contact[];
  isLoading: boolean;
  error: string | null;
}

export function useContacts() {
  const [state, setState] = useState<UseContactsState>({
    data: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    contactsService
      .getAll()
      .then((data) => {
        if (!cancelled) setState({ data, isLoading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled)
          setState({
            data: [],
            isLoading: false,
            error: err?.message ?? "Error al cargar los contactos.",
          });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
