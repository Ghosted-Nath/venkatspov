import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {

  const { draft_id } = await req.json();

  // Get draft order
  const { data: draft, error } = await supabase
    .from("order_drafts")
    .select("*")
    .eq("id", draft_id)
    .single();

  if (error || !draft) {
    return Response.json({ error: "Draft not found" }, { status: 400 });
  }

  const amount = draft.pricing.total_amount;

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
  });

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: draft_id
  });

  // Save Razorpay order id in draft
  await supabase
    .from("order_drafts")
    .update({ razorpay_order_id: order.id })
    .eq("id", draft_id);

  return Response.json(order);
}