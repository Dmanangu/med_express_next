import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import NextLink from "next/link";
import React, { useEffect, useContext, useReducer, useState } from "react";
import {
  CircularProgress,
  Grid,
  List,
  ListItem,
  TableContainer,
  Typography,
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  ListItemText,
} from "@material-ui/core";
import { getError } from "../utils/error";
// import { Store } from "../utils/Store";
import Layout from "../component/Layout";
import useStyles from "../utils/style";
import { UserContext } from "../lib/context";
import { auth, postToJSON, firestore } from "../lib/firebase";

// function reducer(state, action) {
// 	switch (action.type) {
// 		case 'FETCH_REQUEST':
// 			return { ...state, loading: true, error: '' };
// 		case 'FETCH_SUCCESS':
// 			return { ...state, loading: false, orders: action.payload, error: '' };
// 		case 'FETCH_FAIL':
// 			return { ...state, loading: false, error: action.payload };
// 		default:
// 			state;
// 	}
// }

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

function OrderHistory(props) {
  // const { state } = useContext(Store);
  const router = useRouter();
  const classes = useStyles();
  // const { userInfo } = state;
  const { user } = useContext(UserContext);

  const [posts, setPosts] = useState(props.posts);
  const [posts2, setPosts2] = useState(props.posts2);

  // const [ { loading, error, orders }, dispatch ] = useReducer(reducer, {
  // 	loading: true,
  // 	orders: [],
  // 	error: ''
  // });

  const unfilterdOrderItem = posts.filter((orders) => {
    return orders.user_id.includes(auth.currentUser.uid);
  });

  const shippingData = posts2.filter((shippingAddress) => {
    return shippingAddress.id.includes(auth.currentUser.uid);
  });

  // useEffect(() => {
  // 	if (!user) {
  // 		router.push('/login');
  // 	}
  // 	const fetchOrders = async () => {
  // 		try {
  // 			dispatch({ type: 'FETCH_REQUEST' });
  // 			const { data } = await axios.get(`/api/orders/history`, {
  // 				headers: { authorization: `Bearer ${user.token}` }
  // 			});
  // 			dispatch({ type: 'FETCH_SUCCESS', payload: data });
  // 		} catch (err) {
  // 			dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
  // 		}
  // 	};
  // 	fetchOrders();
  // 	// eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  return (
    <Layout title="Order History">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/profile" passHref>
                <ListItem button component="a">
                  <ListItemText primary="User Profile" />
                </ListItem>
              </NextLink>
              <NextLink href="/order-history" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Order History" />
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Order History
                </Typography>
              </ListItem>
              <ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        {/* <TableCell>DATE</TableCell> */}
                        <TableCell>TOTAL</TableCell>
                        <TableCell>PAID</TableCell>
                        <TableCell>DELIVERED</TableCell>
                        {/* <TableCell>ACTION</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {unfilterdOrderItem.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>

                          {/* <TableCell>${order.totalPrice}</TableCell> */}
                          <TableCell>₱{order.totalPrice}</TableCell>
                          <TableCell>{order.status}</TableCell>
                          {shippingData.map((ship) => (
                            <TableCell key={ship.id}>{ship.status}</TableCell>
                          ))}

                          <TableCell>{order.delivery}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false });
