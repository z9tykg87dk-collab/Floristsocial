export function calculateDirectOrderSplit(totalAmount: number, stripeFeeAmount: number) {
  const netAmount = Math.max(totalAmount - stripeFeeAmount, 0);
  const executorAmount = Math.floor(netAmount * 0.8);
  const platformAmount = netAmount - executorAmount;

  return {
    netAmount,
    executorAmount,
    sellerAmount: 0,
    platformAmount,
  };
}

export function calculateReferralOrderSplit(
  totalAmount: number,
  stripeFeeAmount: number
) {
  const netAmount = Math.max(totalAmount - stripeFeeAmount, 0);
  const executorAmount = Math.floor(netAmount * 0.8);
  const sellerAmount = Math.floor(netAmount * 0.1);
  const platformAmount = netAmount - executorAmount - sellerAmount;

  return {
    netAmount,
    executorAmount,
    sellerAmount,
    platformAmount,
  };
}
