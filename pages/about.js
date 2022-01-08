import React from "react";
import NextLink from "next/link";
import { Link } from "@material-ui/core";
import styles from "./css/about.module.css";
import bigImage from "../public/images/app_logo.png";
import Image from "next/image";
export class AboutPage extends React.Component {
  render() {
    return (
      <div>
        <NextLink href="/">
          <Link>
            <button className={styles.goHome}>Go Back To Home</button>
          </Link>
        </NextLink>
        <div className={styles.logoPlace}>
          <Image src={bigImage} alt="Image not Found" />
        </div>
        <header className={styles.aboutUs}>
          <h2>About Us</h2>
        </header>
        <div className={styles.aboutPageBodyContainer}>
          <body className={styles.bodyAbout}>
            Farmacia De Angat was made with the students from Bulacan State
            University Bustos Bulacan. The project was created to help the
            citizens of Angat Bulacan to get buy their local medicine without
            going out and risk their health in order to get the medicine. The
            Beta Version only supported eleven (11) barangays namely; San roque,
            Santo. Cristo, Santa. Cruz, Baybay, Banaban, Marungko, Sulucan,
            Niugan, Taboc, Pulong yantok, and Engkanto.
          </body>
        </div>
      </div>
    );
  }
}

export default AboutPage;
