import React, { useContext, useState } from "react";
import Head from "next/head";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Link,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Switch,
  Badge,
  Button,
  Menu,
  MenuItem,
} from "@material-ui/core";
import useStyles from "../utils/style";
import Image from "next/image";
import smallLogo from "../public/images/app_logo_sm.png";
import NextLink from "next/link";
import styles from "./Layout.module.css";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { UserContext, MedContext } from "../lib/context";
import { logout } from "../component/firebase/useUser";

export default function Layout({ title, children }) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart } = state;
  const { user } = useContext(UserContext);

  // const { meds } = useContext(MedContext);

  // console.log("TTTTTTTTTTTTTTRYYYYYYYYYYYYY");
  // console.log(meds);
  // console.log("TTTTTTTTTTTTTTRYYYYYYYYYYYYY");

  //will use cart function
  const theme = createTheme({
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
    },
    palette: {
      type: darkMode ? "dark" : "light",
      primary: {
        main: "#f0c000",
      },
      secondary: {
        main: "#208080",
      },
    },
  });
  const classes = useStyles();
  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? "DARK_MODE_OFF" : "DARK_MODE_ON" });
    const newDarkMode = !darkMode;
    Cookies.set("darkMode", newDarkMode ? "ON" : "OFF");
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);
    if (redirect) {
      router.push("/");
    }
  };
  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: logout });
    Cookies.remove(user);
    Cookies.remove("cartItems");
    router.push("/");
  };

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

              <NextLink href="/about" passHref>
                <Link className={classes.sizePlus}>About Us</Link>
              </NextLink>
              <NextLink href="/contact" passHref>
                <Link className={classes.sizePlus}>Contact Us</Link>
              </NextLink>
              <NextLink href="/cart" passHref>
                <Link className={classes.sizePlus}>
                  {cart.cartItems.length > 0 ? (
                    <Badge badgeContent={cart.cartItems.length}>Cart</Badge>
                  ) : (
                    "Cart"
                  )}
                </Link>
              </NextLink>
              {user != null ? (
                <>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={loginClickHandler}
                    className={classes.navbarButton}
                  >
                    {user.displayName}
                    {/*if a user is logged in the login button will change into their name*/}
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={loginMenuCloseHandler}
                  >
                    <MenuItem
                    // onCLick={(e) => loginMenuCloseHandler(e, "/profile")}
                    >
                      <NextLink href={"/profile"}>Profile</NextLink>
                    </MenuItem>
                    <MenuItem
                    // onCLick={(e) =>
                    //   loginMenuCloseHandler(e, "/order-history")
                    // }
                    >
                      <NextLink href={"/order-history"}>Order History</NextLink>
                    </MenuItem>
                    <MenuItem onCLick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href="/login" passHref>
                  <Link className={classes.sizePlus}>Login</Link>
                </NextLink>
              )}
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
