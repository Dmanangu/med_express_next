import {
  Button,
  List,
  ListItem,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import Layout from "../component/Layout";
import useStyles from "../utils/style";
import { useRouter } from "next/router";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import { Controller, useForm } from "react-hook-form";
import CheckoutWizzard from "../component/CheckoutWizzard";
import { UserContext } from "../lib/context";
import { auth, firestore } from "../lib/firebase";

//

export default function Shipping() {
  const { user } = useContext(UserContext);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const classes = useStyles();
  const router = useRouter();
  // const { state, dispatch } = useContext(Store);
  // const {
  //   cart: { shippingAddress },
  // } = state;
  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/shipping");
    }
    // setValue("fullName", shippingAddress.fullName);
    // setValue("address", shippingAddress.address);
    // setValue("barangay", shippingAddress.barangay);
    // setValue("phone", shippingAddress.phone);
    // setValue("city", shippingAddress.city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitHandler = async ({
    fullName,
    address,
    barangay,
    phone,
    city,
  }) => {
    // dispatch({
    //   type: "SAVE_SHIPPING_ADDRESS",
    //   payload: { fullName, address, barangay, phone, city },
    // }); //needs db
    // Cookies.get("shippingAddress", {
    //   fullName,
    //   address,
    //   barangay,
    //   phone,
    //   city,
    // });

    const userDoc = firestore.doc(`shippingAddress/${auth.currentUser.uid}`);
    //const usernameDoc = firestore.doc(usernames/${formValue});

    // Commit both docs together as a batch write.
    const batch = firestore.batch();
    batch.set(userDoc, {
      id: auth.currentUser.uid,
      fullName: fullName,
      address: "address",
      barangay: "barangay",
      phone: "phone",
      city: "city",
    });
    //batch.set(usernameDoc, { uid: user.uid });
    if (!userDoc) {
      throw new Error("There was an error in uploading Shipping Address");
    }
    await batch.commit();
    router.push("/payment");
  };
  return (
    <Layout title="Shipping Address">
      <CheckoutWizzard activeStep={1} />
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <Typography component="h1" variant="h1">
          Shipping Address
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="fullName"
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
                  id="fullName"
                  label="Full Name"
                  error={Boolean(errors.fullName)}
                  helperText={
                    errors.fullName
                      ? errors.fullName.type === "minLength"
                        ? "Full Name length is more than 1"
                        : "Full Name is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="phone"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 11,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="tel"
                  label="Mobile Number"
                  error={Boolean(errors.phone)}
                  helperText={
                    errors.phone
                      ? errors.phone.type === "minLength"
                        ? "Phone number length should 11 or 12 Digits"
                        : "Phone number is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name="address"
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
                  id="address"
                  label="Street"
                  error={Boolean(errors.address)}
                  helperText={
                    errors.address
                      ? errors.address.type === "minLength"
                        ? "Address length is more than 1"
                        : "Address is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name="barangay"
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
                  id="barangay"
                  label="Barangay"
                  error={Boolean(errors.barangay)}
                  helperText={
                    errors.barangay
                      ? errors.barangay.type === "minLength"
                        ? "Barangay length is more than 1"
                        : "Barangay is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name="city"
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
                  id="city"
                  label="City/Municipality"
                  error={Boolean(errors.city)}
                  helperText={
                    errors.city
                      ? errors.city.type === "minLength"
                        ? "City/Municipality length is more than 1"
                        : "City/Municipality is required"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              color="primary"
              onClick={submitHandler}
            >
              Continue
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}

function Continue({ fullName, address, barangay, phone, city }) {
  const signInWithGoogle = async () => {
    // Create refs for both documents
    const userDoc = firestore.doc(`shippingAddress/${auth.currentUser.uid}`);
    //const usernameDoc = firestore.doc(usernames/${formValue});

    // Commit both docs together as a batch write.
    const batch = firestore.batch();
    batch.set(userDoc, {
      id: auth.currentUser.uid,
      fullName: fullName,
      address: address,
      barangay: barangay,
      phone: phone,
      city: city,
    });
    //batch.set(usernameDoc, { uid: user.uid });
    if (!userDoc) {
      throw new Error("There was an error in uploading Shipping Address");
    }
    await batch.commit();
  };
  return (
    <Button onClick={signInWithGoogle} variant="contained">
      Sign in with Google
    </Button>
  );
}
