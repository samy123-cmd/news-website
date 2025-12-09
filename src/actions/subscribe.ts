"use server";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { z } from "zod";

// Initialized lazily inside the action

const subscribeSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
    const email = formData.get("email");

    // 1. Validate Email
    const validatedFields = subscribeSchema.safeParse({ email });

    if (!validatedFields.success) {
        return {
            success: false,
            message: validatedFields.error.flatten().fieldErrors.email?.[0] || "Invalid email",
        };
    }

    const validEmail = validatedFields.data.email;
    const supabase = await createClient();


    try {
        // 2. Check if already subscribed (Optional: Upsert handles this if unique constraint exists)
        // We'll rely on the unique constraint on the 'email' column in 'subscribers' table.

        // 3. Save to Supabase
        const { error: dbError } = await supabase
            .from("subscribers")
            .insert({ email: validEmail, status: 'active' });

        if (dbError) {
            if (dbError.code === "23505") { // Unique violation
                return { success: false, message: "You are already subscribed!" };
            }
            console.error("Database Error:", dbError);
            return { success: false, message: "Something went wrong. Please try again." };
        }

        // 4. Send Welcome Email via Resend
        const apiKey = process.env.RESEND_API_KEY;
        if (apiKey) {
            const resend = new Resend(apiKey);
            const { error: emailError } = await resend.emails.send({
                from: "Global News AI <onboarding@resend.dev>", // Default for testing. Change for production.
                to: validEmail,
                subject: "Welcome to Global News AI 🌍",
                html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Welcome to the Future of News! 🚀</h1>
          <p>Hi there,</p>
          <p>Thank you for subscribing to the <strong>Global News AI</strong> Daily Brief.</p>
          <p>You've just joined a community of forward-thinking professionals staying ahead of the curve with AI-curated journalism.</p>
          <hr />
          <p><strong>What to expect:</strong></p>
          <ul>
            <li>Top 5 global stories, summarized by AI.</li>
            <li>Unbiased, fact-checked reporting.</li>
            <li>Delivered straight to your inbox daily.</li>
          </ul>
          <p>Stay tuned for your first brief!</p>
          <p>Best,<br/>The Global News AI Team</p>
        </div>
      `,
            });

            if (emailError) {
                console.error("Resend Error:", emailError);
            }
        } else {
            console.warn("RESEND_API_KEY missing, skipping email.");
        }

        return { success: true, message: "Successfully subscribed! Check your inbox." };

    } catch (error) {
        console.error("Subscription Error:", error);
        return { success: false, message: "An unexpected error occurred." };
    }
}
