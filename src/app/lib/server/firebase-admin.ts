import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

if (!getApps().length) {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountString) {
        throw new Error("The FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set.");
    }
    const serviceAccount = JSON.parse(serviceAccountString);
    if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    initializeApp({
        credential: cert(serviceAccount),
    });
}

export const adminAuth = getAuth(); 