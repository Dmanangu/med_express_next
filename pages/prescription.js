import Layout from "../component/Layout";
import NextLink from "next/link";
import Image from "next/image";
import bgPD from "../public/images/bg_pd.PNG";
import styles from "./css/prescription.module.css";

export default function prescription() {
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
      </div>
    </Layout>
  );
}
