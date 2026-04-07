export const formatTime = (date: Date) => {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
};

export const getTimeUntilExpiry = (expiresAt: string) => {
  const msLeft = new Date(expiresAt).getTime() - Date.now();
  if (msLeft <= 0) {
    return { hours: 0, minutes: 0, isExpired: true };
  }

  const totalMinutes = Math.floor(msLeft / (1000 * 60));

  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
    isExpired: false,
  };
};

export const formatEditableUntil = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};
