import type { PublicAgent } from '../types/agent.types';
import { MOCK_AGENTS } from '../types/agent.types';
import { publicApiClient } from '../lib/publicApiClient';
import type { Property } from '../../features/properties/types/property.types';

// TODO: replace mock with publicApiClient.get('/users') once endpoint exists
export const publicAgentsService = {
  getAll: (): Promise<PublicAgent[]> =>
    Promise.resolve(MOCK_AGENTS),

  getById: (id: string): Promise<PublicAgent | undefined> =>
    Promise.resolve(MOCK_AGENTS.find((a) => a.id === id)),

  getProperties: (agentId: string): Promise<Property[]> =>
    publicApiClient
      .get<Property[]>(`/users/${agentId}/properties`)
      .then((r) => r.data),
};
