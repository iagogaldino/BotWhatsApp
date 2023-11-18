import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push, remove, orderByChild, equalTo, query, get, orderByKey } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA1yWHZ7j80a7JdYrkY4GOKQ0cXVinRi_c",
  authDomain: "reinf-c54ca.firebaseapp.com",
  databaseURL: "https://reinf-c54ca-default-rtdb.firebaseio.com",
  projectId: "reinf-c54ca",
  storageBucket: "reinf-c54ca.appspot.com",
  messagingSenderId: "892229404739",
  appId: "1:892229404739:web:157b0ba1b305cc5a4eacf6",
  measurementId: "G-W64NJVPQHH"
};

// Initialize Firebase
export function initialize() {
  const app = initializeApp(firebaseConfig);
  // Initialize Realtime Database and get a reference to the service
  const database = getDatabase(app);
}

export function getDB(path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const starCountRef = ref(db, path);
    const result: { key: string, value: any }[] = [];

    onValue(starCountRef, (snapshot) => {
      const dDbr = snapshot.val();
      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;
        const value = childSnapshot.val();
        result.push({ key, ...value });
      });

      resolve(result);
    }, (error) => {
      reject(error);
    });
  });
}

export function getOnlyItem(path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const starCountRef = ref(db, path);

    onValue(starCountRef, (snapshot) => {
      const dDbr = snapshot.val();
      resolve(dDbr);
    }, (error) => {
      reject(error);
    });
  });
}

export async function writeUserData(path: string, value: any): Promise<any> {
  const db = getDatabase();
  const newRef = await push(ref(db, path), value);

  return new Promise((resolve, reject) => {
    if (newRef) {
      resolve(newRef.key);
    } else {
      reject(new Error("Erro ao adicionar dados ao Firebase."));
    }
  });
}

export function removeItem(path: string, itemKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const itemRef = ref(db, `${path}/${itemKey}`);

    remove(itemRef)
      .then(() => {
        console.log('Item removido com sucesso.');
        resolve();
      })
      .catch((error) => {
        console.error('Erro ao remover item:', error);
        reject(error);
      });
  });
}



export async function searchByProperty(path: string, propertyName: string, propertyValue: any): Promise<any> {
  const db = getDatabase();
  const refF = ref(db, path);

  // Consulta usando query, orderByChild e equalTo
  const q = query(refF, orderByChild(propertyName), equalTo(propertyValue));

  try {
    const snapshot = await get(q);

    if (snapshot.exists()) {
      const resultArray: { key: string, value: any }[] = [];

      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;
        const value = childSnapshot.val();
        resultArray.push({ key, value });
      });

      return resultArray;
    } else {
      console.log('Nenhum resultado encontrado.');
      return [];
    }
  } catch (error) {
    console.error('Erro ao realizar a busca:', error);
    throw error;
  }
}




