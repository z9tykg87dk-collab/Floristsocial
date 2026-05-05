export type ViewerRole = "florist" | "admin" | "super_admin";

export type ReferralEconomy = {
  order_value: number | null;
  seller_florist_id: string | null;
  executor_florist_id: string | null;

  seller_commission: number | null;
  executor_commission: number | null;
  platform_commission: number | null;

  payment_fee: number | null;
};

export type VisibleReferralEconomy =
  | {
      can_view_all: true;
      order_value: number | null;
      seller_commission: number | null;
      executor_commission: number | null;
      platform_commission: number | null;
      payment_fee: number | null;
    }
  | {
      can_view_all: false;
      order_value: number | null;
      own_commission: number | null;
    };

export function getVisibleReferralEconomy(
  viewerRole: ViewerRole,
  viewerFloristId: string | null,
  referral: ReferralEconomy
): VisibleReferralEconomy {
  const isAdmin = viewerRole === "admin" || viewerRole === "super_admin";

  if (isAdmin) {
    return {
      can_view_all: true,
      order_value: referral.order_value,
      seller_commission: referral.seller_commission,
      executor_commission: referral.executor_commission,
      platform_commission: referral.platform_commission,
      payment_fee: referral.payment_fee,
    };
  }

  let ownCommission: number | null = null;

  if (viewerFloristId && viewerFloristId === referral.seller_florist_id) {
    ownCommission = referral.seller_commission;
  }

  if (viewerFloristId && viewerFloristId === referral.executor_florist_id) {
    ownCommission = referral.executor_commission;
  }

  return {
    can_view_all: false,
    order_value: referral.order_value,
    own_commission: ownCommission,
  };
}
