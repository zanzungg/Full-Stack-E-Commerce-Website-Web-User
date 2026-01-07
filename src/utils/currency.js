export const USD_TO_VND = 23000;

/**
 * Convert USD to VNPay amount format (VND * 100)
 * @param {number} usdAmount - Amount in USD
 * @returns {number} VNPay amount (VND * 100)
 */
export function usdToVnPayAmount(usdAmount) {
  if (typeof usdAmount !== 'number' || isNaN(usdAmount)) {
    throw new Error('Invalid USD amount');
  }

  const vnd = Math.round(usdAmount * USD_TO_VND);
  const vnpAmount = vnd;

  return vnpAmount;
}

/**
 * Convert USD to VND (without VNPay format)
 * @param {number} usdAmount - Amount in USD
 * @returns {number} Amount in VND
 */
export function usdToVnd(usdAmount) {
  if (typeof usdAmount !== 'number' || isNaN(usdAmount)) {
    throw new Error('Invalid USD amount');
  }

  return Math.round(usdAmount * USD_TO_VND);
}

/**
 * Convert VNPay amount to USD
 * @param {number} vnpAmount - VNPay amount (VND * 100)
 * @returns {number} Amount in USD
 */
export function vnpAmountToUsd(vnpAmount) {
  if (typeof vnpAmount !== 'number' || isNaN(vnpAmount)) {
    throw new Error('Invalid VNPay amount');
  }

  const vnd = vnpAmount / 100; // Convert from VNPay format
  return vnd / USD_TO_VND;
}

/**
 * Format amount to VND display
 * @param {number} vndAmount - Amount in VND
 * @returns {string} Formatted VND string
 */
export function formatVND(vndAmount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(vndAmount);
}

/**
 * Format amount to USD display
 * @param {number} usdAmount - Amount in USD
 * @returns {string} Formatted USD string
 */
export function formatUSD(usdAmount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(usdAmount);
}
