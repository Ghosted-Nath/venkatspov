import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {

    const body = await req.json();

    // Basic validation
    if (!body?.customer || !body?.cart || !body?.pricing) {
      return Response.json(
        { error: "Invalid order payload" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.cart) || body.cart.length === 0) {
      return Response.json(
        { error: "Cart cannot be empty" },
        { status: 400 }
      );
    }

    if (!body.pricing?.total_amount) {
      return Response.json(
        { error: "Missing pricing information" },
        { status: 400 }
      );
    }

    // Insert draft
    const { data, error } = await supabase
      .from("order_drafts")
      .insert({
        customer: body.customer,
        location: body.location,
        cart: body.cart,
        pricing: body.pricing,
        coupon: body.coupon,
        status: "draft",
        payment_status: "pending",
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return Response.json(
        { error: "Database insert failed" },
        { status: 500 }
      );
    }

    return Response.json(data);

  } catch (err) {
    console.error("Server error:", err);

    return Response.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}