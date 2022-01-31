import {
  Button,
  List,
  ListItem,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import Layout from "../component/Layout";
import useStyles from "../utils/style";
import { useRouter } from "next/router";
import { Store } from "../utils/Store";
// import Cookies from "js-cookie";
import { Controller, useForm } from "react-hook-form";
import CheckoutWizzard from "../component/CheckoutWizzard";
import { UserContext } from "../lib/context";
import { auth, firestore, postToJSON } from "../lib/firebase";
// import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";

export async function getServerSideProps() {
  const postsQuery = firestore.collectionGroup("users");
  // .where('published', '==', true)
  // .orderBy('createdAt', 'desc')
  // .limit(LIMIT);

  const posts = (await postsQuery.get()).docs.map(postToJSON);
  // console.log(posts);
  return {
    props: { posts }, // will be passed to the page component as props
  };
}

export default function Shipping(props) {
  const { user } = useContext(UserContext);
  const {
    handleSubmit,
    control,
    formState: { errors },
    // setValue,
  } = useForm();
  const classes = useStyles();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  // const {
  //   cart: { shippingAddress },
  // } = state;
  useEffect(() => {
    if (!user) {
      alert("No user detected please login first");
      router.push("/login?redirect=/shipping");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [posts, setPosts] = useState(props.posts);

  const sendShippingData = async ({
    fullName,
    address,
    barangay,
    phone,
    city,
  }) => {
    //const userDoc = firestore.doc(`shippingAddress/${auth.currentUser.uid}`);
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
    });
    try {
      const email = posts.filter((orders) => {
        return orders.id.includes(auth.currentUser.uid);
      });
      firebase
        .firestore()
        .collection("shippingAddress")
        .doc(auth.currentUser.uid)
        .set({
          id: auth.currentUser.uid,
          fullName: fullName,
          address: address,
          barangay: barangay,
          phone: phone,
          city: city,
          email: email[0].email,
          status: "not delivered",
        })
        .then(alert("The Shipping Address was now saved."));
      router.push("/payment");
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  return (
    <Layout title="Shipping Address">
      <CheckoutWizzard activeStep={1} />
      <form onSubmit={handleSubmit(sendShippingData)} className={classes.form}>
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
                />
              )}
            />
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
                />
              )}
            />
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
                />
              )}
            />
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
                />
              )}
            />
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
              // onClick={sendShippingData}
            >
              Continue
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}

// function Continue({ fullName, address, barangay, phone, city }) {
//   const sendData = (fullname, address, barangay, phone, city) => {
//     try {
//       firebase
//         .firestore()
//         .collection("shippingAddress")
//         .doc(auth.currentUser.uid)
//         .set({
//           fullName: fullname,
//           address: address,
//           barangay: barangay,
//           phone: phone,
//           city: city,
//         })
//         .then(alert("Data was successfully sent to cloud firestore!"));
//     } catch (error) {
//       console.log(error);
//       alert(error);
//     }
//   };
//   return (
//     <Button
//       variant="contained"
//       type="submit"
//       fullWidth
//       color="primary"
//       onClick={signInWithGoogle}
//     >
//       Continue
//     </Button>
//   );
// }
