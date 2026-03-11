import { FirebaseApp } from "firebase/app";
import { Firestore } from "firebase/firestore";
import { Auth } from "firebase/auth";
import { FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let appInstance: FirebaseApp | undefined;
let dbInstance: Firestore | undefined;
let authInstance: Auth | undefined;
let storageInstance: FirebaseStorage | undefined;

export const getFirebaseApp = async () => {
    if (!appInstance) {
        const { initializeApp, getApps, getApp } = await import("firebase/app");
        appInstance = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    }
    return appInstance;
};

export const getDb = async () => {
    if (!dbInstance) {
        const { getFirestore } = await import("firebase/firestore");
        const app = await getFirebaseApp();
        dbInstance = getFirestore(app);
    }
    return dbInstance;
};

export const getAuthInstance = async () => {
    if (!authInstance) {
        const { getAuth } = await import("firebase/auth");
        const app = await getFirebaseApp();
        authInstance = getAuth(app);
    }
    return authInstance;
};

export const getStorageInstance = async () => {
    if (!storageInstance) {
        const { getStorage } = await import("firebase/storage");
        const app = await getFirebaseApp();
        storageInstance = getStorage(app);
    }
    return storageInstance;
};

// Deprecated constants - these will now trigger async loading if accessed
// WARNING: Accessing these will still block the caller if they expect sync results
// Better to migrate all callers to async getters
export const db = (null as unknown as Firestore);
export const auth = (null as unknown as Auth);
export const storage = (null as unknown as FirebaseStorage);
