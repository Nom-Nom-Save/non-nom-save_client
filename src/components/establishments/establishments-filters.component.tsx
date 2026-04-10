import { StringKey } from '@/consts/string-key.consts';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { SortOrder } from '@/types/common.types';
import { EstablishmentsSortBy } from '@/types/establishments.types';
import { useEstablishmentsStore } from '@/store/establishments.store';
import { useGetEstablishmentsCitiesQuery } from '@/queries/establishments.queries';
import { useLocationStore } from '@/store/location.store';
import { useEffect } from 'react';
import { useProductTypesQuery } from '@/queries/metadata.queries';
import ProductTypeFilter from './product-type.filter.component';
import FilterLabel from './filter-label.component';
import Pill from './pill.component';

const getSortOrderLabels = (sortBy: EstablishmentsSortBy) => {
  switch (sortBy) {
    case EstablishmentsSortBy.DISTANCE:
      return {
        [SortOrder.ASC]: StringKey.CLOSEST_FIRST,
        [SortOrder.DESC]: StringKey.FURTHEST_FIRST,
      };
    case EstablishmentsSortBy.RATING:
      return {
        [SortOrder.DESC]: StringKey.HIGHEST_RATED,
        [SortOrder.ASC]: StringKey.LOWEST_RATED,
      };
    case EstablishmentsSortBy.CLOSING_TIME:
      return {
        [SortOrder.ASC]: StringKey.CLOSING_SOONEST,
        [SortOrder.DESC]: StringKey.CLOSING_LATEST,
      };
    default:
      return {
        [SortOrder.ASC]: StringKey.OLDEST_FIRST,
        [SortOrder.DESC]: StringKey.NEWEST_FIRST,
      };
  }
};

const EstablishmentsFilters = () => {
  const { t } = useTranslation();

  const { lat, lon } = useLocationStore();
  const hasLocation = lat !== null && lon !== null;

  const {
    distanceFilter,
    setDistanceFilter,
    minRating,
    setMinRating,
    sortBy,
    city,
    setSortBy,
    sortOrder,
    setSortOrder,
    setCity,
  } = useEstablishmentsStore();

  const { data: establishmentsCities, isLoading: isEstablishmentsCitiesLoading } =
    useGetEstablishmentsCitiesQuery();
  const { data: productTypes } = useProductTypesQuery();

  const isMyLocation = city === 'My location';
  const orderLabels = getSortOrderLabels(sortBy);

  useEffect(() => {
    if (hasLocation && city === 'All cities') {
      setCity('My location');
    } else if (!hasLocation && city === 'My location') {
      setCity('All cities');
    }
  }, [hasLocation]);

  useEffect(() => {
    if (!isMyLocation) {
      setDistanceFilter(null);
    }
  }, [city]);

  return (
    <div className='bg-white border border-border rounded-2xl p-4 shadow-sm mb-6 flex flex-wrap items-start gap-x-4 gap-y-3'>
      <div>
        <FilterLabel>{t(StringKey.CITY)}</FilterLabel>
        <Select value={city} onValueChange={value => setCity(value)}>
          <SelectTrigger className='bg-background h-8 text-sm w-44'>
            <SelectValue placeholder='Select city' />
          </SelectTrigger>
          <SelectContent>
            {hasLocation && <SelectItem value='My location'>{t(StringKey.MY_LOCATION)}</SelectItem>}
            <SelectItem value='All cities'>{t(StringKey.ALL_CITIES)}</SelectItem>
            {!isEstablishmentsCitiesLoading &&
              establishmentsCities?.map(cityName => (
                <SelectItem key={cityName} value={cityName}>
                  {cityName}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {isMyLocation && (
        <div>
          <FilterLabel>{t(StringKey.DISTANCE)}</FilterLabel>
          <div className='flex gap-2'>
            <Pill active={distanceFilter === null} onClick={() => setDistanceFilter(null)}>
              {t(StringKey.ANY)}
            </Pill>
            {[1, 3, 5].map(distance => (
              <Pill
                key={distance}
                active={distanceFilter === distance}
                onClick={() => setDistanceFilter(distanceFilter === distance ? null : distance)}
              >
                ≤ {distance} km
              </Pill>
            ))}
          </div>
        </div>
      )}

      <div>
        <FilterLabel>{t(StringKey.MIN_RATING)}</FilterLabel>
        <div className='flex gap-2'>
          <Pill active={minRating === null} onClick={() => setMinRating(null)}>
            {t(StringKey.ALL)}
          </Pill>
          {[5, 4, 3, 2, 1].map(star => (
            <Pill
              key={star}
              active={minRating === star}
              onClick={() => setMinRating(minRating === star ? null : star)}
            >
              <Star
                className={cn(
                  'w-3 h-3',
                  minRating === star ? 'fill-white text-white' : 'text-muted-foreground'
                )}
              />
              {star === 5 ? '5' : `${star}+`}
            </Pill>
          ))}
        </div>
      </div>

      <div>
        <FilterLabel>{t(StringKey.SORT_BY)}</FilterLabel>
        <Select value={sortBy} onValueChange={value => setSortBy(value as EstablishmentsSortBy)}>
          <SelectTrigger className='bg-background h-8 text-sm w-40'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={EstablishmentsSortBy.DISTANCE}>{t(StringKey.DISTANCE)}</SelectItem>
            <SelectItem value={EstablishmentsSortBy.RATING}>{t(StringKey.RATING)}</SelectItem>
            <SelectItem value={EstablishmentsSortBy.CLOSING_TIME}>
              {t(StringKey.CLOSING_TIME)}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <FilterLabel>{t(StringKey.SORT_ORDER)}</FilterLabel>
        <Select value={sortOrder} onValueChange={value => setSortOrder(value as SortOrder)}>
          <SelectTrigger className='bg-background h-8 text-sm w-44'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SortOrder.ASC}>{t(orderLabels[SortOrder.ASC])}</SelectItem>
            <SelectItem value={SortOrder.DESC}>{t(orderLabels[SortOrder.DESC])}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <FilterLabel>{t(StringKey.PRODUCT_TYPES)}</FilterLabel>
        <ProductTypeFilter options={productTypes || []} />
      </div>
    </div>
  );
};

export default EstablishmentsFilters;
