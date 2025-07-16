// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js",
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyAZHMepMRhxA1v7EBHj-7GqGkbHUB9UtQE",
  authDomain: "binspire-4f562.firebaseapp.com",
  projectId: "binspire-4f562",
  storageBucket: "binspire-4f562.firebasestorage.app",
  messagingSenderId: "375695605929",
  appId: "1:375695605929:web:dae7931a3eecd92f49a9b8",
  measurementId: "G-Q38F6BW1CC",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || "https://binspire.app/assets/logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
