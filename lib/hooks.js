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
  // //const [ user ] = useAuthState(auth);
  // const [ email, setEmail ] = useState(null);
  // // const [ products, setProducts ] = useState(null);

  // useEffect(() => {
  // 	// turn off realtime subscription

  // 	const ref = firestore.collection('medicine').doc();
  // 	ref.onSnapshot((doc) => {
  // 		setEmail(doc.data().email);
  // 	});
  // }, []);

  console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");

  const postsQuery = firestore.collectionGroup("medicine");
  // .where('published', '==', true)
  // .orderBy('createdAt', 'desc')
  // .limit(LIMIT);

  const meds = (await postsQuery.get()).docs.map(postToJSON);

  console.log("MEDS");
  console.log(meds);
  console.log("MEDS");

  return { meds };
}

// export async function useUserProducts() {
// 	const [ email, setEmail ] = useState(null);

// 	useEffect(() => {
// 		// turn off realtime subscription
// 		//let unsubscribe;

// 		// if (user) {
// 		// const ref = firestore.collection('users').get();
// 		// unsubscribe = ref.onSnapshot((doc) => {
// 		// 	setEmail(doc.data().email);
// 		// });

//     const postsQuery = firestore.collectionGroup('medicine');
// 	const posts = (await postsQuery.get()).docs.map(postToJSON);
// 		// } else {
// 		// 	setEmail(null);
// 		// }

// 		// return unsubscribe;
// 	}, []);

// 	return { user, email };
// }

// export function useUserProducts() {
// 	const [ email, setEmail ] = useState(null);

// 	useEffect(() => {
// 		// turn off realtime subscription
// 		//let unsubscribe;

// 		// if (user) {
// 		const ref = firestore.collection('users').get();
// 		unsubscribe = ref.onSnapshot((doc) => {
// 			setEmail(doc.data().email);
// 		});
// 		// } else {
// 		// 	setEmail(null);
// 		// }

// 		// return unsubscribe;
// 	}, []);

// 	return { user, email };
// }

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
