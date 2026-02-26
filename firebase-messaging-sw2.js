// firebase-messaging-sw.js - Background Notification Handler
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDGd3KAo45UuqmeGFALziz_oKm3htEASHY",
    projectId: "mywebtools-f8d53",
    messagingSenderId: "979594414301",
    appId: "1:979594414301:web:7048c995e56e331a85f334"
});

const messaging = firebase.messaging();

// Background message receive hole ei code notification dekhabe
messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.data.title || "Nexus Messenger Notif";
    const notificationOptions = {
        body: payload.data.body || "Notun ekti message chole esheche!",
        icon: 'developer.jpg',
        badge: 'developer.jpg',
        tag: 'nexus-chat-notif',
        renotify: true
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});