import Layout from "../component/Layout";
import NextLink from "next/link";
import Image from "next/image";
import bgOver from "../public/images/bg_over.PNG";
import styles from "./css/overthecounter.module.css";

export default function Home() {
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
      </div>
    </Layout>
  );
}
