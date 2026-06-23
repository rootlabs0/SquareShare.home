import { supabase } from "@/lib/supabase";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    // If Supabase is not configured, return a mock success
    if (!supabase) {
      console.log(`[MOCK] Waitlist signup: ${email}`);
      return Response.json(
        { message: "Successfully joined the waitlist!", mock: true },
        { status: 200 }
      );
    }

    // Insert into Supabase
    const { error } = await supabase
      .from("waitlist_leads")
      .insert([{ email }]);

    if (error) {
      // Handle duplicate emails
      if (error.code === "23505") {
        return Response.json(
          { error: "This email is already on the waitlist!" },
          { status: 409 }
        );
      }
      throw error;
    }

    return Response.json(
      { message: "Successfully joined the waitlist!" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Waitlist API error:", err);
    return Response.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
