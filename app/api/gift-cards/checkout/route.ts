import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const amount = Number(body.amount);
    const validityMonths = Number(body.validityMonths || 12);
    const buyerContact = String(body.buyerContact || "");
    const giftCode = String(body.code || "");

    if (!amount || amount < 500 || amount > 10000) {
      return NextResponse.json(
        { error: "Presentkortets belopp måste vara mellan 500 kr och 10 000 kr." },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY saknas i .env.local" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: buyerContact.includes("@") ? buyerContact : undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "sek",
            unit_amount: amount * 100,
            product_data: {
              name: `FloristSocial Presentkort ${amount} kr`,
              description: `Giltigt i ${validityMonths} månader. Moms ingår.`,
            },
          },
        },
      ],
      metadata: {
        type: "gift_card",
        amount: String(amount),
        validity_months: String(validityMonths),
        buyer_contact: buyerContact,
        gift_code: giftCode,
      },
      success_url: `${origin}/gift-cards?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/gift-cards?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Kunde inte skapa Stripe Checkout." },
      { status: 500 }
    );
  }
}
