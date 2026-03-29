import { cn } from '@/lib/utils';
import type { EstablishmentResponse } from '@/types/establishments.types';
import useEmblaCarousel from 'embla-carousel-react';
import { Store } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type FC } from 'react';

interface EstablishmentsSliderProps {
  establishments: EstablishmentResponse[];
}

const getItemsPerPage = (width: number) => {
  if (width < 624) {
    return 1;
  }

  if (width < 1024) {
    return 2;
  }

  return 3;
};

const EstablishmentsSlider: FC<EstablishmentsSliderProps> = ({ establishments }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'keepSnaps',
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const dotsCount = Math.ceil(establishments.length / itemsPerPage);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setItemsPerPage(getItemsPerPage(width));
      emblaApi?.reInit();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [emblaApi]);

  const handleSelect = useCallback(() => {
    if (!emblaApi) {
      return;
    }

    const snapIndex = emblaApi.selectedScrollSnap();
    const lastPageStart = establishments.length - itemsPerPage;
    const pageIndex =
      snapIndex >= lastPageStart ? dotsCount - 1 : Math.floor(snapIndex / itemsPerPage);

    setSelectedIndex(pageIndex);
  }, [emblaApi, establishments.length, itemsPerPage, dotsCount]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const frame = requestAnimationFrame(handleSelect);

    emblaApi.on('select', handleSelect);
    emblaApi.on('reInit', handleSelect);

    return () => cancelAnimationFrame(frame);
  }, [emblaApi, handleSelect]);

  const scrollTo = useCallback(
    (pageIndex: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(pageIndex * itemsPerPage);
      }
    },
    [emblaApi, itemsPerPage]
  );

  const slideClass =
    itemsPerPage === 1
      ? 'flex-[0_0_100%]'
      : itemsPerPage === 2
        ? 'flex-[0_0_calc((100%-1rem)/2)]'
        : 'flex-[0_0_calc((100%-2rem)/3)]';

  return (
    <div ref={containerRef}>
      <div className='overflow-hidden' ref={emblaRef}>
        <div className='flex gap-4'>
          {establishments.map(establishment => (
            <div
              key={establishment.id}
              className={cn('min-w-0 bg-white rounded-4xl p-6', slideClass)}
            >
              {establishment.logo ? (
                <img className='mx-auto w-32 h-32 mb-4' src={`${establishment.logo}`} />
              ) : (
                <Store className='mx-auto w-32 h-32 mb-4' />
              )}
              <p className='font-bold text-xl font-playfair mb-2'>{establishment.name}</p>
              <p className='text-[#94A3B8] text-sm'>{establishment.address}</p>
              <p className='text-[#94A3B8]'>{establishment.description}</p>
            </div>
          ))}
        </div>
      </div>

      {dotsCount > 1 && (
        <div className='flex justify-center gap-2 mt-6'>
          {Array.from({ length: dotsCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                'rounded-full transition-all',
                selectedIndex === index ? 'h-2.5 w-2.5 bg-brand-green' : 'h-2 w-2 bg-[#C4C4C4]'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EstablishmentsSlider;
