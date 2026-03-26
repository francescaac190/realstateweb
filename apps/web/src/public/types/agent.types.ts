export interface PublicAgent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

// TODO: replace with real API call once GET /users is available on the backend
export const MOCK_AGENTS: PublicAgent[] = [
  { id: '1', firstName: 'María',  lastName: 'González', email: 'maria@c21.com',  phone: '+541112345678' },
  { id: '2', firstName: 'Carlos', lastName: 'Ruiz',     email: 'carlos@c21.com', phone: '+541187654321' },
  { id: '3', firstName: 'Ana',    lastName: 'Martínez', email: 'ana@c21.com' },
  { id: '4', firstName: 'Jorge',  lastName: 'López',    email: 'jorge@c21.com',  phone: '+541156789012' },
];
