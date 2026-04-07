export const formatEstablishmentToastMessage = (template: string, name: string) =>
  template.split('{establishmentName}').map((part, i) =>
    i === 0 ? (
      <span key={i}>
        {part}
        <span className='font-bold text-black'>{name}</span>
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
