import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// ★★★ Firebase Console에서 복사한 config를 여기에 붙여넣으세요 ★★★
const firebaseConfig = {
  apiKey: "여기에-복사",
  authDomain: "wiro-os.firebaseapp.com",
  projectId: "wiro-os",
  storageBucket: "wiro-os.firebasestorage.app",
  messagingSenderId: "여기에-복사",
  appId: "여기에-복사"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 익명 인증 (Firestore 쓰기 권한용)
signInAnonymously(auth).catch(console.error);

// 데이터 읽기
export async function LD(key, fallback) {
  try {
    const snap = await getDoc(doc(db, "wiro", key));
    return snap.exists() ? JSON.parse(snap.data().value) : fallback;
  } catch {
    return fallback;
  }
}

// 데이터 저장
export async function SV(key, value) {
  try {
    await setDoc(doc(db, "wiro", key), {
      value: JSON.stringify(value),
      updatedAt: new Date().toISOString()
    });
  } catch (e) {
    console.error("Save error:", e);
  }
}

// 실시간 리스너 (다른 사용자 변경 즉시 반영)
export function onData(key, callback) {
  return onSnapshot(doc(db, "wiro", key), (snap) => {
    if (snap.exists()) {
      try { callback(JSON.parse(snap.data().value)); } catch {}
    }
  });
}

export { db, auth };
