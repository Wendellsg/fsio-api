export function checkTime(time: string) {
  const pattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

  return pattern.test(time);
}
