// constants/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAjiNH7xxfKeKRHK6xK4cCUBhnfulejLIg",
  authDomain: "driver-behavior-monitoring.firebaseapp.com",
  projectId: "driver-behavior-monitoring",
  storageBucket: "driver-behavior-monitoring.appspot.com",
  messagingSenderId: "309405675586",
  appId: "1:309405675586:android:5d6f62caaca6722c80bddb"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
