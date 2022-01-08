import Layout from "../component/Layout";
// import NextLink from "next/link";
import Image from "next/image";
import bgPD from "../public/images/bg_pd.PNG";
import styles from "./css/prescription.module.css";
import ProductCard from "./card/card";

import { firestore, postToJSON } from "../lib/firebase";
import { useState } from "react";

export async function getServerSideProps(context) {
  const postsQuery = firestore.collectionGroup("medicine");

  const posts = (await postsQuery.get()).docs.map(postToJSON);
  return {
    props: { posts },
  };
}

export default function prescription(props) {
  const [posts, setPosts] = useState(props.posts);

  const medsByCategory = posts.filter((meds) => {
    return meds.category.toLowerCase().includes("b");
  });
  return (
    <Layout>
      <div>
        <div>
          <Image className={styles.pd} src={bgPD} alt="no image" />
        </div>
        <div className={styles.searchContainer}>
          <input
            className={styles.search}
            type="search"
            placeholder="Search Prescription Drugs Here"
          />
        </div>
        <ProductCard medicine={medsByCategory} />
      </div>
    </Layout>
  );
}
