export const getGuid = (len) => {
  const length = len || 8;
  return Array(length).fill(undefined).map(() => String.fromCharCode(65 + ((Math.round(Math.random() * 100)) % 26))).join('');
};
