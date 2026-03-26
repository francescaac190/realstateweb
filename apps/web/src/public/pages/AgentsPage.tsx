import AgentCard from "../components/AgentCard";
import { usePublicAgents } from "../hooks/usePublicAgents";
import { usePublicProperties } from "../hooks/usePublicProperties";

export default function AgentsPage() {
  const { data: agents, isLoading } = usePublicAgents();
  const { data: properties } = usePublicProperties({ isDraft: false });

  if (isLoading)
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center text-gray-400">
        Cargando...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Nuestro equipo</h1>
      <p className="text-sm text-gray-500 mb-8">
        Conocé a los agentes de Century 21
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            propertyCount={
              properties.filter((p) => p.agentId === agent.id).length
            }
          />
        ))}
      </div>
    </div>
  );
}
