import React, { useContext, useEffect, useReducer, useState } from "react";
// import { Store } from '../../utils/Store';
import Layout from "../../component/Layout";
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
  List,
  ListItem,
  Card,
  CircularProgress,
} from "@material-ui/core";
// import NextLink from 'next/link';
// import Image from 'next/image';
import { useRouter } from "next/router";
import useStyles from "../../utils/style";
import { useSnackbar } from "notistack";
import { getError } from "../../utils/error";
import axios from "axios";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { UserContext } from "../../lib/context";
import { auth, postToJSON, firestore } from "../../lib/firebase";

export async function getServerSideProps() {
  const postsQuery = firestore.collectionGroup("orders");
  const postsQuery2 = firestore.collectionGroup("shippingAddress");
  // .where('published', '==', true)
  // .orderBy('createdAt', 'desc')
  // .limit(LIMIT);

  const posts = (await postsQuery.get()).docs.map(postToJSON);
  const posts2 = (await postsQuery2.get()).docs.map(postToJSON);

  return {
    props: { posts, posts2 }, // will be passed to the page component as props
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" }; //action.payload is coming from backend
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: action.payload };
    default:
      state;
  }
}

//TAKE NOTE: only Authenticated User can see this

//Firebase

function Order(props) {
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const classes = useStyles();
  const router = useRouter();
  const { id } = router.query;
  // const { state } = useContext(Store);
  // const { userInfo } = state;

  const [posts, setPosts] = useState(props.posts);
  const [posts2, setPosts2] = useState(props.posts2);

  //

  const unfilterdOrderItem = posts.filter((orders) => {
    return orders.user_id.includes(auth.currentUser.uid);
  });
  const orderItem = unfilterdOrderItem.filter((orders) => {
    return orders.id.includes(id);
  });
  const shippingClient = posts2.filter((shippingAddress) => {
    return shippingAddress.id.includes(auth.currentUser.uid);
  });
  console.log(shippingClient);

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });

  const {
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  const { user } = useContext(UserContext);
  useEffect(() => {
    // if (!user) {
    //   return router.push("/login");
    // }
    const fetchOrder = async () => {
      //   try {
      //     dispatch({ type: "FETCH_REQUEST" });
      //     const { data } = await axios.get(`/api/orders/${orderId}`, {
      //       headers: { authorization: `Bearer ${user.token}` },
      //     }); //making the orders section to be seen but by authorize user only
      //     dispatch({ type: "FETCH_SUCCESS", payload: data }); //data here is from Database
      //   } catch (err) {
      //     dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      //   }
    };
    //_id is from database, may change it according to FireStore
    if (!orderItem.id || (orderItem.id && orderItem.id !== orderItem.id)) {
      fetchOrder();
    } else {
      const loadPayPalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal", {
          headers: { authorization: `Bearer ${user.token}` },
        }); //change this to firebase database

        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "PHP",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPayPalScript();
    }
  }, [orderItem.id, paypalDispatch, user.token]);
  const { enqueueSnackbar } = useSnackbar();

  function createOrder(data, actions) {
    return actions.ordr
      .create({
        purchase_unit: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${user.token}` },
          }
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        enqueueSnackbar("Order is Paid", { variant: "success" });
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) });
        enqueueSnackbar(getError(err), { variant: "error" });
      }
    });
  }
  function onError(err) {
    enqueueSnackbar(getError(err), { variant: "error" });
  }
  return (
    <Layout title={`Order ${id}`}>
      <Typography component="h1" variant="h1">
        Order {id}
      </Typography>

      {/* {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography className={classes.error}> {error} </Typography>
      ) : ( */}
      <Grid container spacing={1}>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Shipping Address
                </Typography>
              </ListItem>
              {shippingClient.map((shipping) => (
                <ListItem key={shipping.id}>
                  {shipping.fullName} &ensp; {shipping.phone} &ensp;
                  {shipping.address} &ensp;
                  {shipping.barangay} &ensp;
                  {shipping.city}
                </ListItem>
              ))}
              <ListItem>
                Status:
                {isDelivered ? `delivered at ${deliveredAt}` : "not delivered"}
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
              <ListItem>{orderItem[0].paymentMethod}</ListItem>
              <ListItem>
                Status:
                {isPaid ? `paid at ${paidAt}` : "not paid"}
              </ListItem>
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
                      {orderItem.map((item) =>
                        item.orderItem.map((doc) => (
                          <TableRow key={doc}>
                            <TableCell>
                              <Link>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={doc.imageUrl}
                                  alt={doc.prodName}
                                  width={50}
                                  height={50}
                                />
                              </Link>
                            </TableCell>

                            <TableCell>
                              <Link>
                                <Typography>{doc.prodName}</Typography>
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Typography>{doc.quantity}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography>₱{doc.price}</Typography>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
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
                    <Typography align="right">
                      ₱{orderItem[0].itemsPrice}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Tax:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">
                      ₱{orderItem[0].taxPrice}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Shipping:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">
                      ₱{orderItem[0].shippingPrice}
                    </Typography>
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
                      <strong>₱{orderItem[0].totalPrice}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Typography>
                  <b>MedExpress GCASH Number: 09457860597 </b>
                </Typography>
              </ListItem>
              <ListItem>
                <Typography>
                  <b>MedExpress PAYMAYA Number: 09457860597 </b>
                </Typography>
              </ListItem>

              {/* {!isPaid && (
                <ListItem>
                  {isPending ? (
                    <CircularProgress />
                  ) : (
                    <div className={classes.fullWidth}>
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      />
                    </div>
                  )}
                </ListItem>
              )} */}
            </List>
          </Card>
        </Grid>
      </Grid>
      {/* )} */}
    </Layout>
  );
}

// //pass Id here to the frontEnd code
// export async function getServerSideProps({ params }) {
//   return { props: { params } };
// }

export default dynamic(() => Promise.resolve(Order), { ssr: false });
