import Layout from "../component/Layout";
// import NextLink from "next/link";
import Image from "next/image";
import bgPD from "../public/images/bg_pd.PNG";
import styles from "./css/prescription.module.css";
import ProductCard from "./card/card";

import { firestore, postToJSON } from "../lib/firebase";
import { useState } from "react";

export async function getServerSideProps() {
  const postsQuery = firestore.collectionGroup("medicine");

  const posts = (await postsQuery.get()).docs.map(postToJSON);
  return {
    props: { posts },
  };
}

export default function Prescription(props) {
  // eslint-disable-next-line no-unused-vars
  const [posts, setPosts] = useState(props.posts);

  const medsByCategory = posts.filter((meds) => {
    return meds.category.toLowerCase().includes("b");
  });
  const [filteredPosts] = useState(props.posts);

  const clientSearchHandler = (e) => {
    if (e.target.value.length >= 0 && e.target.value === "") {
      setPosts(filteredPosts);
    } else {
      const filter = medsByCategory.filter((medicine) => {
        return medicine.prodName.toLowerCase().includes(e.target.value);
      });
      setPosts(filter);
    }
  };
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
            value={medsByCategory.prodName}
            onChange={clientSearchHandler}
          />
        </div>
        <ProductCard medicine={medsByCategory} />
      </div>
    </Layout>
  );
}
