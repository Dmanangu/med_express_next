import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import Layout from "../component/Layout";
import useStyles from "../utils/style";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import { Controller, useForm } from "react-hook-form";

export default function Shipping() {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const classes = useStyles();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  useEffect(() => {
    if (!userInfo) {
      router.push("/login?redirect=/shipping");
    }
    setValue("fullName", shippingAddress.fullName);
    setValue("address", shippingAddress.address);
    setValue("baranggay", shippingAddress.barangay);
    setValue("phone", shippingAddress.phone);
    setValue("city", shippingAddress.city);
  }, []);

  const { redirect } = router.query; //login?redirect=/shipping
  const submitHandler = ({ fullName, address, baranggay, phone, city }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, baranggay, phone, city },
    }); //needs db
    Cookies.set("shippingAddress", {
      fullName,
      address,
      baranggay,
      phone,
      city,
    });
    router.push("/payment");
  };
  return (
    <Layout title="Shipping Address">
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
                  label="Address"
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
