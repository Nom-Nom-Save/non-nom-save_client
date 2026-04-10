import * as React from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useEstablishmentsStore } from '@/store/establishments.store';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import type { FC } from 'react';

interface ProductTypeFilterProps {
  options: { id: string; name: string }[];
}

const ProductTypeFilter: FC<ProductTypeFilterProps> = ({ options }) => {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();
  const { productTypes, setProductTypes } = useEstablishmentsStore();

  const handleSelect = (id: string) => {
    const current = productTypes || [];
    const next = current.includes(id) ? current.filter(type => type !== id) : [...current, id];

    setProductTypes(next.length === 0 ? null : next);
  };

  const removeType = (id: string) => {
    const next = (productTypes || []).filter(type => type !== id);
    setProductTypes(next.length === 0 ? null : next);
  };

  return (
    <div className='flex flex-col gap-2'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-64 justify-between h-8 text-sm bg-background'
          >
            <span className='truncate'>
              {productTypes === null || productTypes.length === 0
                ? t(StringKey.ALL_TYPES) || 'All types'
                : `${t(StringKey.SELECTED)}: ${productTypes.length}`}
            </span>
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-64 p-0' align='start'>
          <Command>
            <CommandInput placeholder={`${t(StringKey.SEARCH_TYPE)}...`} className='h-8 text-sm' />
            <CommandList>
              <CommandEmpty>{t(StringKey.NO_TYPE_FOUND)}</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setProductTypes(null);
                    setOpen(false);
                  }}
                  className='text-sm'
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      productTypes === null ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {t(StringKey.ALL_TYPES) || 'All types'}
                </CommandItem>
                {options.map(option => (
                  <CommandItem
                    key={option.id}
                    onSelect={() => handleSelect(option.id)}
                    className='text-sm'
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        productTypes?.includes(option.id) ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {option.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {productTypes && productTypes.length > 0 && (
        <div className='flex flex-wrap gap-1 max-w-64'>
          {productTypes.map(id => {
            const label = options.find(o => o.id === id)?.name;
            return (
              <Badge key={id} variant='secondary' className='text-[10px] px-2 py-0 h-5'>
                {label}
                <button type='button' onClick={() => removeType(id)}>
                  <X className='h-3 w-3' />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductTypeFilter;
