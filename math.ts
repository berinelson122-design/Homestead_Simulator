export const clamp = (val: number, min: number, max: number): number => {
  return Math.min(Math.max(val, min), max);
};

export const formatDec = (val: number, places: number = 1): string => {
  return val.toFixed(places);
};