import Layout from "../component/Layout";
// import NextLink from "next/link";
import Image from "next/image";
import bgMS from "../public/images/bg_ms.PNG";
import styles from "./css/medical.module.css";

export default function prescription() {
  return (
    <Layout>
      <div>
        <div>
          <Image className={styles.ms} src={bgMS} alt="no image" />
        </div>
        <div className={styles.searchContainer}>
          <input
            className={styles.search}
            type="search"
            placeholder="Search Medical Supplies Here"
          />
        </div>
      </div>
    </Layout>
  );
}
