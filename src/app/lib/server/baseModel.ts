import { databases } from "@/app/lib/server/node-appwrite";

const databaseId = process.env.DATABASE_ID!;

export const baseModel = (collectionId: string) => ({
    create: <T extends Record<string, unknown>>(data: T) => {
        return databases.createDocument(
            databaseId,
            collectionId,
            'unique()',
            data
        );
    },

    findMany: (queries = []) => {
        return databases.listDocuments(
            databaseId,
            collectionId,
            queries
        );
    },

    findOne: (id: string) => {
        return databases.getDocument(
            databaseId,
            collectionId,
            id
        );
    },

    update: <T extends Record<string, unknown>>(id: string, data: T) => {
        return databases.updateDocument(
            databaseId,
            collectionId,
            id,
            data
        );
    },

    delete: (id: string) => {
        return databases.deleteDocument(
            databaseId,
            collectionId,
            id
        );
    },
});