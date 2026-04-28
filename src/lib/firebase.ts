import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDocFromServer, enableIndexedDbPersistence } from "firebase/firestore";
import firebaseConfig from "@/firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Enable persistence for offline capability
if (typeof window !== "undefined") {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code !== 'failed-precondition' && err.code !== 'unimplemented') {
      console.warn("Firestore persistence warning:", err.message);
    }
  });
}

async function testConnection() {
  try {
    if (navigator.onLine) {
      await getDocFromServer(doc(db, 'test', 'connection'));
      console.log("BTS Cafe: Connected 💜");
    }
  } catch (error) {
    // Suppress noise for expected offline states
    const isOffline = error instanceof Error && error.message.includes('offline');
    if (!isOffline) {
      console.debug("Note: Firestore server unreachable (app will use local cache)", error);
    }
  }
}
testConnection();
