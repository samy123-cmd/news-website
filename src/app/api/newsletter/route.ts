
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
        }

        const supabase = await createClient();

        const { error } = await supabase
            .from("newsletter_subscribers")
            .insert({ email });

        if (error) {
            if (error.code === "23505") { // Unique violation
                return NextResponse.json({ message: "You are already subscribed!" }, { status: 200 });
            }
            console.error("Newsletter Error:", error);
            return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
        }

        return NextResponse.json({ message: "Successfully subscribed!" }, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
