import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

const serviceAccount = require('../test/whichcostsmore-firebase-adminsdk-cuftu-d6a7a4e8de'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const Firestore = admin.firestore();
