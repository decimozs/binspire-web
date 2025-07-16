import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyAZHMepMRhxA1v7EBHj-7GqGkbHUB9UtQE",
  authDomain: "binspire-4f562.firebaseapp.com",
  projectId: "binspire-4f562",
  storageBucket: "binspire-4f562.firebasestorage.app",
  messagingSenderId: "375695605929",
  appId: "1:375695605929:web:dae7931a3eecd92f49a9b8",
  measurementId: "G-Q38F6BW1CC",
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);
export const messaging = getMessaging(firebase);

export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log("Notification permission:", permission);

  if (permission !== "granted") {
    console.error("Notification permission not granted");
    return;
  }

  const token = await getToken(messaging, {
    vapidKey:
      "BMCdLGJ5hslmT0wOAhwPi48yUHgfTzvrXVmgusCTzeBPsUgk0tKVlHNJbTpIwLluo8w7JOrsEws4wSpm01U47k4",
  });
  console.log("Firebase token:", token);
};
