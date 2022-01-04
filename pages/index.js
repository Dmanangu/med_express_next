import Layout from "../component/Layout";
// import NextLink from "next/link";
import Image from "next/image";
import bgOver from "../public/images/bg_over.PNG";
import styles from "./css/overthecounter.module.css";
import ProductCard from "./card/card";

// import ReadToCloudFireStore from "../component/cloudFirestore/Read";

// import React, { useEffect } from "react";

export default function Home() {
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
        <ProductCard />
      </div>
    </Layout>
  );
}
