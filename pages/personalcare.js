import Layout from "../component/Layout";
import NextLink from "next/link";
import Image from "next/image";
import bgPC from "../public/images/bg_pc.PNG";
import styles from "./css/personalcare.module.css";

export default function prescription() {
  return (
    <Layout>
      <div>
        <div>
          <Image className={styles.pc} src={bgPC} alt="no image" />
        </div>
        <div className={styles.searchContainer}>
          <input
            className={styles.search}
            type="search"
            placeholder="Search Personal Care Here"
          />
        </div>
      </div>
    </Layout>
  );
}
