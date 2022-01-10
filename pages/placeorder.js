import React, { useContext, useEffect, useState } from "react";
import { Store } from "../utils/Store";
import Layout from "../component/Layout";
import dynamic from "next/dynamic";
import {
  Link,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  List,
  ListItem,
  Card,
  CircularProgress,
  CardMedia,
} from "@material-ui/core";
import NextLink from "next/link";
import { useRouter } from "next/router";
import useStyles from "../utils/style";
import CheckoutWizzard from "../component/CheckoutWizzard";
import { useSnackbar } from "notistack";
import { getError } from "../utils/error";
import axios from "axios";
import Cookies from "js-cookie";
import { UserContext } from "../lib/context";
import { shipContext } from "../lib/context";

function PlaceOrder() {
  const classes = useStyles();
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { cartItems, paymentMethod },
  } = state;
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; //123.456 -> 123.46
  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
  );
  const shippingPrice = itemsPrice > 200 ? 50 : 100;
  const taxPrice = round2(itemsPrice * 0.12);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment");
    }
    if (cartItems.length === 0) {
      router.push("/cart");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { closeSnackBar, enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const placeOrderHandler = async () => {
    // closeSnackBar();
    try {
      setLoading(true);
      //data is from data base
      // must be posted to firebase
      const { data } = await axios.post(
        "/api/order",
        {
          orderItem: cartItems,
          shippingPrice,
          paymentMethod,
          itemsPrice,
          taxPrice,
          totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch({ type: "CART_CLEAR" });
      Cookies.remove("cartItems");
      setLoading(false);
      //implement database here in the ._id
      router.push(`/order/${user.id}`);
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };
  const { ship } = useContext(shipContext);
  return (
    <Layout title="Place Order">
      <CheckoutWizzard activeStep={3}></CheckoutWizzard>
      <Typography component="h1" variant="h1">
        Place Order
      </Typography>
      <Grid container spacing={1}>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Shipping Address
                </Typography>
              </ListItem>
              <ListItem>
                {/* This should be added in the database */}
                {/* {shippingAddress.fullName},{shippingAddress.address},
                {shippingAddress.barangay},{shippingAddress.phone},
                {shippingAddress.city} */}
              </ListItem>
            </List>
          </Card>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Payment Method
                </Typography>
              </ListItem>
              <ListItem>{paymentMethod}</ListItem>
            </List>
          </Card>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Order Items
                </Typography>
              </ListItem>
              <ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell aligh="right">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <CardMedia
                              component="img"
                              image={item.imageUrl}
                              height={50}
                              width={50}
                              title={item.prodName}
                            />
                          </TableCell>

                          <TableCell>
                            <Typography>{item.prodName}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{item.quantity}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>₱{item.price}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography variant="h2">Order Summary</Typography>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Items:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">₱{itemsPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Tax:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">₱{taxPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Shipping:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">₱{shippingPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>
                      <strong>Total:</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">
                      <strong>₱{totalPrice}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  onClick={placeOrderHandler}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Place Order
                </Button>
              </ListItem>
              {loading && (
                <ListItem>
                  <CircularProgress />
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false });
