import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

const serviceAccount = require('../test/whichcostsmore-firebase-adminsdk-cuftu-d6a7a4e8de'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const Firestore = admin.firestore();

export class FirestoreService {
  async getAllData(collection: string): Promise<any[]> {
    const snapshot = await Firestore.collection(collection).get();
    return snapshot.docs.map(doc => doc.data());
  }

  async getDataById(collection: string, id: string): Promise<any> {
    const doc = await Firestore.collection(collection).doc(id).get();
    return doc.exists ? doc.data() : null;
  }

  async createData(collection: string, data: any): Promise<void> {
    await Firestore.collection(collection).add(data);
  }

  async deleteData(collection: string, id: string): Promise<void> {
    await Firestore.collection(collection).doc(id).delete();
  }

  async getDataInRange(collection: string, field: string, operator: FirebaseFirestore.WhereFilterOp, value: any): Promise<any[]> {
    const snapshot = await Firestore.collection(collection).where(field, operator, value).get();
    return snapshot.docs.map(doc => doc.data());
  }
}
