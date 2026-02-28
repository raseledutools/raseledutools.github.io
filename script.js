// Firebase configuration (আপনার দেওয়া আগের কনফিগারেশন)
const firebaseConfig = {
  apiKey: "AIzaSyDGd3KAo45UuqmeGFALziz_oKm3htEASHY",
  projectId: "mywebtools-f8d53",
  messagingSenderId: "979594414301",
  appId: "1:979594414301:web:7048c995e56e331a85f334"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database(); 
const auth = firebase.auth();

// ১. সার্ভিস ওয়ার্কার রেজিস্টার (আপনার sw.js আগের মতোই থাকবে)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((registration) => {
        console.log('Service Worker for Cache registered!');
      })
      .catch((err) => {
        console.error('SW registration failed:', err);
      });
  });
}

// ২. OneSignal ইউজার আইডি হ্যান্ডেল করা
window.OneSignalDeferred = window.OneSignalDeferred || [];
OneSignalDeferred.push(async function(OneSignal) {
    
    // ইউজার যখন নোটিফিকেশন পারমিশন দেবে বা আইডি পরিবর্তন হবে
    OneSignal.User.PushSubscription.addEventListener("change", (event) => {
        const oneSignalUserId = event.current.id;
        if (oneSignalUserId) {
            saveOneSignalIdToFirebase(oneSignalUserId);
        }
    });

    // বর্তমান আইডি চেক করা
    const currentId = OneSignal.User.PushSubscription.id;
    if (currentId) {
        saveOneSignalIdToFirebase(currentId);
    }
});

// ৩. Firebase-এ OneSignal Player ID সেভ করার ফাংশন
// এটি আপনার ডাটাবেসের 'users/ইউজার_আইডি/onesignal_id' তে সেভ হবে
function saveOneSignalIdToFirebase(playerId) {
    auth.onAuthStateChanged((user) => {
        if (user && playerId) {
            db.ref('users/' + user.uid).update({
                onesignal_id: playerId
            }).then(() => {
                console.log('OneSignal ID saved to Firebase:', playerId);
            });
        }
    });
}

// ৪. পুশ নোটিফিকেশন পাঠানোর মেইন ফাংশন
// targetOneSignalId = যাকে পাঠাবেন তার আইডি, messageText = মেসেজ বডি
function sendPushNotification(targetOneSignalId, messageText) {
    // OneSignal Dashboard > Settings > Keys & IDs থেকে REST API Key টি এখানে বসান
    const restApiKey = "os_v2_app_kivtcnwbnvg6xbbdotnmhvsffzag6wdfng7ufmfb7dtdwn2k4nr43uy5xgi6zvzqfyttgujh3yhn4eghuttyixea2o7dopgljwgq3uq"; 
    
    fetch("https://onesignal.com/api/v1/notifications", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Basic " + restApiKey
        },
        body: JSON.stringify({
            app_id: "522b3136-c16d-4deb-8423-74dac3d6452e",
            include_player_ids: [targetOneSignalId],
            contents: {"en": messageText},
            headings: {"en": "RasGram-এ নতুন মেসেজ"},
            android_channel_id: "PUSH_CHANNEL_ID", // OneSignal-এ চ্যানেল থাকলে দিতে পারেন
            priority: 10
        })
    })
    .then(response => response.json())
    .then(data => console.log("Success:", data))
    .catch(error => console.error("Error:", error));
}
