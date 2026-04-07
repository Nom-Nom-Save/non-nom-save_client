const EstablishmentMenuItemSkeleton = () => (
  <li className='bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse'>
    <div className='h-48 bg-muted' />
    <div className='p-8'>
      <div className='h-4 bg-muted rounded-full w-3/4 mb-3' />
      <div className='h-3 bg-muted rounded-full w-full mb-2' />
      <div className='h-3 bg-muted rounded-full w-2/3 mb-6' />
      <div className='flex justify-between items-center'>
        <div className='h-5 bg-muted rounded-full w-16' />
        <div className='h-9 bg-muted rounded-full w-24' />
      </div>
    </div>
  </li>
);

export default EstablishmentMenuItemSkeleton;
