export const RandomText = (): string => {
  const chars = '0123456789';
  let randomText = '';

  for (let i = 0; i < 6; i++) {
    const rnum = Math.floor(Math.random() * chars.length);
    randomText += chars.substring(rnum, rnum + 1);
  }

  return randomText;
};
