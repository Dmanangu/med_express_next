import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useContext, useState, useEffect } from "react";
import Layout from "../component/Layout";
import useStyles from "../utils/style";
import NextLink from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";

export default function Register() {
  const classes = useStyles();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    if (userInfo) {
      router.push("/");
    }
  }, []);
  const [name, setName] = useState(""); //no database yet
  const [email, setEmail] = useState(""); //no database yet
  const [phone, setPhone] = useState(""); //no database yet
  const [password, setPassword] = useState(""); //no database yet
  const [confirmPassword, setConfirmPassword] = useState(""); //no database yet
  const { redirect } = router.query; //login?redirect=/shipping
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Password don't match");
    }
    try {
      const { data } = await axios.post("/api/users/register", {
        name,
        email,
        phone,
        password,
      });
      dispatch({ type: "USER_LOGIN", payload: data });
      Cookies.set("userInfo", data);
      router.push(redirect || "/");
      alert("success login");
    } catch (err) {
      alert(err.response.data ? err.response.data.message : err.message);
    }
  };
  return (
    <Layout title="Register">
      <form className={classes.form}>
        <Typography component="h1" variant="h1">
          Register
        </Typography>
        <List>
          <ListItem>
            {/* Name holder */}
            <TextField
              variant="outlined"
              fullWidth
              id="name"
              label="Name"
              inputProps={{ type: "text" }}
              onChange={(e) => setName(e.target.value)}
              required
            ></TextField>
          </ListItem>

          <ListItem>
            {/* email holder */}
            <TextField
              variant="outlined"
              fullWidth
              id="email"
              label="Email"
              inputProps={{ type: "email" }}
              onChange={(e) => setEmail(e.target.value)}
              required
            ></TextField>
          </ListItem>

          <ListItem>
            {/* phone holder */}
            <TextField
              variant="outlined"
              fullWidth
              id="tel"
              label="Mobile Number"
              inputProps={{ type: "tel" }}
              onChange={(e) => setPhone(e.target.value)}
              required
            ></TextField>
          </ListItem>

          <ListItem>
            {/* password holder */}
            <TextField
              variant="outlined"
              fullWidth
              id="password"
              label="Password"
              inputProps={{ type: "password" }}
              onChange={(e) => setPassword(e.target.value)}
              required
            ></TextField>
          </ListItem>

          <ListItem>
            {/* password holder */}
            <TextField
              variant="outlined"
              fullWidth
              id="confirmPassword"
              label="Confirm Password"
              inputProps={{ type: "password" }}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            ></TextField>
          </ListItem>

          <ListItem>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              color="primary"
              onClick={submitHandler}
            >
              Register
            </Button>
          </ListItem>
          <ListItem>
            Already have an Account? &nbsp;
            <NextLink href={`/login?redirect=${redirect || "/"}`} passHref>
              <Link> Login</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
