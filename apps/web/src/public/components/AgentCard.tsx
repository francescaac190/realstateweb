import { Link } from 'react-router-dom';
import type { PublicAgent } from '../types/agent.types';

interface Props {
  agent: PublicAgent;
  propertyCount?: number;
}

function getInitials(agent: PublicAgent) {
  return `${agent.firstName[0]}${agent.lastName[0]}`.toUpperCase();
}

export default function AgentCard({ agent, propertyCount }: Props) {
  return (
    <Link
      to={`/agents/${agent.id}`}
      className="flex flex-col items-center gap-3 p-5 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-gray-200 transition-all text-center"
    >
      {/* Avatar */}
      <div className="w-14 h-14 rounded-full bg-orange-50 text-[#f97316] text-lg font-bold flex items-center justify-center">
        {getInitials(agent)}
      </div>

      {/* Name */}
      <div>
        <p className="text-sm font-semibold text-gray-900">
          {agent.firstName} {agent.lastName}
        </p>
        {propertyCount !== undefined && (
          <p className="text-xs text-gray-400 mt-0.5">{propertyCount} propiedades</p>
        )}
      </div>

      <span className="text-xs text-[#f97316] font-medium border border-orange-200 rounded-full px-3 py-0.5">
        Ver propiedades →
      </span>
    </Link>
  );
}
