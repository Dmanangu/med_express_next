import Layout from "../component/Layout";
import NextLink from "next/link";
import Image from "next/image";
import bgCE from "../public/images/bg_ce.PNG";
import styles from "./css/covidessentials.module.css";

export default function prescription() {
  return (
    <Layout>
      <div>
        <div>
          <Image className={styles.ce} src={bgCE} alt="no image" />
        </div>
        <div className={styles.searchContainer}>
          <input
            className={styles.search}
            type="search"
            placeholder="Search Covid Essentials Here"
          />
        </div>
      </div>
    </Layout>
  );
}
