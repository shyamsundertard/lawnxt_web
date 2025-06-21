import { 
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../firebase';

// Helper function to convert Appwrite queries to Firestore queries
const convertQueries = (queries?: string[]): QueryConstraint[] => {
  if (!queries) return [];
  
  return queries.map(q => {
    const [field, operator, value] = q.split(' ');
    switch (operator) {
      case '==':
        return where(field, '==', value);
      case '!=':
        return where(field, '!=', value);
      case '>':
        return where(field, '>', value);
      case '>=':
        return where(field, '>=', value);
      case '<':
        return where(field, '<', value);
      case '<=':
        return where(field, '<=', value);
      case 'orderDesc':
        return orderBy(field, 'desc');
      case 'orderAsc':
        return orderBy(field, 'asc');
      case 'limit':
        return limit(parseInt(value));
      default:
        return where(field, '==', value);
    }
  });
};

export const createDocument = async (collectionId: string, data: object) => {
  try {
    const docRef = await addDoc(collection(db, collectionId), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    const docSnap = await getDoc(docRef);
    return { $id: docRef.id, ...docSnap.data() };
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
};

export const fetchDocuments = async (collectionId: string, queries?: string[]) => {
  try {
    const q = query(
      collection(db, collectionId),
      ...convertQueries(queries)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      $id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};

export const getDocument = async (collectionId: string, documentId: string) => {
  try {
    const docRef = doc(db, collectionId, documentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { $id: docSnap.id, ...docSnap.data() };
    }
    throw new Error('Document not found');
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

export const updateDocument = async (
  collectionId: string,
  documentId: string,
  data: object
) => {
  try {
    const docRef = doc(db, collectionId, documentId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
    const updatedDoc = await getDoc(docRef);
    return { $id: updatedDoc.id, ...updatedDoc.data() };
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
    await deleteDoc(doc(db, collectionId, documentId));
    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}; 