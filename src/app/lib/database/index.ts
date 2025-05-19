import { databases } from "../server/node-appwrite";

const databaseId = process.env.DATABASE_ID as string;

export const createDocument = async (collectionId: string, data: object) => {
  try {
    const response = await databases.createDocument(
      databaseId,
      collectionId,
      "unique()",
      data
    );
    return response;
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
};

export const fetchDocuments = async (collectionId: string, queries?: string[]) => {
  try {
    const response = await databases.listDocuments(
      databaseId,
      collectionId,
      queries
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};

export const updateDocument = async (
  collectionId: string,
  documentId: string,
  data: object
) => {
  try {
    const response = await databases.updateDocument(
      databaseId,
      collectionId,
      documentId,
      data
    );
    return response;
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

export const deleteDocument = async (
  collectionId: string,
  documentId: string
) => {
  try {
    await databases.deleteDocument(databaseId, collectionId, documentId);
    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};
