import React, { useContext } from "react";
import Head from "next/head";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Link,
  createMuiTheme,
  ThemeProvider,
  CssBaseline,
  Switch,
  Badge,
} from "@material-ui/core";
import useStyles from "../utils/style";
import Image from "next/image";
import smallLogo from "../public/images/app_logo_sm.png";
import NextLink from "next/link";
import styles from "./Layout.module.css";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";

export default function Layout({ title, children }) {
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart } = state;
  //will use cart function
  const theme = createMuiTheme({
    typography: {
      h1: {
        fontSize: "1.6rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
      h2: {
        fontSize: "1.4rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
      palette: {
        type: darkMode ? "dark" : "light",
        primary: {
          main: "#2596be",
        },
        secondary: {
          main: "#208080",
        },
      },
    },
  });
  const classes = useStyles();
  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? "DARK_MODE_OFF" : "DARK_MODE_ON" });
    const newDarkMode = !darkMode;
    Cookies.set("darkMode", newDarkMode ? "ON" : "OFF");
  };
  // will remove dark mode because it is not needed

  return (
    <div>
      <Head>
        <title>
          {title ? `${title} - Farmacia De Angat` : "Farmacia De Angat"}
        </title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" className={classes.navbar}>
          <Toolbar>
            <Image src={smallLogo} alt="logo" />
            <NextLink href="/" passHref>
              <Link>
                <Typography className={classes.brand}>
                  Farmacia De Angat
                </Typography>
              </Link>
            </NextLink>
            <div className={classes.grow}></div>
            <div>
              <Switch
                checked={darkMode}
                onChange={darkModeChangeHandler}
              ></Switch>
              {/* will remove this switch because it is not needed */}

              <NextLink href="/about" passHref>
                <Link className={classes.sizePlus}>About Us</Link>
              </NextLink>
              <NextLink href="/contact" passHref>
                <Link className={classes.sizePlus}>Contact Us</Link>
              </NextLink>
              <NextLink href="/cart" passHref>
                <Link className={classes.sizePlus}>
                  {cart.cartItems.length > 0 ? (
                    <Badge badgeContent={cart.items.length}>Cart</Badge>
                  ) : (
                    "Cart"
                  )}
                </Link>
              </NextLink>
              <NextLink href="/login" passHref>
                <Link className={classes.sizePlus}>Login</Link>
              </NextLink>
            </div>
          </Toolbar>
        </AppBar>
        <div className={styles.menuContainer}>
          <NextLink href="/" passHref>
            <Link>
              <button className={styles.menuBars}>Over The Counter</button>
            </Link>
          </NextLink>
          <NextLink href="/prescription" passHref>
            <Link>
              <button className={styles.menuBars}>Prescription Drugs</button>
            </Link>
          </NextLink>
          <NextLink href="/medicalsupplies" passHref>
            <Link>
              <button className={styles.menuBars}>Medical Supplies</button>
            </Link>
          </NextLink>
          <NextLink href="/protectionandhygiene" passHref>
            <Link>
              <button className={styles.menuBars}>
                Protection and Hygienge
              </button>
            </Link>
          </NextLink>
          <NextLink href="/personalcare" passHref>
            <Link>
              <button className={styles.menuBars}>Personal Care</button>
            </Link>
          </NextLink>
          <NextLink href="/covidessentials" passHref>
            <Link>
              <button className={styles.menuBars}>Covid Essentials</button>
            </Link>
          </NextLink>
        </div>
        <Container className={classes.main}>{children}</Container>
        <footer className={classes.footer}>
          <Typography>
            All rights reserved. Farmacia De Angat 2021-2022.
          </Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
}
