import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
 process.env.NEXT_PUBLIC_SUPABASE_URL,
 process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {

 const body = await req.json();

 const expectedSignature = crypto
  .createHmac("sha256", process.env.RAZORPAY_SECRET)
  .update(body.razorpay_order_id + "|" + body.razorpay_payment_id)
  .digest("hex");

 if (expectedSignature !== body.razorpay_signature) {
  return Response.json({ success:false });
 }

 // Update draft order
 await supabase
  .from("order_drafts")
  .update({
   payment_status: "success",
   payment_id: body.razorpay_payment_id,
   status: "completed"
  })
  .eq("id", body.draft_id);

 return Response.json({ success:true });
}