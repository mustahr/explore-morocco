import assert from "node:assert/strict"
import { test } from "node:test"
import { readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import ts from "typescript"
import { publicMessages, translate, formatLocalizedDate } from "../src/lib/localization"

const tokens = (s: string) => [...s.matchAll(/\{\w+\}/g)].map((m) => m[0]).sort()

test("French and Arabic dictionaries are complete and preserve interpolation values", () => {
  for (const [key, entry] of Object.entries(publicMessages)) {
    for (const language of ["fr", "ar"] as const) {
      assert.ok(entry[language].trim(), `${language}: ${key}`)
      // Arabic singular count labels naturally omit the explicit numeral.
      if (key === "{count} traveler" || key === "{count} day") continue
      assert.deepEqual(tokens(entry[language]), tokens(key), `${language}: ${key}`)
    }
  }
  assert.equal(translate("fr", "Book a trip to {place}", { place: "Fès" }), "Réserver un voyage à Fès")
  assert.equal(translate("ar", "Book a trip to {place}", { place: "فاس" }), "احجز رحلة إلى فاس")
  assert.equal(translate("fr", "New custom content"), "New custom content")
})

test("booking controls, API feedback, filters and generated plans all translate", () => {
  for (const key of ["Request a booking", "Send booking request", "Booking request received.", "Preferred date", "Travelers", "Full name", "Please choose a valid future start date.", "The selected trip or destination is unavailable.", "Adventure", "Food & Drink", "What’s your budget?", "Arrival & Medina Welcome", "Traditional Riad"]) {
    for (const language of ["fr", "ar"] as const) assert.notEqual(translate(language, key), key, `${language}: ${key}`)
  }
  assert.match(translate("fr", "3 hours"), /heures/)
  assert.match(translate("ar", "3 hours"), /ساعات/)
  assert.match(formatLocalizedDate("fr", "2026-10-15"), /octobre/)
  assert.match(formatLocalizedDate("ar", "2026-10-15"), /أكتوبر/)
  assert.equal(formatLocalizedDate("fr", "Date to confirm"), "Date to confirm")
})

function files(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? files(path.join(directory, entry.name)) : [path.join(directory, entry.name)])
}

test("every explicit public translation key has French and Arabic copy", () => {
  const sources = [...files("src/components"), ...files("src/app/(pages)")].filter((p) => p.endsWith(".tsx") && !p.includes("/admin/"))
  for (const filename of sources) {
    const text = readFileSync(filename, "utf8")
    const source = ts.createSourceFile(filename, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    function visit(node: ts.Node) {
      if (ts.isCallExpression(node) && node.expression.getText(source) === "tr" && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) {
        assert.ok(publicMessages[node.arguments[0].text], `${filename}: ${node.arguments[0].text}`)
      }
      ts.forEachChild(node, visit)
    }
    visit(source)
  }
})
