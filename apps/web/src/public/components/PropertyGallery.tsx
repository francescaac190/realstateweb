import { useState } from 'react';
import type { PropertyMedia } from '../../features/properties/types/property.types';

const MAX_THUMBS = 4;

interface Props {
  media: PropertyMedia[];
  title: string;
}

export default function PropertyGallery({ media, title }: Props) {
  const images = media.filter((m) => m.type === 'IMAGE').sort((a, b) => a.order - b.order);
  const [activeIdx, setActiveIdx] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
        Sin imágenes
      </div>
    );
  }

  const visibleThumbs = images.slice(0, MAX_THUMBS);
  const extra = images.length - MAX_THUMBS;

  return (
    <div className="flex flex-col gap-2">
      {/* Main image */}
      <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
        <img
          src={images[activeIdx].url}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {visibleThumbs.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIdx(i)}
              className={`flex-1 aspect-video rounded-lg overflow-hidden border-2 transition-colors ${
                activeIdx === i ? 'border-[#f97316]' : 'border-transparent'
              }`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
          {extra > 0 && (
            <div className="flex-1 aspect-video rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
              +{extra}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
