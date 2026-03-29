import { useEffect, useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import {
  businessRegistrationSchema,
  type BusinessRegistrationFormData,
} from '@/utils/validations-registration/business-registration.utils';
import { useRegisterEstablishmentMutation } from '@/queries/auth.queries';
import { useAuthStore } from '@/store/auth.store';
import { ApiError } from '@/api/client';
import { useTranslation } from 'react-i18next';
import { StringKey } from '@/consts/string-key.consts';
import { searchCityOrCountry, type NominatimFeature } from '@/api/nominatim.api';

export const BusinessForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>('');

  const [addressResults, setAddressResults] = useState<NominatimFeature[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAddressSelected, setIsAddressSelected] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const setPendingVerificationEmail = useAuthStore(s => s.setPendingVerificationEmail);
  const { mutate: registerEstablishment, isPending } = useRegisterEstablishmentMutation();

  useEffect(() => {
    const debounce = setTimeout(
      async () => {
        if (!search) {
          setAddressResults([]);
          return;
        }
        const response = await searchCityOrCountry(search);
        setAddressResults(response);
        setShowDropdown(true);
      },
      search ? 300 : 0
    );

    return () => clearTimeout(debounce);
  }, [search]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BusinessRegistrationFormData>({
    resolver: zodResolver(businessRegistrationSchema),
    defaultValues: { agreeToTerms: false },
  });

  const handleFormSubmit = (data: BusinessRegistrationFormData) => {
    registerEstablishment(
      {
        establishmentName: data.establishmentName,
        email: data.email,
        password: data.password,
        address: data.address,
      },
      {
        onSuccess: response => {
          setPendingVerificationEmail(response.email);
          void navigate({ to: '/verify-email' });
        },
        onError: error => {
          if (error instanceof ApiError && error.status === 409) {
            toast.error(t(StringKey.EMAIL_ALREADY_IN_USE), {
              id: 'registration-conflict',
              description: t(StringKey.EMAIL_ALREADY_IN_USE_DESCRIPTION),
            });
          } else {
            toast.error(t(StringKey.REGISTRATION_FAILED), {
              id: 'registration-error',
              description: t(StringKey.REGISTRATION_FAILED_DESCRIPTION),
            });
          }
        },
      }
    );
  };

  const handleInvalidSubmit = (fieldErrors: FieldErrors<BusinessRegistrationFormData>) => {
    if (fieldErrors.agreeToTerms) {
      toast.error(t(StringKey.AGREEMENT_REQUIRED), {
        id: 'terms-error',
        description: t(StringKey.AGREEMENT_REQUIRED_DESCRIPTION),
      });
    }
    if (Object.keys(fieldErrors).some(key => key !== 'agreeToTerms')) {
      toast.error(t(StringKey.REGISTRATION_FAILED), {
        id: 'registration-error',
        description: t(StringKey.REGISTRATION_FIELDS_ERROR),
      });
    }
  };

  return (
    <form
      onSubmit={e => void handleSubmit(handleFormSubmit, handleInvalidSubmit)(e)}
      className='flex flex-col gap-6'
    >
      <div className='flex flex-col gap-2'>
        <label
          htmlFor='business-name'
          className={cn(
            'text-base font-semibold',
            errors.establishmentName ? 'text-destructive' : 'text-foreground'
          )}
        >
          {t(StringKey.BUSINESS_NAME)}
        </label>
        <input
          id='business-name'
          type='text'
          placeholder={t(StringKey.BUSINESS_NAME_PLACEHOLDER)}
          {...register('establishmentName')}
          className={cn(
            'w-full rounded-xl border px-4 py-4 text-base outline-none transition-colors placeholder:text-muted-foreground',
            'bg-white focus:ring-2 focus:ring-(--brand-green)/30',
            errors.establishmentName
              ? 'border-destructive bg-destructive/5 focus:ring-destructive/20'
              : 'border-border'
          )}
        />
        {errors.establishmentName && (
          <p className='text-destructive text-xs'>{errors.establishmentName.message}</p>
        )}
      </div>

      <div className='flex flex-col gap-2'>
        <label
          htmlFor='business-email'
          className={cn(
            'text-base font-semibold',
            errors.email ? 'text-destructive' : 'text-foreground'
          )}
        >
          {t(StringKey.EMAIL_ADDRESS)}
        </label>
        <div className='relative'>
          <input
            id='business-email'
            type='email'
            placeholder={t(StringKey.BUSINESS_EMAIL_PLACEHOLDER)}
            {...register('email')}
            className={cn(
              'w-full rounded-xl border px-4 py-4 text-base outline-none transition-colors placeholder:text-muted-foreground',
              'bg-white focus:ring-2 focus:ring-(--brand-green)/30',
              errors.email
                ? 'border-destructive bg-destructive/5 pr-11 focus:ring-destructive/20'
                : 'border-border'
            )}
          />
          {errors.email && (
            <AlertCircle
              size={18}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-destructive'
            />
          )}
        </div>
        {errors.email && <p className='text-destructive text-xs'>{errors.email.message}</p>}
      </div>

      <div className='flex flex-col gap-2'>
        <label
          htmlFor='business-address'
          className={cn(
            'text-base font-semibold',
            errors.address ? 'text-destructive' : 'text-foreground'
          )}
        >
          {t(StringKey.STORE_ADDRESS)}
        </label>
        <div className='relative'>
          <input
            id='business-address'
            type='text'
            placeholder={t(StringKey.STORE_ADDRESS_PLACEHOLDER)}
            {...register('address')}
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              if (isAddressSelected) {
                setValue('address', '');
                setIsAddressSelected(false);
              }
            }}
            className={cn(
              'w-full rounded-xl border px-4 py-4 text-base outline-none transition-colors placeholder:text-muted-foreground',
              'bg-white focus:ring-2 focus:ring-(--brand-green)/30',
              errors.address
                ? 'border-destructive bg-destructive/5 pr-11 focus:ring-destructive/20'
                : 'border-border'
            )}
            onFocus={() => addressResults.length > 0 && setShowDropdown(true)}
            onBlur={() => {
              setTimeout(() => {
                setShowDropdown(false);
                if (!isAddressSelected && search) {
                  setSearch('');
                }
              }, 150);
            }}
          />
          {errors.address && (
            <AlertCircle
              size={18}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-destructive'
            />
          )}
          {showDropdown && addressResults.length > 0 && (
            <ul className='absolute z-50 mt-1 w-full rounded-xl border border-border bg-white shadow-lg max-h-60 overflow-y-auto'>
              {addressResults.map((result, index) => (
                <li
                  key={index}
                  onMouseDown={() => {
                    setSearch(result.properties.displayName);
                    setValue('address', result.properties.displayName);
                    setIsAddressSelected(true);
                    setShowDropdown(false);
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

      <div className='flex flex-col gap-2'>
        <label
          htmlFor='business-password'
          className={cn(
            'text-base font-semibold',
            errors.password ? 'text-destructive' : 'text-foreground'
          )}
        >
          {t(StringKey.PASSWORD)}
        </label>
        <div className='relative'>
          <input
            id='business-password'
            type={showPassword ? 'text' : 'password'}
            placeholder={t(StringKey.PASSWORD_PLACEHOLDER)}
            {...register('password')}
            className={cn(
              'w-full rounded-xl border px-4 py-4 pr-11 text-base outline-none transition-colors placeholder:text-muted-foreground',
              'bg-white focus:ring-2 focus:ring-(--brand-green)/30',
              errors.password
                ? 'border-destructive bg-destructive/5 focus:ring-destructive/20'
                : 'border-border'
            )}
          />
          <button
            type='button'
            onClick={() => setShowPassword(prev => !prev)}
            className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
            aria-label={showPassword ? t(StringKey.HIDE_PASSWORD) : t(StringKey.SHOW_PASSWORD)}
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
        {errors.password && <p className='text-destructive text-xs'>{errors.password.message}</p>}
      </div>

      <div className='flex flex-col gap-1.5'>
        <div className='flex items-start gap-3'>
          <input
            id='business-agreeToTerms'
            type='checkbox'
            {...register('agreeToTerms')}
            className='mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-brand-green'
          />
          <label
            htmlFor='business-agreeToTerms'
            className={cn(
              'text-sm leading-snug cursor-pointer',
              errors.agreeToTerms ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {t(StringKey.BY_JOINING_AGREE)}{' '}
            <a
              href='#'
              className='font-semibold text-brand-green hover:text-brand-green-hover transition-colors'
            >
              {t(StringKey.TERMS_OF_SERVICE)}
            </a>{' '}
            {t(StringKey.AND)}{' '}
            <a
              href='#'
              className='font-semibold text-brand-green hover:text-brand-green-hover transition-colors'
            >
              {t(StringKey.PRIVACY_POLICY)}
            </a>
            .
          </label>
        </div>
        {errors.agreeToTerms && (
          <p className='text-destructive text-xs pl-7'>{errors.agreeToTerms.message}</p>
        )}
      </div>

      <button
        type='submit'
        disabled={isPending}
        className='w-full rounded-xl py-4.5 text-lg font-semibold text-white transition-colors cursor-pointer mt-1 bg-brand-green hover:bg-brand-green-hover disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {isPending ? t(StringKey.CREATING_ACCOUNT) : t(StringKey.CREATE_ACCOUNT)}
      </button>
    </form>
  );
};
