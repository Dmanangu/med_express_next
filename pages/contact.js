import React from "react";
import NextLink from "next/link";
import { Link } from "@material-ui/core";
import styles from "./css/contact.module.css";
import bigImage from "../public/images/app_logo.png";
import Image from "next/image";
export class ContactPage extends React.Component {
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
        <header className="contactUsHeader">
          <h1 className={styles.contactUsTxt}>Contact Us</h1>
        </header>
        <div className={styles.contactUsContainer}>
          <body className="contactUsBody">
            <h2>
              Maynard L. Casimiro BSIT - 4C maynard.casimiropogi@gmail.com
            </h2>
            <h2>Angelo Glenn V. Tigas BSIT 4C angeloglenn63@gmail.com</h2>
            <h2>Bren Jei L.Simbulan BSIT-4C simbulanbrenjei0@gmail.com</h2>
            <h2> Marian M. de Castro BSIT-4C decastromarian59@gmail.com</h2>
          </body>
        </div>
      </div>
    );
  }
}

export default ContactPage;
