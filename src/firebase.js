import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "여기에-복사한-값",
  authDomain: "wiro-os.firebaseapp.com",
  projectId: "wiro-os",
  storageBucket: "wiro-os.firebasestorage.app",
  messagingSenderId: "여기에-복사한-값",
  appId: "여기에-복사한-값"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
signInAnonymously(auth).catch(console.error);

export async function LD(key, fallback) {
  try {
    const snap = await getDoc(doc(db, "wiro", key));
    return snap.exists() ? JSON.parse(snap.data().value) : fallback;
  } catch { return fallback; }
}

export async function SV(key, value) {
  try {
    await setDoc(doc(db, "wiro", key), {
      value: JSON.stringify(value),
      updatedAt: new Date().toISOString()
    });
  } catch (e) { console.error(e); }
}

export function onData(key, callback) {
  return onSnapshot(doc(db, "wiro", key), (snap) => {
    if (snap.exists()) {
      try { callback(JSON.parse(snap.data().value)); } catch {}
    }
  });
}
