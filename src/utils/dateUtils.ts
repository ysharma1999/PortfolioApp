export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const getCurrentDateKey = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const isToday = (dateString: string): boolean => {
  return dateString === getCurrentDateKey();
};
