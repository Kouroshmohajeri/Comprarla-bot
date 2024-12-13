/**
 * Converts a given price based on specific percentage adjustments and a fixed conversion rate, including shipping.
 * @param {number} price - The price to convert.
 * @param {number} fixedPrice - The fixed price to use for conversion.
 * @param {number} shippingPrice - The shipping price to add to the total.
 * @returns {number} - The converted price with shipping included.
 */
export const convertPrice = (price, fixedPrice, shippingPrice) => {
  if (isNaN(price) || price <= 0) {
    return 0;
  }

  let adjustedPrice = price;
  if (price <= 250) {
    adjustedPrice += price * 0.25;
  } else if (price > 250) {
    adjustedPrice += price * 0.2;
  }
  let additionalToFixed = fixedPrice * 1;
  let totalPrice = (adjustedPrice + shippingPrice) * additionalToFixed;

  return totalPrice;
};
