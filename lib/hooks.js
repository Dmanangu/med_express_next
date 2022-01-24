import { auth, firestore, postToJSON } from "../lib/firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth);
  const [email, setEmail] = useState(null);
  // const [ products, setProducts ] = useState(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const ref = firestore.collection("users").doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => {
        setEmail(doc.data()?.email);
      });
    } else {
      setEmail(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, email };
}

export async function useMedData() {
 
  const postsQuery = firestore.collectionGroup("medicine");
 
  const meds = (await postsQuery.get()).docs.map(postToJSON);

  return { meds };
}


export async function useShippingAddressData() {
  const postsQuery = firestore.collectionGroup("shippingAddress");

  const shipping = (await postsQuery.get()).docs.map(postToJSON);

  return { shipping };
}

export async function getServerSideProps() {
  const postsQuery = firestore.collectionGroup("medicine");
  // .where('published', '==', true)
  // .orderBy('createdAt', 'desc')
  // .limit(LIMIT);

  const posts = (await postsQuery.get()).docs.map(postToJSON);

  return {
    props: { posts }, // will be passed to the page component as props
  };
}
