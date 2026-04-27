import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Pencil, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  profileSchema,
  type ProfileFormData,
} from '@/utils/validations-establishment/profile.utils';
import {
  useEstablishmentProfileQuery,
  useUpdateEstablishmentProfileMutation,
} from '@/queries/establishment.queries';
import { ApiError } from '@/api/client';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { Button } from '@/components/ui/button';
import { FormInput, formInputVariants } from '@/components/ui/form-input';
import { searchCityOrCountry, type NominatimFeature } from '@/api/nominatim.api';

export const ProfileForm = () => {
  const { t } = useTranslation();
  const { data: profile } = useEstablishmentProfileQuery();
  const { mutate: updateProfile, isPending } = useUpdateEstablishmentProfileMutation();

  const [userSearch, setUserSearch] = useState<string | null>(null);
  const [addressSelected, setAddressSelected] = useState(false);
  const [rawAddressResults, setRawAddressResults] = useState<NominatimFeature[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const [userBoundTo, setUserBoundTo] = useState<string | null>(null);
  const [isBoundToEditing, setIsBoundToEditing] = useState(false);

  const search = userSearch ?? profile?.address ?? '';
  const boundToValue = userBoundTo ?? profile?.boundTo ?? '';

  // Derived — no setState needed to clear
  const addressResults = userSearch !== null && !addressSelected ? rawAddressResults : [];
  const showDropdown = isFocused && addressResults.length > 0;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // Only RHF reset — no setState calls
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        description: profile.description ?? '',
        address: profile.address,
      });
    }
  }, [profile, reset]);

  // All setState calls inside setTimeout (async) — not synchronous
  useEffect(() => {
    if (userSearch === null || addressSelected) return;
    const debounce = setTimeout(async () => {
      const response = await searchCityOrCountry(userSearch);
      setRawAddressResults(response);
    }, 300);
    return () => clearTimeout(debounce);
  }, [userSearch, addressSelected]);

  const handleFormSubmit = (data: ProfileFormData) => {
    if (!profile) return;
    updateProfile(
      { establishmentId: profile.id, data },
      {
        onSuccess: () => toast.success(t(StringKey.PROFILE_UPDATED)),
        onError: (error: Error) => {
          if (error instanceof ApiError) {
            toast.error(t(StringKey.FAILED_TO_UPDATE_PROFILE), { id: 'profile-error' });
          }
        },
      }
    );
  };

  const handleSaveBoundTo = () => {
    if (!profile) return;
    updateProfile(
      { establishmentId: profile.id, data: { boundTo: boundToValue } },
      {
        onSuccess: () => {
          toast.success(t(StringKey.KEY_UPDATED));
          setIsBoundToEditing(false);
        },
        onError: () => {
          toast.error(t(StringKey.FAILED_TO_UPDATE_KEY), { id: 'key-error' });
        },
      }
    );
  };

  return (
    <form onSubmit={e => void handleSubmit(handleFormSubmit)(e)} className='flex flex-col gap-5'>
      <div className='flex flex-col gap-2'>
        <label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
          {t(StringKey.ESTABLISHMENT_NAME)} *
        </label>
        <FormInput variant='settings' {...register('name')} hasError={!!errors.name} />
        {errors.name && <p className='text-destructive text-xs'>{errors.name.message}</p>}
      </div>

      <div className='flex flex-col gap-2'>
        <label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
          {t(StringKey.DESCRIPTION)}
        </label>
        <textarea
          rows={4}
          {...register('description')}
          className={cn(
            formInputVariants({ variant: 'settings', hasError: !!errors.description }),
            'resize-none'
          )}
        />
        {errors.description && (
          <p className='text-destructive text-xs'>{errors.description.message}</p>
        )}
      </div>

      <div className='flex flex-col gap-2'>
        <label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
          {t(StringKey.STREET_ADDRESS)} *
        </label>
        <div className='relative'>
          <MapPin
            size={18}
            className='absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/35 z-10'
          />
          <FormInput
            variant='settings'
            {...register('address')}
            value={search}
            onChange={e => {
              setUserSearch(e.target.value);
              if (addressSelected) {
                setValue('address', '');
                setAddressSelected(false);
              }
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            hasError={!!errors.address}
            className='pl-11'
          />
          {showDropdown && (
            <ul className='absolute z-50 mt-1 w-full rounded-xl border border-border bg-white shadow-lg max-h-60 overflow-y-auto'>
              {addressResults.map((result, index) => (
                <li
                  key={index}
                  onMouseDown={() => {
                    setUserSearch(result.properties.displayName);
                    setValue('address', result.properties.displayName);
                    setAddressSelected(true);
                  }}
                  className='px-4 py-3 text-sm cursor-pointer hover:bg-muted transition-colors first:rounded-t-xl last:rounded-b-xl'
                >
                  {result.properties.displayName}
                </li>
              ))}
            </ul>
          )}
        </div>
        {errors.address && <p className='text-destructive text-xs'>{errors.address.message}</p>}
      </div>

      <Button
        type='submit'
        variant='brand'
        size='settings'
        disabled={isPending}
        className='w-full sm:w-auto'
      >
        {isPending ? t(StringKey.SAVING) : t(StringKey.SAVE_CHANGES)}
      </Button>

      <div className='pt-5 border-t border-border flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <div>
            <label className='text-xs font-bold text-foreground/50 uppercase tracking-wider'>
              {t(StringKey.SHARED_ACCESS_KEY)}
            </label>
            <p className='text-xs text-foreground/40 mt-0.5'>
              {t(StringKey.SHARED_ACCESS_KEY_DESCRIPTION)}
            </p>
          </div>
          {!isBoundToEditing && (
            <Button
              type='button'
              variant='ghost-circle'
              size='icon-circle'
              onClick={() => setIsBoundToEditing(true)}
              title={t(StringKey.EDIT_KEY)}
            >
              <Pencil size={15} />
            </Button>
          )}
        </div>
        <div className='flex gap-2 items-center'>
          <FormInput
            variant='settings'
            value={boundToValue}
            onChange={e => setUserBoundTo(e.target.value)}
            disabled={!isBoundToEditing}
            className={cn('flex-1', !isBoundToEditing && 'opacity-60 cursor-not-allowed')}
          />
          {isBoundToEditing && (
            <>
              <Button
                type='button'
                variant='brand'
                size='settings'
                disabled={isPending}
                onClick={handleSaveBoundTo}
              >
                {t(StringKey.SAVE_CHANGES)}
              </Button>
              <Button
                type='button'
                variant='outline'
                size='icon-circle'
                onClick={() => {
                  setUserBoundTo(null);
                  setIsBoundToEditing(false);
                }}
              >
                <X size={15} />
              </Button>
            </>
          )}
        </div>
      </div>
    </form>
  );
};
