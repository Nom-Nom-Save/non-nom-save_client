import { ProfileForm } from '@/components/settings/profile-form.component';
import { BrandImagesForm } from '@/components/settings/brand-images-form.component';
import { WorkingHoursEditor } from '@/components/settings/working-hours-editor.component';
import { ImpactStats } from '@/components/settings/impact-stats.component';
import { EstablishmentPreview } from '@/components/settings/establishment-preview.component';
import { useEstablishmentStore } from '@/store/establishment.store';
import { parseWorkingHours } from '@/utils/working-hours.utils';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';

const SettingsPage = () => {
  const { t } = useTranslation();
  const profile = useEstablishmentStore(s => s.profile);

  return (
    <main className='max-w-[1320px] mx-auto px-4 py-6 pb-16 sm:px-8 sm:py-10 sm:pb-32'>
      <div className='mb-6 sm:mb-9'>
        <p className='text-[11px] font-bold tracking-[.18em] uppercase text-brand-green mb-2'>
          {t(StringKey.YOUR_ESTABLISHMENT)}
        </p>
        <h1 className='text-2xl sm:text-[2rem] font-bold font-playfair text-foreground mb-1.5'>
          {t(StringKey.ESTABLISHMENT_PROFILE)}
        </h1>
        <p className='text-sm text-foreground/50'>
          {t(StringKey.ESTABLISHMENT_PROFILE_DESCRIPTION)}
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-7 items-start'>
        <div className='flex flex-col gap-6'>
          <div className='bg-white rounded-3xl border-[1.5px] border-border p-8 shadow-sm'>
            <p className='text-[11px] font-bold tracking-[.18em] uppercase text-brand-green mb-2'>
              {t(StringKey.BASIC_INFORMATION)}
            </p>
            <h2 className='text-xl font-bold font-playfair mb-6'>{t(StringKey.GENERAL_DETAILS)}</h2>
            <ProfileForm />
          </div>

          <div className='bg-white rounded-3xl border-[1.5px] border-border p-8 shadow-sm'>
            <p className='text-[11px] font-bold tracking-[.18em] uppercase text-brand-green mb-2'>
              {t(StringKey.BRANDING)}
            </p>
            <h2 className='text-xl font-bold font-playfair mb-6'>{t(StringKey.BRAND_IMAGES)}</h2>
            <BrandImagesForm />
          </div>

          <div className='bg-white rounded-3xl border-[1.5px] border-border p-8 shadow-sm'>
            <p className='text-[11px] font-bold tracking-[.18em] uppercase text-brand-green mb-2'>
              {t(StringKey.SCHEDULE)}
            </p>
            <h2 className='text-xl font-bold font-playfair mb-6'>{t(StringKey.WORKING_HOURS)}</h2>
            <WorkingHoursEditor
              key={profile?.id}
              initialHours={parseWorkingHours(profile?.workingHours ?? null)}
            />
          </div>

          {/* <div className='bg-white rounded-3xl border-[1.5px] border-border p-8 shadow-sm'>
            <p className='text-[11px] font-bold tracking-[.18em] uppercase text-brand-green mb-2'>
              {t(StringKey.SECURITY)}
            </p>
            <h2 className='text-xl font-bold font-playfair mb-6'>{t(StringKey.CHANGE_PASSWORD)}</h2>
            <ChangePasswordSection />
          </div>

          <DeleteAccountSection /> */}
        </div>

        <div className='flex flex-col gap-6 lg:sticky lg:top-[90px]'>
          <EstablishmentPreview />
          <ImpactStats />
        </div>
      </div>
    </main>
  );
};

export default SettingsPage;
