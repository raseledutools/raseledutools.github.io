// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGd3KAo45UuqmeGFALziz_oKm3htEASHY",
  projectId: "mywebtools-f8d53",
  messagingSenderId: "979594414301",
  appId: "1:979594414301:web:7048c995e56e331a85f334"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 1. Service Worker Register kora (GitHub Pages er root folder e thakte hobe)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully with scope:', registration.scope);
        // Registration sfol hole permission chaoar function call hobe
        initNotification();
      })
      .catch((err) => {
        console.error('Service Worker registration failed:', err);
      });
  });
}

// 2. Permission ebong Token Generator Function
function initNotification() {
  console.log('Requesting notification permission...');
  
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      
      // 3. VAPID Key diye Token neya
      messaging.getToken({ 
        vapidKey: 'BOVXtUUCRy2p5-QqB1orahGTjdc1FGVIMJBf76hArZMnoWAtTpFodxPs1FjyX1gefbKB08RTUUbqDit2XeKc0DU' 
      }).then((currentToken) => {
        if (currentToken) {
          console.log('User Token (Copy this for testing):', currentToken);
          // Ekhane apni chaile token-ti server-e save korte paren
        } else {
          console.warn('No registration token available. Request permission to generate one.');
        }
      }).catch((err) => {
        console.error('An error occurred while retrieving token: ', err);
      });
    } else {
      console.warn('User denied notification permission.');
    }
  });
}

// 4. Foreground Message (Jokhon website khola thakbe)
messaging.onMessage((payload) => {
  console.log('Message received in foreground: ', payload);
  
  // Browser-e website cholakalin alert dekhabe
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'developer.jpg'
  };

  // Custom alert ba notification dekhano
  alert(`${notificationTitle}: ${notificationOptions.body}`);
});