# Booking notifications

All trip, generated-trip, destination and experience requests save to Neon and appear in Admin → Bookings. Email notifications use RESEND_API_KEY and the existing notification addresses. Set the API key in Vercel Production and redeploy; domain verification alone does not supply the key.

Automatic WhatsApp notifications require your own WhatsApp Business Platform sender, access token, recipient eligibility and a Meta-approved template. A wa.me link alone cannot send messages automatically.

Set these Vercel Production variables and redeploy:

- WHATSAPP_ACCESS_TOKEN: your server-side access token with WhatsApp messaging permission.
- WHATSAPP_PHONE_NUMBER_ID: the Meta sender phone-number ID, not the phone number itself.
- WHATSAPP_API_VERSION: a supported version for your Meta app, in vNN.N format.
- WHATSAPP_BOOKING_TEMPLATE: approved template name with exactly one text body parameter containing the booking summary. Example template body: `New booking request: {{1}}` (subject to Meta approval).
- WHATSAPP_TEMPLATE_LANGUAGE: the approved template's exact language code; defaults to en.
- WHATSAPP_NOTIFICATION_TO: opted-in recipient number including country code; defaults to 212608731353. Use a sender that can message this recipient; do not use the same number as sender and recipient.

Run Admin → Settings → Automatic WhatsApp alert. “Accepted” means the API accepted the request, not confirmed delivery. Check delivery in Meta.

Missing configuration or notification failures never remove the saved booking. The success screen also offers a prepared WhatsApp copy that the client sends manually. No popup is forced after submission, so mobile popup blockers do not interrupt saving.
