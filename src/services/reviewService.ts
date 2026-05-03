import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Review } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const user = auth?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: user?.uid || null,
      email: user?.email || null,
      emailVerified: user?.emailVerified || null,
      isAnonymous: user?.isAnonymous || null,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const reviewService = {
  async addReview(productId: string, userId: string, userName: string, rating: number, comment: string) {
    if (!db) {
      console.error('Database not initialized. Please configure Firebase.');
      return;
    }
    const path = 'reviews';
    try {
      await addDoc(collection(db, path), {
        productId,
        userId,
        userName,
        rating,
        comment,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  getReviews(productId: string, callback: (reviews: Review[]) => void) {
    if (!db) {
      console.error('Database not initialized. Please configure Firebase.');
      callback([]);
      return () => {};
    }
    const path = 'reviews';
    const q = query(
      collection(db, path),
      where('productId', '==', productId)
    );

    return onSnapshot(q, (snapshot) => {
      const reviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      
      // Sort client-side to avoid composite index requirement
      reviews.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });
      
      callback(reviews);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  }
};
