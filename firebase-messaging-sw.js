// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDGd3KAo45UuqmeGFALziz_oKm3htEASHY",
  projectId: "mywebtools-f8d53",
  messagingSenderId: "979594414301",
  appId: "1:979594414301:web:7048c995e56e331a85f334"
});

const messaging = firebase.messaging();

// Background Notification Handling
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message received ', payload);
  
  const notificationTitle = payload.notification?.title || "Admin Update | Rasel Mia";
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.message || "New Update from Web Tools Suite",
    icon: 'developer.jpg', // নিশ্চিত করুন এই ফাইলটি আপনার রুট ডিরেক্টরিতে আছে
    badge: 'developer.jpg', // ছোট আইকন হিসেবে দেখাবে
    vibrate: [200, 100, 200],
    data: {
        url: payload.data?.url || '/' // ক্লিক করলে কোথায় যাবে তার জন্য
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// নোটিফিকেশনে ক্লিক করলে ওয়েবসাইট ওপেন হওয়ার লজিক
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});