type SplitResult = {
  totalAmount: number;
  stripeFeeAmount: number;
  executorGrossAmount: number;
  sellerGrossAmount: number;
  platformGrossAmount: number;
  executorFeeAmount: number;
  sellerFeeAmount: number;
  platformFeeAmount: number;
  executorAmount: number;
  sellerAmount: number;
  platformAmount: number;
};

function calculateSplit(
  totalAmount: number,
  stripeFeeAmount: number,
  shares: {
    executorBps: number;
    sellerBps: number;
    platformBps: number;
  }
): SplitResult {
  const safeTotal = Math.max(totalAmount, 0);
  const safeFee = Math.max(stripeFeeAmount, 0);

  const executorGrossAmount = Math.floor((safeTotal * shares.executorBps) / 10000);
  const sellerGrossAmount = Math.floor((safeTotal * shares.sellerBps) / 10000);
  const platformGrossAmount = safeTotal - executorGrossAmount - sellerGrossAmount;

  const executorFeeAmount = Math.floor((safeFee * shares.executorBps) / 10000);
  const sellerFeeAmount = Math.floor((safeFee * shares.sellerBps) / 10000);
  const platformFeeAmount = safeFee - executorFeeAmount - sellerFeeAmount;

  return {
    totalAmount: safeTotal,
    stripeFeeAmount: safeFee,
    executorGrossAmount,
    sellerGrossAmount,
    platformGrossAmount,
    executorFeeAmount,
    sellerFeeAmount,
    platformFeeAmount,
    executorAmount: Math.max(executorGrossAmount - executorFeeAmount, 0),
    sellerAmount: Math.max(sellerGrossAmount - sellerFeeAmount, 0),
    platformAmount: Math.max(platformGrossAmount - platformFeeAmount, 0),
  };
}

export function calculateDirectOrderSplit(
  totalAmount: number,
  stripeFeeAmount: number
) {
  return calculateSplit(totalAmount, stripeFeeAmount, {
    executorBps: 8000,
    sellerBps: 0,
    platformBps: 2000,
  });
}

export function calculateReferralOrderSplit(
  totalAmount: number,
  stripeFeeAmount: number
) {
  return calculateSplit(totalAmount, stripeFeeAmount, {
    executorBps: 8000,
    sellerBps: 1000,
    platformBps: 1000,
  });
}
