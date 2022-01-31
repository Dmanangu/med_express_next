import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import Layout from "../component/Layout";
import useStyles from "../utils/style";
import NextLink from "next/link";
import { useRouter } from "next/router";
// import axios from "axios";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
// import getError from "../utils/error";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../lib/firebase";
import firebase from "firebase/compat/app";

// import { useAuth } from '../component/firebase/AuthUserContext';

export default function Register() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const classes = useStyles();
  const router = useRouter();
  // const { state, dispatch } = useContext(Store);
  // const { userInfo } = state;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const auth = getAuth();
  // useEffect(() => {
  // 	if (userInfo) {
  // 		router.push('/');
  // 	}
  // 	// eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const { createUserWithEmailAndPassword } = useAuth();

  const { redirect } = router.query; //login?redirect=/shipping
  // const auth = getAuth();
  const submitHandler = () => {
    closeSnackbar();
    if (password !== confirmPassword) {
      enqueueSnackbar("Password don't match", { variant: "error" });
      return;
    } else {
      try {
        createUserWithEmailAndPassword(auth, email, password)
          .then((authUser) => {
            console.log(authUser.user.uid);
            console.log("Success. The user is created in firebase");
            firebase
              .firestore()
              .collection("users")
              .doc(authUser.user.uid)
              .set({
                id: authUser.user.uid,
                name: name,

                email: email,
                password: password,
              })
              .then(alert("The User  was now saved."));
          })
          .catch((error) => {
            console.log(error.message);
          });
        router.push("/login");
      } catch (err) {
        enqueueSnackbar("Account Creation Error");
      }
    }
  };
  return (
    <Layout title="Register">
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <Typography component="h1" variant="h1">
          Register
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="name"
                  label="Name"
                  type={"name"}
                  value={name}
                  onInput={(e) => setName(e.target.value)}
                  inputProps={{ type: "name" }}
                  error={Boolean(errors.name)}
                  helperText={
                    errors.name
                      ? errors.name.type === "minLength"
                        ? "Name length is more than 1"
                        : "Name is required"
                      : ""
                  }
                  {...field}
                />
              )}
            />
          </ListItem>

          <ListItem>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="Email"
                  type={"email"}
                  value={email}
                  onInput={(e) => setEmail(e.target.value)}
                  inputProps={{ type: "email" }}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email
                      ? errors.email.type === "pattern"
                        ? "Email is not valid"
                        : "Email is required"
                      : ""
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="password"
                  label="Password"
                  type={"password"}
                  value={password}
                  onInput={(e) => setPassword(e.target.value)}
                  inputProps={{ type: "password" }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password
                      ? errors.password.type === "minLength"
                        ? "Password length is more than 5"
                        : "Password is required"
                      : ""
                  }
                  {...field}
                />
              )}
            />
          </ListItem>

          <ListItem>
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="confirmPassword"
                  value={confirmPassword}
                  onInput={(e) => setConfirmPassword(e.target.value)}
                  label="confirm Password"
                  inputProps={{ type: "password" }}
                  error={Boolean(errors.confirmPassword)}
                  helperText={
                    errors.confirmPassword
                      ? errors.confirmPassword.type === "minLength"
                        ? "Confirm Password length is more than 5"
                        : "Confirm Password is required"
                      : ""
                  }
                  {...field}
                />
              )}
            />
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
