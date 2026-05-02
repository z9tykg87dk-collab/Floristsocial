export function formatPrice(amount: number, currency: string = "SEK") {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency,
  }).format(amount / 100);
}
