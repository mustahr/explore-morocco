type ContentsItem = { id: string; label: string }

function headingText(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/&(amp|quot|apos|nbsp|lt|gt);/g,
    (_, entity: string) => ({ amp: "&", quot: '"', apos: "'", nbsp: " ", lt: "<", gt: ">" })[entity] || "")
    .replace(/&#(x[0-9a-f]+|[0-9]+);/gi, (_, code: string) => {
      const value = code.startsWith("x") ? parseInt(code.slice(1), 16) : Number(code)
      return value > 0 && value <= 0x10ffff ? String.fromCodePoint(value) : ""
    }).trim()
}

function normalized(text: string) {
  return text.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim()
}

function attribute(text: string) {
  return text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

// Build the links and heading anchors together, including older database posts without IDs.
export function buildBlogNavigation(content: string, savedContents: ContentsItem[]) {
  const tableOfContents: ContentsItem[] = []
  const used = new Set<string>()
  const html = content.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi, (_, attrs: string, inner: string) => {
    const label = headingText(inner)
    const text = normalized(label)
    const saved = savedContents.find((item) => {
      const candidate = normalized(item.label)
      return candidate && (candidate === text || text.startsWith(`${candidate} `))
    })
    const existing = attrs.match(/\bid\s*=\s*(?:"([^"]*)"|'([^']*)')/i)
    const base = headingText(existing?.[1] || existing?.[2] || saved?.id || "") || `section-${text.replace(/ /g, "-") || tableOfContents.length + 1}`
    let id = base
    let suffix = 2
    while (used.has(id)) id = `${base}-${suffix++}`
    used.add(id)
    tableOfContents.push({ id, label: saved?.label || label })
    const cleanAttrs = attrs.replace(/\s+id\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    return `<h2${cleanAttrs} id="${attribute(id)}" tabindex="-1">${inner}</h2>`
  })
  return { content: html, tableOfContents }
}
