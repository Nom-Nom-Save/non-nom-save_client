import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';

interface MultiSelectPillsProps {
  options: { id: string; name: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
  emptyMessage: string;
  variant?: 'default' | 'danger';
}

export const MultiSelectPills = ({
  options,
  selected,
  onChange,
  placeholder,
  emptyMessage,
  variant = 'default',
}: MultiSelectPillsProps) => {
  const { t } = useTranslation();
  const pillClass =
    variant === 'danger' ? 'bg-orange-50 text-orange-700' : 'bg-brand-green-muted text-brand-green';
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };

  const handleRemove = (id: string) => {
    onChange(selected.filter(s => s !== id));
  };

  const selectedItems = options.filter(o => selected.includes(o.id));
  const availableItems = options.filter(o => !selected.includes(o.id));

  return (
    <div ref={containerRef} className='relative'>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center gap-2 flex-wrap min-h-[42px] rounded-xl border px-3 py-2 text-sm outline-none transition-colors bg-white cursor-pointer',
          'focus:ring-2 focus:ring-brand-green/30',
          isOpen ? 'border-brand-green ring-2 ring-brand-green/30' : 'border-border'
        )}
      >
        {selectedItems.length === 0 ? (
          <span className='text-foreground/40'>{placeholder}</span>
        ) : (
          selectedItems.map(item => (
            <span
              key={item.id}
              className={cn(
                'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold',
                pillClass
              )}
            >
              {item.name}
              <span
                role='button'
                tabIndex={0}
                onClick={e => {
                  e.stopPropagation();
                  handleRemove(item.id);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    handleRemove(item.id);
                  }
                }}
                className='hover:text-destructive transition-colors'
              >
                <X size={12} />
              </span>
            </span>
          ))
        )}
        <ChevronDown
          size={16}
          className={cn(
            'ml-auto shrink-0 text-foreground/40 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className='absolute z-50 mt-1 w-full rounded-xl border border-border bg-white shadow-lg max-h-[200px] overflow-y-auto'>
          {options.length === 0 ? (
            <p className='px-3 py-2.5 text-sm text-foreground/40'>{emptyMessage}</p>
          ) : availableItems.length === 0 ? (
            <p className='px-3 py-2.5 text-sm text-foreground/40'>{t(StringKey.ALL_SELECTED)}</p>
          ) : (
            availableItems.map(item => (
              <button
                key={item.id}
                type='button'
                onClick={() => handleToggle(item.id)}
                className='w-full text-left px-3 py-2 text-sm hover:bg-brand-green-muted/40 transition-colors cursor-pointer'
              >
                {item.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
