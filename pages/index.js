import Layout from "../component/Layout";
import Image from "next/image";
import bgOver from "../public/images/bg_over.PNG";
import styles from "./css/overthecounter.module.css";
import ProductCard from "./card/card";

import { firestore, postToJSON } from "../lib/firebase";
import React, { useState } from "react";

export async function getServerSideProps() {
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
          <Image className={styles.otc} src={bgOver} alt="no image" />
        </div>
        <div className={styles.searchContainer}>
          <input
            className={styles.search}
            type="search"
            placeholder="Search Over the counter medicine here"
            value={medsByCategory.prodName}
            onChange={clientSearchHandler}
          />
        </div>
        <ProductCard medicine={medsByCategory} />
      </div>
    </Layout>
  );
}
