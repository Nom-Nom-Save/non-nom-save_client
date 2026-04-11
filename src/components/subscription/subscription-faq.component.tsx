import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const SubscriptionFaq = () => {
  const { t } = useTranslation();

  const items = [
    { q: t(StringKey.FAQ_1_Q), a: t(StringKey.FAQ_1_A) },
    { q: t(StringKey.FAQ_2_Q), a: t(StringKey.FAQ_2_A) },
    { q: t(StringKey.FAQ_3_Q), a: t(StringKey.FAQ_3_A) },
    { q: t(StringKey.FAQ_4_Q), a: t(StringKey.FAQ_4_A) },
  ];

  return (
    <div className='max-w-[680px] mx-auto mt-18'>
      <h2 className='font-playfair text-[28px] font-bold text-brand-green text-center mb-8'>
        {t(StringKey.FAQ_TITLE)}
      </h2>
      <Accordion
        type='single'
        collapsible
        className='bg-white rounded-2xl border border-border px-6'
      >
        {items.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className='text-[15px] font-bold text-foreground py-5'>
              {item.q}
            </AccordionTrigger>
            <AccordionContent className='text-sm text-muted-foreground leading-relaxed pb-5'>
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
