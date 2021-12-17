import Layout from "../component/Layout";
// import NextLink from "next/link";
import Image from "next/image";
import bgPAH from "../public/images/bg_pah.PNG";
import styles from "./css/protection.module.css";

export default function prescription() {
  return (
    <Layout>
      <div>
        <div>
          <Image className={styles.pah} src={bgPAH} alt="no image" />
        </div>
        <div className={styles.searchContainer}>
          <input
            className={styles.search}
            type="search"
            placeholder="Search Protection and Hygiene Here"
          />
        </div>
      </div>
    </Layout>
  );
}
