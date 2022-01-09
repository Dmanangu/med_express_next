import Layout from "../component/Layout";
// import NextLink from "next/link";
import Image from "next/image";
import bgOver from "../public/images/bg_over.PNG";
import styles from "./css/overthecounter.module.css";
import ProductCard from "./card/card";

import { firestore, postToJSON } from "../lib/firebase";
import React, { useState, setState } from "react";
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
  const postsQuery = firestore.collectionGroup("medicine");

  const posts = (await postsQuery.get()).docs.map(postToJSON);
  return {
    props: { posts },
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);

  const medsByCategory = posts.filter((meds) => {
    return meds.category.toLowerCase().includes("a");
  });

  // console.log("XXXXXXXXXXXXXXXXXXXXXXX");
  // console.log(posts);
  // console.log("XXXXXXXXXXXXXXXXXXXXXXX");

  // handleChange = (e, ownProps) => {
  //   this.state(
  //     {
  //       ...this.state,
  //       search: e.target.value,
  //     },
  //     () => {
  //       if (this.state.search && this.state.search.length >= 1) {
  //         this.getResults(ownProps);
  //       }
  //     }
  //   );
  // };

  // getResults = (ownProps) => {
  //   const filteredMedicine = ownProps.filter((meds) => {
  //     return meds.prodName
  //       .toLowerCase()
  //       .includes(this.state.search.toLocaleLowerCase());
  //   });
  //   this.setState({
  //     ...this.state,
  //     medicineList: filteredMedicine,
  //   });
  // };

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
            // onChange={(e) => this.handleChange(e, medsByCategory)}
          />
        </div>
        <ProductCard medicine={medsByCategory} />
      </div>
    </Layout>
  );
}
