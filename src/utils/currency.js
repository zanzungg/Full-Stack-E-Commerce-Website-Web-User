export const USD_TO_VND = 23000;

export function usdToVnPayAmount(usdAmount) {
  if (typeof usdAmount !== 'number' || isNaN(usdAmount)) {
    throw new Error('Invalid USD amount');
  }

  const vnd = Math.round(usdAmount * USD_TO_VND);
  return vnd;
}
