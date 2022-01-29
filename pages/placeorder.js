import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../utils/Store';
import Layout from '../component/Layout';
import dynamic from 'next/dynamic';
import {
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
	CircularProgress
} from '@material-ui/core';

import { useRouter } from 'next/router';
import useStyles from '../utils/style';
import CheckoutWizzard from '../component/CheckoutWizzard';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';
// import axios from "axios";
import Cookies from 'js-cookie';
import { UserContext } from '../lib/context';
import { auth, postToJSON, firestore } from '../lib/firebase';
import 'firebase/compat/firestore';
import firebase from 'firebase/compat/app';
import { v4 as uuidv4, v4 } from 'uuid';

//

export async function getServerSideProps() {
	const postsQuery = firestore.collectionGroup('shippingAddress');
	// .where('published', '==', true)
	// .orderBy('createdAt', 'desc')
	// .limit(LIMIT);

	const posts = (await postsQuery.get()).docs.map(postToJSON);
	// console.log("LLLLLLLLLLLLLLLLLLLLLLLL");
	// console.log(posts);
	// console.log("LLLLLLLLLLLLLLLLLLLLLLLL");
	return {
		props: { posts } // will be passed to the page component as props
	};
}

function PlaceOrder(props) {
	const [ posts ] = useState(props.posts);

	// console.log("KKKKKKKKKKKKKKKKKKKKKK");
	// console.log(shippingClient);
	// console.log(posts);
	const shippingClient = posts.filter((shippingAddress) => {
		return shippingAddress.id.includes(auth.currentUser.uid);
	});

	// console.log("KKKKKKKKKKKKKKKKKKKKKK");
	// console.log(shippingClient);
	// console.log("KKKKKKKKKKKKKKKKKKKKKK");

	const classes = useStyles();
	const router = useRouter();
	const { user } = useContext(UserContext);
	const { state, dispatch } = useContext(Store);
	const { cart: { cartItems, paymentMethod } } = state;
	const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; //123.456 -> 123.46
	const itemsPrice = round2(cartItems.reduce((a, c) => a + c.price * c.quantity, 0));
	const shippingPrice = itemsPrice > 200 ? 50 : 100;
	const taxPrice = round2(itemsPrice * 0.12);
	const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
	useEffect(() => {
		if (!paymentMethod) {
			alert('No Payment Method Yet');
			router.push('/payment');
		}
		if (cartItems.length === 0) {
			router.push('/cart');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const { enqueueSnackbar } = useSnackbar();
	const [ loading, setLoading ] = useState(false);
	const placeOrderHandler = async () => {
		// closeSnackBar();
		try {
			setLoading(true);
			firebase
				.firestore()
				.collection('orders')
				.doc(v4())
				.set({
					id: v4(),
					user_id: auth.currentUser.uid,
					orderItem: cartItems,
					paymentMethod,
					itemsPrice,
					taxPrice,
					shippingPrice,
					totalPrice
				})
				.then(alert('Your order has been generated. Thank you for shopping.'));
			dispatch({ type: 'CART_CLEAR' });
			Cookies.remove('cartItems');
			setLoading(false);
			//implement database here in the ._id
			router.push(`/order/${user.id}`);
		} catch (err) {
			setLoading(false);
			enqueueSnackbar(getError(err), { variant: 'error' });
		}
	};

	return (
		<Layout title="Place Order">
			<CheckoutWizzard activeStep={3} />
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
							{shippingClient.map((shipping) => (
								<ListItem key={shipping.id}>
									<Typography>
										<b>Name:</b> {shipping.fullName}
									</Typography>
									<Typography>
										<b>Phone Number:</b> {shipping.phone}
									</Typography>
									<Typography>
										<b>Shipping Address:</b>
										{shipping.address}
									</Typography>
									<Typography>
										<b>Barangay:</b> {shipping.barangay}
									</Typography>
									<Typography>
										<b>Municipality/City: </b>
										{shipping.city}
									</Typography>
								</ListItem>
							))}
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
														{/* eslint-disable-next-line @next/next/no-img-element */}
														<img
															// component="img"
															src={item.imageUrl}
															height={50}
															width={50}
															alt={item.prodName}
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
								<Button onClick={placeOrderHandler} variant="contained" color="primary" fullWidth>
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
