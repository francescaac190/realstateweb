import { apiClient } from '../../../lib/apiClient';

export interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export const usersService = {
  listAgents: (): Promise<Agent[]> =>
    apiClient.get<Agent[]>('/users').then((r) => r.data),
};
