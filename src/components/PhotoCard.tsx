import { Link } from 'react-router-dom';
import type { PhotoListItem } from '../types';

interface PhotoCardProps {
  photo: PhotoListItem;
}

export function PhotoCard({ photo }: PhotoCardProps) {
  return (
    <Link
      to={`/photos/${photo.id}`}
      className="group block bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border hover:border-primary/20"
    >
      <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
        <img
          src={photo.image_url}
          alt={photo.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {photo.solved && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            已破解
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-text truncate group-hover:text-primary transition-colors">
          {photo.title}
        </h3>
        {photo.description && (
          <p className="text-sm text-text-light mt-1 line-clamp-2">
            {photo.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-3 text-xs text-text-light">
          <span>{photo.author.name}</span>
          <span>
            {photo.attempts_count} 次尝试
          </span>
        </div>
      </div>
    </Link>
  );
}
