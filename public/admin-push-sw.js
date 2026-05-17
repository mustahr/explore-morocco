self.addEventListener("push", (event) => {
  let payload = {
    title: "Saharavanta Admin",
    body: "New admin activity is available.",
    url: "/admin",
    tag: "saharavanta-admin",
  }

  if (event.data) {
    try {
      payload = { ...payload, ...event.data.json() }
    } catch {
      payload.body = event.data.text()
    }
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/saharavanta-logo.png",
      badge: "/saharavanta-logo.png",
      tag: payload.tag,
      data: {
        url: payload.url || "/admin",
      },
    }),
  )
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const targetUrl = new URL(event.notification.data?.url || "/admin", self.location.origin).href

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes("/admin") && "focus" in client) {
          client.navigate(targetUrl)
          return client.focus()
        }
      }

      if (clients.openWindow) return clients.openWindow(targetUrl)
      return undefined
    }),
  )
})
