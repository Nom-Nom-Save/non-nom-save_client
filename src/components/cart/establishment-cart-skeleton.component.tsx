const EstablishmentCartSkeleton = () => {
  return (
    <section className='min-h-screen'>
      <div className='py-4 flex items-center gap-4'>
        <div className='h-9 w-36 bg-muted rounded-full animate-pulse' />
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-xl bg-muted animate-pulse' />
          <div className='flex flex-col gap-1'>
            <div className='h-4 w-28 bg-muted rounded animate-pulse' />
            <div className='h-3 w-40 bg-muted rounded animate-pulse' />
          </div>
          <div className='h-6 w-20 bg-muted rounded-full animate-pulse ml-2' />
        </div>
      </div>

      <div className='py-6 flex flex-col lg:flex-row gap-6'>
        <ul className='flex-1 flex flex-col gap-4'>
          {Array.from({ length: 3 }).map((_, i) => (
            <li
              key={i}
              className='bg-white rounded-2xl border border-border shadow-sm p-5 flex items-center gap-4'
            >
              <div className='w-16 h-16 rounded-xl bg-muted animate-pulse shrink-0' />

              <div className='flex-1 flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  <div className='h-5 w-40 bg-muted rounded animate-pulse' />
                  <div className='h-4 w-16 bg-muted rounded animate-pulse' />
                </div>
                <div className='flex items-center gap-2'>
                  <div className='h-5 w-14 bg-muted rounded animate-pulse' />
                  <div className='h-4 w-12 bg-muted rounded animate-pulse' />
                  <div className='h-4 w-10 bg-muted rounded-full animate-pulse' />
                </div>
              </div>

              <div className='flex flex-col items-end gap-2 shrink-0'>
                <div className='h-10 w-32 bg-muted rounded-xl animate-pulse' />
                <div className='h-8 w-8 bg-muted rounded animate-pulse' />
              </div>
            </li>
          ))}
        </ul>

        <div className='lg:w-80 shrink-0'>
          <div className='bg-white rounded-2xl border border-border shadow-sm p-6'>
            <div className='h-6 w-36 bg-muted rounded animate-pulse mb-5' />

            <div className='flex flex-col gap-3 mb-4'>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className='flex justify-between'>
                  <div className='h-4 w-32 bg-muted rounded animate-pulse' />
                  <div className='h-4 w-12 bg-muted rounded animate-pulse' />
                </div>
              ))}
            </div>

            <div className='border-t border-border pt-3 flex justify-between'>
              <div className='h-6 w-12 bg-muted rounded animate-pulse' />
              <div className='h-7 w-20 bg-muted rounded animate-pulse' />
            </div>

            <div className='h-14 w-full bg-muted rounded-full animate-pulse mt-5' />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EstablishmentCartSkeleton;
