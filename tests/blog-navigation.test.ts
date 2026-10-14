import assert from "node:assert/strict"
import { test } from "node:test"
import posts from "../data/blog-posts.json"
import { buildBlogNavigation } from "../src/lib/blog-navigation"

test("every contents link in the catalog has a matching heading anchor", () => {
  for (const post of posts) {
    const result = buildBlogNavigation(post.content, post.tableOfContents)
    assert.equal(result.tableOfContents.length, post.tableOfContents.length, post.slug)
    for (const item of post.tableOfContents) {
      assert.ok(result.tableOfContents.some((section) => section.id === item.id), `${post.slug}: ${item.id}`)
      assert.ok(result.content.includes(`id="${item.id}"`))
    }
  }
})

test("custom headings retain existing IDs and get unique, readable fallback anchors", () => {
  const result = buildBlogNavigation('<h2 id="intro">Intro &amp; overview</h2><h2><em>Café</em></h2><h2>Café</h2>', [])
  assert.deepEqual(result.tableOfContents, [
    { id: "intro", label: "Intro & overview" },
    { id: "section-cafe", label: "Café" },
    { id: "section-cafe-2", label: "Café" },
  ])
})
