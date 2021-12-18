import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";
import Layout from "../component/Layout";
import useStyles from "../utils/style";
import NextLink from "next/link";

export default function Register() {
  const classes = useStyles();

  return (
    <Layout title="Login">
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
              inputProps={{ type: "name" }}
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
              required
            ></TextField>
          </ListItem>

          <ListItem>
            {/* phone number holder */}
            <TextField
              variant="outlined"
              fullWidth
              id="tel"
              label="Phone number"
              inputProps={{ type: "tel" }}
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
              required
            ></TextField>
          </ListItem>

          <ListItem>
            {/* Confirm holder */}
            <TextField
              variant="outlined"
              fullWidth
              id="password"
              label="Confirm password"
              inputProps={{ type: "password" }}
              required
            ></TextField>
          </ListItem>

          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Register
            </Button>
          </ListItem>
          <ListItem>
            Already have an account? &nbsp;
            <NextLink href="/login" passHref>
              <Link> Login </Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
