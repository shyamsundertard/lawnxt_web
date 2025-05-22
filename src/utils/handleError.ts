import { AppwriteException } from "appwrite";

export const handleAppwriteError = (error: unknown, message: string) => {
    if (error instanceof AppwriteException) {
        console.error(`${message}: `, error.message);
    } else {
        console.error(`${message}: `, error);
    }
    return null;
};