import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const adminService = {
  // Categories
  async getCategories() {
    const path = 'categories';
    try {
      if (!db) return [];
      const snapshot = await getDocs(collection(db, path));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async addCategory(data: any) {
    const path = 'categories';
    try {
      if (!db) return;
      await addDoc(collection(db, path), {
        ...data,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async updateCategory(id: string, data: any) {
    const path = `categories/${id}`;
    try {
      if (!db) return;
      await updateDoc(doc(db, 'categories', id), {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteCategory(id: string) {
    const path = `categories/${id}`;
    try {
      if (!db) return;
      await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // Products
  async getProducts() {
    const path = 'products';
    try {
      if (!db) return [];
      const snapshot = await getDocs(collection(db, path));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async getProduct(id: string) {
    const path = `products/${id}`;
    try {
      if (!db) return null;
      const docSnap = await getDoc(doc(db, 'products', id));
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  async addProduct(data: any) {
    const path = 'products';
    try {
      if (!db) return;
      await addDoc(collection(db, path), {
        ...data,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async updateProduct(id: string, data: any) {
    const path = `products/${id}`;
    try {
      if (!db) return;
      await updateDoc(doc(db, 'products', id), {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteProduct(id: string) {
    const path = `products/${id}`;
    try {
      if (!db) return;
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // Orders
  async getOrders(statusFilter?: string) {
    const path = 'orders';
    try {
      if (!db) return [];
      let q = query(collection(db, path), orderBy('createdAt', 'desc'));
      if (statusFilter && statusFilter !== 'all') {
        q = query(collection(db, path), where('status', '==', statusFilter), orderBy('createdAt', 'desc'));
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async updateOrderStatus(id: string, status: string) {
    const path = `orders/${id}`;
    try {
      if (!db) return;
      await updateDoc(doc(db, 'orders', id), {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  // Customers (Users with role 'customer')
  async getCustomers() {
    const path = 'users';
    try {
      if (!db) return [];
      const q = query(collection(db, path), where('role', '==', 'customer'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async getCustomerOrders(userId: string) {
    const path = 'orders';
    try {
      if (!db) return [];
      const q = query(collection(db, path), where('userId', '==', userId), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  // Shipping Plans
  async getShippingPlans() {
    const path = 'shipping_plans';
    try {
      if (!db) return [];
      const snapshot = await getDocs(collection(db, path));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async addShippingPlan(data: any) {
    const path = 'shipping_plans';
    try {
      if (!db) return;
      await addDoc(collection(db, path), {
        ...data,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteShippingPlan(id: string) {
    const path = `shipping_plans/${id}`;
    try {
      if (!db) return;
      await deleteDoc(doc(db, 'shipping_plans', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // Payment Settings
  async getPaymentSettings() {
    const path = 'settings/payment';
    try {
      if (!db) return null;
      const docSnap = await getDoc(doc(db, 'settings', 'payment'));
      return docSnap.exists() ? docSnap.data() : {
        cashOnDelivery: true,
        wallets: [],
        instaPay: { address: '', mobile: '', enabled: false }
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  async updatePaymentSettings(data: any) {
    const path = 'settings/payment';
    try {
      if (!db) return;
      await setDoc(doc(db, 'settings', 'payment'), data, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // General Settings
  async getGeneralSettings() {
    const path = 'settings/general';
    try {
      if (!db) return null;
      const docSnap = await getDoc(doc(db, 'settings', 'general'));
      return docSnap.exists() ? docSnap.data() : {
        storeName: 'Zekwa Store',
        storeEmail: 'admin@zekwa.com',
        currency: 'USD',
        language: 'English'
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  async updateGeneralSettings(data: any) {
    const path = 'settings/general';
    try {
      if (!db) return;
      await setDoc(doc(db, 'settings', 'general'), data, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Site Content (CMS)
  async getSiteContent() {
    const path = 'settings/content';
    try {
      if (!db) return null;
      const docSnap = await getDoc(doc(db, 'settings', 'content'));
      return docSnap.exists() ? docSnap.data() : {
        heroTitle: 'THE FUTURE OF LUXURY',
        heroSubtitle: 'EXPLORE OUR CURATED COLLECTION OF HIGH-END TECH AND FASHION',
        heroImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2000&auto=format&fit=crop',
        banners: []
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  async updateSiteContent(data: any) {
    const path = 'settings/content';
    try {
      if (!db) return;
      await setDoc(doc(db, 'settings', 'content'), data, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Pages
  async getPages() {
    const path = 'pages';
    try {
      if (!db) return [];
      const snapshot = await getDocs(collection(db, path));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async getPage(slug: string) {
    const path = `pages/${slug}`;
    try {
      if (!db) return null;
      const q = query(collection(db, 'pages'), where('slug', '==', slug));
      const snapshot = await getDocs(q);
      return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  async addPage(data: any) {
    const path = 'pages';
    try {
      if (!db) return;
      await addDoc(collection(db, path), {
        ...data,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async updatePage(id: string, data: any) {
    const path = `pages/${id}`;
    try {
      if (!db) return;
      await updateDoc(doc(db, 'pages', id), {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deletePage(id: string) {
    const path = `pages/${id}`;
    try {
      if (!db) return;
      await deleteDoc(doc(db, 'pages', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
};
