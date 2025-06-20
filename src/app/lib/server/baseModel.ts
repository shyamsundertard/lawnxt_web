import { 
    createDocument,
    fetchDocuments,
    getDocument,
    updateDocument,
    deleteDocument
} from '@/app/lib/database';

export const baseModel = (collectionId: string) => ({
    create: <T extends Record<string, unknown>>(data: T) => {
        return createDocument(collectionId, data);
    },

    findMany: (queries = []) => {
        return fetchDocuments(collectionId, queries);
    },

    findOne: (id: string) => {
        return getDocument(collectionId, id);
    },

    update: <T extends Record<string, unknown>>(id: string, data: T) => {
        return updateDocument(collectionId, id, data);
    },

    delete: (id: string) => {
        return deleteDocument(collectionId, id);
    },
});