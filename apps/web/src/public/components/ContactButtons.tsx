import type { PublicAgent } from '../types/agent.types';

interface Props {
  agent: PublicAgent;
}

export default function ContactButtons({ agent }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {agent.phone && (
        <a
          href={`https://wa.me/${agent.phone.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25d366] text-white text-sm font-semibold py-2.5 rounded-lg hover:brightness-95 transition-all"
        >
          💬 WhatsApp
        </a>
      )}
      {agent.phone && (
        <a
          href={`tel:${agent.phone}`}
          className="flex items-center justify-center gap-2 bg-[#f97316] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-orange-600 transition-colors"
        >
          📞 Llamar
        </a>
      )}
      {agent.email && (
        <a
          href={`mailto:${agent.email}`}
          className="flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ✉ Email
        </a>
      )}
    </div>
  );
}
