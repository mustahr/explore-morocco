import { CONTACT_EMAIL, CONTACT_PHONE, contactWhatsAppHref } from "./contact"

export interface CampaignDesign { imageUrl?: string; buttonLabel?: string; buttonUrl?: string; instagramUrl?: string; facebookUrl?: string }
const escape = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!)
export function normalizeCampaignDesign(value: unknown): CampaignDesign {
  const input = value && typeof value === "object" ? value as Record<string, unknown> : {}
  const design: CampaignDesign = {}
  for (const key of ["imageUrl", "buttonUrl", "instagramUrl", "facebookUrl"] as const) {
    const raw = typeof input[key] === "string" ? input[key].trim() : ""
    if (!raw) continue
    let url: URL
    try { url = new URL(raw) } catch { throw new Error(`Enter a complete HTTPS URL for ${key}.`) }
    if (url.protocol !== "https:" || url.username || url.password || raw.length > 2000) throw new Error(`Use an HTTPS URL for ${key}.`)
    if (key === "instagramUrl" && !["instagram.com", "www.instagram.com"].includes(url.hostname)) throw new Error("Use your instagram.com profile URL.")
    if (key === "facebookUrl" && !["facebook.com", "www.facebook.com", "m.facebook.com", "fb.com", "www.fb.com"].includes(url.hostname)) throw new Error("Use your facebook.com profile URL.")
    design[key] = url.href
  }
  if (typeof input.buttonLabel === "string" && input.buttonLabel.trim()) design.buttonLabel = input.buttonLabel.trim().slice(0, 60)
  return design
}
function messageHtml(message: string) {
  return message.split(/\n\s*\n/).map((paragraph) => {
    const content = paragraph.split(/(https:\/\/[^\s<>]+)/g).map((part) => part.startsWith("https://") ? `<a href="${escape(part)}" style="color:#80621d;text-decoration:underline;word-break:break-word">${escape(part)}</a>` : escape(part).replace(/\n/g, "<br/>" )).join("")
    return `<p style="margin:0 0 20px;font-size:16px;line-height:28px;color:#4e514d;overflow-wrap:anywhere">${content}</p>`
  }).join("")
}
export function renderCampaignEmail(subject: string, message: string, siteUrl: string, unsubscribe: string, design: CampaignDesign = {}) {
  const site = siteUrl.replace(/\/+$/, "")
  const photo = design.imageUrl || `${site}/images/email/sahara.jpg`
  const button = design.buttonUrl || `${site}/trips`
  const label = design.buttonLabel || "Explore Morocco"
  const socials = [
    ...(design.instagramUrl ? [{ name: "Instagram", url: design.instagramUrl, icon: "instagram" }] : []),
    ...(design.facebookUrl ? [{ name: "Facebook", url: design.facebookUrl, icon: "facebook" }] : []),
    { name: "WhatsApp", url: contactWhatsAppHref(), icon: "whatsapp" },
    { name: "Email", url: `mailto:${CONTACT_EMAIL}`, icon: "email" },
  ]
  const socialHtml = socials.map((item) => `<td align="center" style="padding:0 8px"><a href="${escape(item.url)}" aria-label="${item.name}" style="text-decoration:none"><img src="${site}/images/email/${item.icon}.png" alt="${item.name}" width="36" height="36" style="display:block;border:0"/></a></td>`).join("")
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="color-scheme" content="light"/><title>${escape(subject)}</title>
<style>body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}table{border-collapse:collapse}img{border:0;outline:none;text-decoration:none}a{color:inherit}@media only screen and (max-width:620px){.email-wrap{width:100%!important}.email-pad{padding-left:24px!important;padding-right:24px!important}.email-title{font-size:30px!important;line-height:38px!important}.email-outer{padding:12px 0!important}.email-button{display:block!important}}</style></head>
<body style="margin:0;padding:0;background-color:#f2eee6;font-family:Arial,Helvetica,sans-serif">
<div style="display:none;font-size:1px;line-height:1px;color:#f2eee6;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all">${escape(message.slice(0, 140))}</div>
<table role="presentation" width="100%" bgcolor="#f2eee6"><tr><td align="center" class="email-outer" style="padding:32px 12px">
<!--[if mso]><table role="presentation" width="600"><tr><td><![endif]-->
<table role="presentation" width="600" class="email-wrap" style="width:100%;max-width:600px;background-color:#ffffff">
<tr><td bgcolor="#102b24" align="center" style="padding:26px 24px 22px;border-top:4px solid #d4af37"><a href="${site}" style="text-decoration:none"><img src="${site}/dunexplore-logo-transparent.png" width="190" alt="Dunexplore Morocco" style="display:block;width:190px;max-width:100%;height:auto;color:#ead28f;font-size:20px"/></a><p style="margin:14px 0 0;color:#ead28f;font-size:10px;letter-spacing:3px;line-height:16px">LOCAL KNOWLEDGE. UNFORGETTABLE JOURNEYS.</p></td></tr>
<tr><td><a href="${escape(button)}"><img src="${escape(photo)}" alt="Discover the warmth and beauty of Morocco" width="600" style="display:block;width:100%;max-width:600px;height:auto;background-color:#ded4c1;color:#263d34"/></a></td></tr>
<tr><td class="email-pad" style="padding:34px 42px 16px"><p style="margin:0 0 14px;font-size:11px;letter-spacing:2.5px;line-height:18px;color:#8a6c24;font-weight:bold">YOUR NEXT MOROCCO STORY</p><h1 class="email-title" style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-size:38px;line-height:46px;font-weight:normal;color:#142e26;overflow-wrap:anywhere">${escape(subject)}</h1>${messageHtml(message)}
<table role="presentation" style="margin:8px 0 28px"><tr><td align="center" bgcolor="#d4af37" style="border-radius:6px"><a class="email-button" href="${escape(button)}" style="display:inline-block;padding:16px 26px;color:#172b23;font-size:15px;line-height:22px;font-weight:bold;text-decoration:none;border:1px solid #d4af37;border-radius:6px;mso-padding-alt:0;text-underline-color:#d4af37">${escape(label)} &nbsp; &#8594;</a></td></tr></table>
<p style="margin:0 0 20px;font-size:14px;line-height:24px;color:#6e746e">A question about your journey? <a href="${escape(contactWhatsAppHref())}" style="font-weight:bold;color:#234d3f;text-decoration:underline">Chat with our local team</a>.</p></td></tr>
<tr><td class="email-pad" bgcolor="#f7f4ed" style="padding:20px 42px;border-top:1px solid #eee7d9"><table role="presentation" width="100%"><tr><td align="center" style="font-size:12px;line-height:22px;color:#526057"><a href="${site}/trips" style="text-decoration:none">Trips & Tours</a> &nbsp; &middot; &nbsp; <a href="${site}/destinations" style="text-decoration:none">Destinations</a> &nbsp; &middot; &nbsp; <a href="${site}/trip-generator" style="text-decoration:none">Plan a Trip</a></td></tr></table></td></tr>
<tr><td class="email-pad" bgcolor="#102b24" align="center" style="padding:28px 32px"><p style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#f3e9cd">Let’s make it a journey to remember.</p><table role="presentation"><tr>${socialHtml}</tr></table><p style="margin:18px 0 0;font-size:12px;line-height:22px;color:#d4dacd">Dunexplore Morocco &middot; Marrakech, Morocco<br/><a href="mailto:${CONTACT_EMAIL}" style="color:#d4dacd;text-decoration:none">${CONTACT_EMAIL}</a><br/>${CONTACT_PHONE}</p><p style="margin:16px 0 0;font-size:11px;line-height:20px;color:#bbc8bc"><a href="${escape(unsubscribe)}" style="color:#ead28f;text-decoration:underline">Unsubscribe</a> &nbsp; &middot; &nbsp; <a href="${site}/privacy" style="color:#bbc8bc;text-decoration:underline">Privacy Policy</a></p></td></tr>
</table><!--[if mso]></td></tr></table><![endif]-->
</td></tr></table></body></html>`
}
