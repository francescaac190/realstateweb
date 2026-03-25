import { apiClient } from "../../../lib/apiClient";
import type { Contact } from "../types/contact.types";

export const contactsService = {
  getAll: (): Promise<Contact[]> =>
    apiClient.get<Contact[]>("/contacts").then((r) => r.data),

  getById: (id: string): Promise<Contact> =>
    apiClient.get<Contact>(`/contacts/${id}`).then((r) => r.data),
};
