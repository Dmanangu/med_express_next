import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/firestore";
// import { Firestore } from "@firebase/firestore";
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "@firebase/firestore";

const config = {
  apiKey: "AIzaSyCHLsF4zuCvlwMbXt2YGW3i65BvFn5hzxI",
  authDomain: "med-express-e8788.firebaseapp.com",
  databaseURL: "https://med-express-e8788.firebaseio.com",
  projectId: "med-express-e8788",
  storageBucket: "med-express-e8788.appspot.com",
  messagingSenderId: "948492746016",
  appId: "1:948492746016:web:18ccb231cdee1a4b7d2b45",
};

firebase.initializeApp(config);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.log("error creating user", error.message);
    }
  }

  return userRef;
};

export const convertCollectionsSnapshotToMap = (collections) => {
  const transformedCollection = collections.docs.map((doc) => {
    const {
      id,
      prodName,
      price,
      strength,
      genName,
      category,
      packageType,
      imageUrl,
    } = doc.data();
    return {
      id: doc.id,
      medID: id,
      prodName: prodName,
      price: price,
      strength: strength,
      genName: genName,
      category: category,
      packageType: packageType,
      imageUrl: imageUrl,
    };
  });

  return transformedCollection;
};

export const convertCollectionsToList = (collections, filterKey) => {
  const filteredData = [];
  const newList = [];
  collections.map(
    ({
      id,
      medID,
      prodName,
      price,
      strength,
      genName,
      category,
      packageType,
      imageUrl,
    }) =>
      filteredData.push([
        id,
        medID,
        prodName,
        price,
        strength,
        genName,
        category,
        packageType,
        imageUrl,
      ])
  );
  filteredData.map((arr) => (arr[6] === filterKey ? newList.push(arr) : ""));

  return newList;
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);
