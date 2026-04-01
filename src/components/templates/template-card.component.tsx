import { MoreVertical, Pencil, Upload, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { Button } from '@/components/ui/button';

interface TemplateCardProps {
  id: string;
  name: string;
  description: string;
  recommendedPrice: number;
  types: string[];
  picture: string | null;
  isPublished: boolean;
  weight?: number;
  onEdit: (id: string) => void;
  onPublish: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TemplateCard = ({
  id,
  name,
  description,
  recommendedPrice,
  picture,
  weight,
  onEdit,
  onPublish,
  onDelete,
}: TemplateCardProps) => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 bg-white px-4 py-4 sm:px-5 rounded-[1.25rem] border-[1.5px] border-border shadow-sm transition-colors hover:border-brand-green'>
      <div className='flex items-center gap-4 sm:gap-5 flex-1 min-w-0'>
        <div className='w-[52px] h-[52px] rounded-[14px] bg-brand-green-muted flex items-center justify-center shrink-0 overflow-hidden'>
          {picture ? (
            <img src={picture} alt={name} className='w-full h-full object-cover' />
          ) : (
            <span className='text-2xl'>📦</span>
          )}
        </div>

        <div className='flex-1 min-w-0'>
          <h3 className='text-[17px] font-bold font-playfair text-foreground mb-0.5 truncate'>
            {name}
          </h3>
          <p className='text-[13px] text-foreground/50 truncate'>{description}</p>
          {weight != null && weight > 0 && (
            <p className='text-[11px] text-foreground/50 mt-0.5'>{weight}g</p>
          )}
        </div>
      </div>

      <div className='flex items-center justify-between sm:contents'>
        <div className='text-right min-w-[90px] sm:min-w-[100px] shrink-0'>
          <p className='text-[11px] text-foreground/50 mb-0.5'>{t(StringKey.REC_PRICE)}</p>
          <p className='text-[15px] font-bold text-foreground/60'>€{recommendedPrice.toFixed(2)}</p>
        </div>

        <div className='flex items-center gap-2 shrink-0'>
          <Button type='button' variant='outline-pill' size='pill' onClick={() => onEdit(id)}>
            <Pencil size={14} />
            <span className='hidden sm:inline'>{t(StringKey.EDIT)}</span>
          </Button>

          <Button type='button' variant='brand' size='pill' onClick={() => onPublish(id)} className='shadow-sm'>
            <Upload size={14} />
            <span className='hidden sm:inline'>{t(StringKey.PUBLISH_TO_MENU_BTN)}</span>
          </Button>

          <div className='relative'>
            <Button type='button' variant='ghost-circle' size='icon-circle' onClick={() => setMenuOpen(!menuOpen)}>
              <MoreVertical size={16} className='text-foreground/50' />
            </Button>
            {menuOpen && (
              <>
                <div className='fixed inset-0 z-10' onClick={() => setMenuOpen(false)} />
                <div className='absolute right-0 top-10 z-20 w-40 bg-white rounded-xl border border-border shadow-lg py-1'>
                  <button
                    type='button'
                    onClick={() => {
                      onDelete(id);
                      setMenuOpen(false);
                    }}
                    className='flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer'
                  >
                    <Trash2 size={14} />
                    {t(StringKey.DELETE)}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
