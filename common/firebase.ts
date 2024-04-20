import { initializeApp, FirebaseApp, FirebaseOptions } from "firebase/app";
import {
  getFirestore,
  Firestore,
  getDocs,
  collection,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import {
  getStorage,
  FirebaseStorage,
  ref,
  StorageReference,
} from "firebase/storage";
import { imageDoc } from "@/types/model";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Singleton
export class FirebaseHelper {
  private static instance: FirebaseHelper;
  app: FirebaseApp;
  config: FirebaseOptions;
  private constructor() {
    if (
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY === undefined ||
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN === undefined ||
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === undefined ||
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET === undefined ||
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID === undefined ||
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID === undefined ||
      process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID === undefined
    ) {
      throw new Error("FIREBASE_API_KEY is undefined");
    }
    this.config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };
    this.app = initializeApp(this.config);
  }

  public static getInstance(): FirebaseHelper {
    if (!FirebaseHelper.instance) {
      FirebaseHelper.instance = new FirebaseHelper();
    }
    return FirebaseHelper.instance;
  }

  public static app(): FirebaseApp {
    return this.getInstance().app;
  }

  public static db(): Firestore {
    return getFirestore(this.getInstance().app);
  }

  public static async getDoc(
    collectionName: string,
    docId?: string
  ): Promise<imageDoc | undefined> {
    const db = this.db();
    if (docId) {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Data exists!");
        console.log(docSnap.data());
        const data = docSnap.data() as imageDoc; // Type assertion to imageDoc
        return data;
      } else {
        console.log("No such document!");
      }
    } else {
      const querySnapshot = await getDocs(collection(db, collectionName));
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
      });
    }
  }

  public static storage_ref(points: string): StorageReference {
    let storage = getStorage(
      this.getInstance().app,
      `gs://${this.getInstance().config.storageBucket}`
    );
    return ref(storage, points);
  }
}
