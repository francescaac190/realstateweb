import type { PublicAgent } from '../types/agent.types';
import { MOCK_AGENTS } from '../types/agent.types';

// TODO: replace mock with publicApiClient.get('/users') once endpoint exists
export const publicAgentsService = {
  getAll: (): Promise<PublicAgent[]> =>
    Promise.resolve(MOCK_AGENTS),

  getById: (id: string): Promise<PublicAgent | undefined> =>
    Promise.resolve(MOCK_AGENTS.find((a) => a.id === id)),
};
