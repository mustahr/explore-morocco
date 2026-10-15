import assert from "node:assert/strict"
import { test } from "node:test"
import { normalizeCampaignDesign, renderCampaignEmail } from "../src/lib/email-template"

test("branded email includes email-compatible assets, real links and escaped content", () => {
  const design = normalizeCampaignDesign({ buttonLabel: "Book your escape", buttonUrl: "https://example.com/offer?a=1&b=2", instagramUrl: "https://www.instagram.com/dunexplore/", facebookUrl: "https://www.facebook.com/dunexplore/", imageUrl: "https://example.com/hero.jpg" })
  const html = renderCampaignEmail('Our <special> offer', 'Hello <script>alert(1)</script>\n\nVisit https://example.com/trips?a=1&b=2', "https://example.com", "https://example.com/unsubscribe?token=signed", design)
  assert.ok(html.includes('role="presentation"'))
  assert.ok(html.includes('dunexplore-logo-transparent.png'))
  assert.ok(html.includes('src="https://example.com/hero.jpg"'))
  assert.ok(html.includes('Book your escape'))
  assert.ok(html.includes('href="https://example.com/offer?a=1&amp;b=2"'))
  assert.ok(html.includes('instagram.png'))
  assert.ok(html.includes('facebook.png'))
  assert.ok(html.includes('https://wa.me/212608731353'))
  assert.ok(html.includes('mailto:contact@dunexplore-morocco.com'))
  assert.ok(html.includes('&lt;script&gt;'))
  assert.ok(!html.includes('<script>'))
  assert.ok(html.includes('https://example.com/unsubscribe?token=signed'))
  const defaults = renderCampaignEmail("Morocco awaits", "Hello", "https://example.com", "https://example.com/unsubscribe")
  assert.ok(defaults.includes('src="https://example.com/images/email/sahara.jpg"'))
  assert.ok(!defaults.includes('instagram.png'))
  assert.ok(!defaults.includes('facebook.png'))
  assert.ok(defaults.includes('@media only screen'))
})

test("campaign design rejects unsafe URLs and invented social destinations", () => {
  assert.throws(() => normalizeCampaignDesign({ buttonUrl: "javascript:alert(1)" }))
  assert.throws(() => normalizeCampaignDesign({ imageUrl: "http://example.com/image.jpg" }))
  assert.throws(() => normalizeCampaignDesign({ instagramUrl: "https://instagram.com.evil.example/" }))
  assert.throws(() => normalizeCampaignDesign({ facebookUrl: "https://example.com/" }))
  assert.throws(() => normalizeCampaignDesign({ buttonUrl: 'https://user:pass@example.com/' }))
  assert.deepEqual(normalizeCampaignDesign(null), {})
})
