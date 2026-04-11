import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

export const renderRating = (rating: number, max = 5, showRatingNumber: boolean = true) => (
  <div className='flex items-center gap-1'>
    {Array.from({ length: max }, (_, i) => (
      <Star
        key={i}
        className={cn(
          i < Math.floor(rating) ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-muted-foreground',
          'w-4 h-4'
        )}
      />
    ))}
    {showRatingNumber && <p className='font-bold ml-2'>{rating.toFixed(1)}</p>}
  </div>
);
