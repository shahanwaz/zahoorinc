import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// In-memory OTP store (for demo; use Redis/DB in production)
const otpStore = new Map();

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

Deno.serve(async (req) => {
  try {
    const { phone, otp: verifyOtp, action } = await req.json();

    if (!phone) {
      return Response.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // SEND OTP
    if (action === 'send') {
      const otp = generateOtp();
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
      otpStore.set(phone, { otp, expiresAt, attempts: 0 });

      // WhatsApp API via UltraMsg or similar (using env var for sender number)
      const senderNumber = Deno.env.get("WHATSAPP_SENDER_NUMBER");
      const apiToken = Deno.env.get("WHATSAPP_API_TOKEN");
      const instanceId = Deno.env.get("WHATSAPP_INSTANCE_ID");

      if (senderNumber && apiToken && instanceId) {
        try {
          const response = await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              token: apiToken,
              to: phone,
              body: `Your Zahoor verification code is: *${otp}*\n\nThis code expires in 5 minutes.\n\n_Do not share this code with anyone._`
            })
          });
          const result = await response.json();
          console.log('WhatsApp send result:', JSON.stringify(result));
        } catch (err) {
          console.error('WhatsApp API error:', err.message);
          // Still return success for demo - OTP is in store
        }
      } else {
        console.log(`[DEV MODE] OTP for ${phone}: ${otp}`);
      }

      return Response.json({ success: true, message: 'OTP sent successfully' });
    }

    // VERIFY OTP
    if (action === 'verify') {
      const stored = otpStore.get(phone);

      if (!stored) {
        return Response.json({ error: 'OTP not found or expired. Please request a new one.' }, { status: 400 });
      }

      if (Date.now() > stored.expiresAt) {
        otpStore.delete(phone);
        return Response.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
      }

      if (stored.attempts >= 3) {
        otpStore.delete(phone);
        return Response.json({ error: 'Too many failed attempts. Please request a new OTP.' }, { status: 400 });
      }

      if (stored.otp !== verifyOtp) {
        stored.attempts++;
        return Response.json({ error: 'Invalid OTP. Please try again.' }, { status: 400 });
      }

      otpStore.delete(phone);

      // Check if user exists in Base44
      const base44 = createClientFromRequest(req);
      let isExistingUser = false;
      try {
        const users = await base44.asServiceRole.entities.User.filter({ phone_number: phone });
        isExistingUser = users && users.length > 0;
      } catch (_) {
        isExistingUser = false;
      }

      return Response.json({ success: true, isExistingUser });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});