const CartPageSkeleton = () => {
  return (
    <section className='my-6 px-4'>
      <div className='h-4 w-56 bg-muted rounded animate-pulse mb-6' />

      <ul className='flex flex-col gap-4'>
        {Array.from({ length: 2 }).map((_, i) => (
          <li
            key={i}
            className='bg-white rounded-2xl border border-border shadow-sm p-5 flex items-center gap-4'
          >
            <div className='w-16 h-16 rounded-2xl bg-muted animate-pulse shrink-0' />

            <div className='flex-1 min-w-0 flex flex-col gap-2'>
              <div className='flex items-center gap-2'>
                <div className='h-6 w-36 bg-muted rounded animate-pulse' />
                <div className='h-5 w-20 bg-muted rounded-full animate-pulse' />
              </div>
              <div className='h-4 w-48 bg-muted rounded animate-pulse' />
              <div className='flex items-center gap-1'>
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className='w-3.5 h-3.5 bg-muted rounded animate-pulse' />
                ))}
                <div className='h-4 w-24 bg-muted rounded animate-pulse ml-1' />
              </div>
            </div>

            <div className='flex items-center gap-4 shrink-0'>
              <div className='flex flex-col gap-1 items-end'>
                <div className='h-3 w-16 bg-muted rounded animate-pulse' />
                <div className='h-7 w-16 bg-muted rounded animate-pulse' />
                <div className='h-3 w-10 bg-muted rounded animate-pulse' />
              </div>
              <div className='h-12 w-32 bg-muted rounded-full animate-pulse' />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CartPageSkeleton;
