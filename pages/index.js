import Layout from '../component/Layout';
// import NextLink from "next/link";
import Image from 'next/image';
import bgOver from '../public/images/bg_over.PNG';
import styles from './css/overthecounter.module.css';
import ProductCard from './card/card';

import { firestore, postToJSON } from '../lib/firebase';
import { useState } from 'react';
// import { firestore, postToJSON } from '../lib/firebase';

// import ReadToCloudFireStore from "../component/cloudFirestore/Read";

// import React, { useEffect } from "react";

// export async function getServerSideProps() {
// 	const postsQuery = firestore.collectionGroup('medicine');
// 	// .where('published', '==', true)
// 	// .orderBy('createdAt', 'desc')
// 	// .limit(LIMIT);

// 	const posts = (await postsQuery.get()).docs.map(postToJSON);

// 	return {
// 		props: { posts } // will be passed to the page component as props
// 	};
// }

export async function getServerSideProps(context) {
	const postsQuery = firestore.collectionGroup('medicine');

	const posts = (await postsQuery.get()).docs.map(postToJSON);
	return {
		props: { posts }
	};
}

export default function Home(props) {
	const [ posts, setPosts ] = useState(props.posts);
	// useEffect(() => {
	//   const readData = async () => {
	//     const medicineList = [];
	//     try {
	//       const medicines = firebase.firestore().collection("medicine");
	//       const snapshot = await medicines.get();
	//       snapshot.forEach((doc) => {
	//         console.log(doc.id, "=>", doc.data());
	//         medicineList.push(doc.data());
	//       });
	//       console.log(medicineList);
	//       return medicineList;
	//     } catch (error) {
	//       console.log(error);
	//       alert(error);
	//     }
	//   };
	//   readData();
	// }, []);

	console.log('XXXXXXXXXXXXXXXXXXXXXXX');
	console.log(posts);
	console.log('XXXXXXXXXXXXXXXXXXXXXXX');

	return (
		<Layout>
			<div>
				<div>
					<Image className={styles.otc} src={bgOver} alt="no image" />
				</div>
				<div className={styles.searchContainer}>
					<input
						className={styles.search}
						type="search"
						placeholder="Search Over the counter medicine here"
					/>
				</div>
				<ProductCard medicine={posts} />
			</div>
		</Layout>
	);
}
