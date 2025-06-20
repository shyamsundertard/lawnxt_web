import { FirebaseError } from "firebase/app";

export const handleFirebaseError = (error: unknown, message: string) => {
    if (error instanceof FirebaseError) {
        console.error(`${message}: ${error.message}`);
        throw error;
    }
    console.error(`${message}: ${error}`);
    throw error;
};