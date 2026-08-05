// Service worker cho "Sổ tay" - chỉ dùng để nhận thông báo đẩy (Web Push).
// KHÔNG cache gì cả (app luôn cần dữ liệu mới nhất từ server) - đây không
// phải một PWA offline-first, chỉ mượn cơ chế Service Worker vì Push API
// bắt buộc phải có một service worker đang chạy để nhận sự kiện "push".

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: "🔔 Sổ tay", body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "🔔 Sổ tay";
  const options = {
    body: data.body || "",
    tag: "so-tay-reminder", // gộp nhiều lần push cùng ngày thành 1 thông báo
    renotify: true,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Bấm vào thông báo: mở app nếu đã có tab đang mở, mở tab mới nếu chưa.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ("focus" in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow("./");
    })
  );
});
