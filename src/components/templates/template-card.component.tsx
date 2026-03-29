import { MoreVertical, Pencil, Upload, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';

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
          <p className='text-[13px] text-foreground/45 truncate'>{description}</p>
          {weight != null && weight > 0 && (
            <p className='text-[11px] text-foreground/40 mt-0.5'>{weight}g</p>
          )}
        </div>
      </div>

      <div className='flex items-center justify-between sm:contents'>
        <div className='text-right min-w-[90px] sm:min-w-[100px] shrink-0'>
          <p className='text-[11px] text-foreground/40 mb-0.5'>{t(StringKey.REC_PRICE)}</p>
          <p className='text-[15px] font-bold text-foreground/60'>€{recommendedPrice.toFixed(2)}</p>
        </div>

        <div className='flex items-center gap-2 shrink-0'>
          <button
            type='button'
            onClick={() => onEdit(id)}
            className='flex items-center gap-1.5 px-3 sm:px-[18px] py-2 rounded-full border-[1.5px] border-border bg-white text-[13px] font-semibold text-foreground cursor-pointer transition-colors hover:border-brand-green'
          >
            <Pencil size={14} />
            <span className='hidden sm:inline'>{t(StringKey.EDIT)}</span>
          </button>

          <button
            type='button'
            onClick={() => onPublish(id)}
            className='flex items-center gap-1.5 px-3 sm:px-5 py-2 rounded-full text-[13px] font-bold cursor-pointer transition-colors shadow-sm bg-brand-green text-white hover:bg-brand-green-hover'
          >
            <Upload size={14} />
            <span className='hidden sm:inline'>{t(StringKey.PUBLISH_TO_MENU_BTN)}</span>
          </button>

          <div className='relative'>
            <button
              type='button'
              onClick={() => setMenuOpen(!menuOpen)}
              className='w-[34px] h-[34px] rounded-full bg-brand-cream border border-border flex items-center justify-center cursor-pointer transition-colors hover:bg-destructive/10 shrink-0'
            >
              <MoreVertical size={16} className='text-foreground/40' />
            </button>
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
