import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged, 
  signOut, 
  updateProfile 
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCq9TElPYzJBVDasyLoFd_N47ORdwk37CQ",
  authDomain: "questionbank-931e8.firebaseapp.com",
  projectId: "questionbank-931e8",
  storageBucket: "questionbank-931e8.firebasestorage.app",
  messagingSenderId: "67582456744",
  appId: "1:67582456744:web:5d0539dfe8337ea8a0239d",
  measurementId: "G-6QNBR07VH5"
};

// Initialize Firebase safely
let app;
let analytics = null;
let auth = null;
let db = null;
const googleProvider = new GoogleAuthProvider();

try {
  app = initializeApp(firebaseConfig);
  if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
  }
  auth = getAuth(app);
  db = getFirestore(app);
} catch (err) {
  console.warn("Firebase initialization warning:", err);
}

export function trackEvent(eventName, eventParams = {}) {
  try {
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
    }
  } catch (err) {
    console.warn("Analytics event error:", err);
  }
}

export function parseFirebaseError(err) {
  const code = err?.code || "";
  switch (code) {
    case "auth/invalid-email":
      return "Invalid email address format.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password. Please try again.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed before completing.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    default:
      if (err?.message && err.message.includes("requests-from-referer")) {
        return "Domain not authorized in Firebase/Google Cloud: Requests from localhost:3000 are restricted on this API key.";
      }
      return err?.message || "Authentication failed. Please try again.";
  }
}

export const authApi = {
  onAuthStateChanged: (cb) => {
    if (auth) return onAuthStateChanged(auth, cb);
    return () => {};
  },
  signInEmail: (email, pass) => {
    if (!auth) throw new Error("Firebase Auth is not initialized");
    return signInWithEmailAndPassword(auth, email, pass);
  },
  signUpEmail: async (email, pass, name) => {
    if (!auth) throw new Error("Firebase Auth is not initialized");
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (name && cred.user) {
      await updateProfile(cred.user, { displayName: name });
    }
    // Create initial user doc in Firestore
    if (db && cred.user) {
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: name || cred.user.email.split("@")[0],
        createdAt: serverTimestamp(),
      }, { merge: true });
    }
    return cred;
  },
  signInWithGoogle: async () => {
    if (!auth) throw new Error("Firebase Auth is not initialized");
    const cred = await signInWithPopup(auth, googleProvider);
    if (db && cred.user) {
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || cred.user.email.split("@")[0],
        photoURL: cred.user.photoURL,
        lastLogin: serverTimestamp(),
      }, { merge: true });
    }
    return cred;
  },
  signOut: () => {
    if (!auth) return Promise.resolve();
    return signOut(auth);
  },
  getCurrentUser: () => (auth ? auth.currentUser : null)
};

export const firestoreApi = {
  saveUserProgress: async (uid, userState) => {
    if (!db || !uid) return;
    try {
      const progressRef = doc(db, "users", uid, "data", "progress");
      await setDoc(progressRef, {
        progress: userState,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      console.warn("Firestore save progress error:", err);
    }
  },
  getUserProgress: async (uid) => {
    if (!db || !uid) return null;
    try {
      const progressRef = doc(db, "users", uid, "data", "progress");
      const docSnap = await getDoc(progressRef);
      if (docSnap.exists()) {
        return docSnap.data().progress || null;
      }
    } catch (err) {
      console.warn("Firestore get progress error:", err);
    }
    return null;
  },
  listenToUserProgress: (uid, callback) => {
    if (!db || !uid) return () => {};
    const progressRef = doc(db, "users", uid, "data", "progress");
    return onSnapshot(progressRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data().progress || null);
      }
    }, (err) => {
      console.warn("Firestore progress listener error:", err);
    });
  }
};

export { app, analytics, auth, db };
