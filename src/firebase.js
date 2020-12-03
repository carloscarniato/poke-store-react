import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDt9O59F8BsSnhl58QN5ki_mFbUT7ud63o",
    authDomain: "poke-store-4541f.firebaseapp.com",
    databaseURL: "https://poke-store-4541f.firebaseio.com",
    projectId: "poke-store-4541f",
    storageBucket: "poke-store-4541f.appspot.com",
    messagingSenderId: "917428781657",
    appId: "1:917428781657:web:92097b9d21b9cda75a6748",
    measurementId: "G-NEE4K679B7"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const generateUserDocument = async (user, additionalData) => {
  if (!user) return;
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();
  if (!snapshot.exists) {
    const { email, displayName, photoURL } = user;
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        ...additionalData
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.uid);
};

const getUserDocument = async uid => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.doc(`users/${uid}`).get();
    return {
      uid,
      ...userDocument.data()
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};