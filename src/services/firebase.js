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
  saveUserProgress: async (user, userState, chaptersData) => {
    if (!db || !user?.uid) return;
    try {
      const email = user.email || "";
      const name = user.displayName || email.split("@")[0] || "Student";
      
      // Calculate overall and chapter-by-chapter statistics
      let totalAnswered = 0;
      let totalCorrect = 0;
      const totalQuestions = 210;
      const chaptersBreakdown = {};

      const chapterKeys = ['ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7'];
      chapterKeys.forEach((key) => {
        const chapState = userState[key] || {};
        const answeredCount = Object.keys(chapState).length;
        let correctCount = 0;

        Object.values(chapState).forEach((ans) => {
          if (ans?.isCorrect) correctCount++;
        });

        totalAnswered += answeredCount;
        totalCorrect += correctCount;

        const chapInfo = chaptersData?.[key];
        chaptersBreakdown[key] = {
          chapterKey: key,
          title: chapInfo?.title || `Chapter ${key.replace('ch', '')}`,
          answeredCount,
          correctCount,
          totalQuestions: 30,
          accuracyPercent: answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0,
          isComplete: answeredCount === 30,
          answers: chapState,
        };
      });

      const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

      const userRecord = {
        uid: user.uid,
        email: email,
        name: name,
        displayName: name,
        lastActive: serverTimestamp(),
        overallScore: totalCorrect,
        totalAnswered: totalAnswered,
        totalQuestions: totalQuestions,
        overallAccuracy: overallAccuracy,
        chapters: chaptersBreakdown,
        rawProgress: userState,
      };

      // 1. Save to primary users collection by UID
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, userRecord, { merge: true });

      // 2. Also save to user_progress collection with email for easy identification in Firebase Console
      if (email) {
        const sanitizedEmail = email.toLowerCase().replace(/[^a-z0-9_@.-]/g, "_");
        const emailRef = doc(db, "user_progress_by_email", sanitizedEmail);
        await setDoc(emailRef, userRecord, { merge: true });
      }
    } catch (err) {
      console.warn("Firestore save progress error:", err);
    }
  },

  getUserProgress: async (uid) => {
    if (!db || !uid) return null;
    try {
      const userRef = doc(db, "users", uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.rawProgress) return data.rawProgress;
        if (data.chapters) {
          // Reconstruct rawProgress from chapters breakdown if rawProgress not present
          const reconstructed = {};
          Object.keys(data.chapters).forEach((k) => {
            reconstructed[k] = data.chapters[k].answers || {};
          });
          return reconstructed;
        }
      }
    } catch (err) {
      console.warn("Firestore get progress error:", err);
    }
    return null;
  },

  listenToUserProgress: (uid, callback) => {
    if (!db || !uid) return () => {};
    const userRef = doc(db, "users", uid);
    return onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.rawProgress) {
          callback(data.rawProgress);
        } else if (data.chapters) {
          const reconstructed = {};
          Object.keys(data.chapters).forEach((k) => {
            reconstructed[k] = data.chapters[k].answers || {};
          });
          callback(reconstructed);
        }
      }
    }, (err) => {
      console.warn("Firestore progress listener error:", err);
    });
  }
};

export { app, analytics, auth, db };
